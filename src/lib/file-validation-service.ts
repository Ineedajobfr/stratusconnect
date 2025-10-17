// File Validation Service
// Validates file types, sizes, and signatures for security
// Prevents malicious file uploads and ensures compliance

export interface FileValidationOptions {
  maxSize: number;
  allowedTypes: string[];
  allowedExtensions: string[];
  scanForViruses?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  fileType: string;
  fileSize: number;
  fileHash: string;
  mimeType: string;
  extension: string;
  errors: string[];
  warnings: string[];
}

class FileValidationService {
  // Default validation options
  private readonly DEFAULT_OPTIONS: FileValidationOptions = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    scanForViruses: false // Would require server-side scanning
  };

  // File signature database (magic bytes)
  private readonly FILE_SIGNATURES = {
    // Images
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    'image/webp': [0x52, 0x49, 0x46, 0x46], // RIFF header
    'image/gif': [0x47, 0x49, 0x46, 0x38], // GIF8
    'image/bmp': [0x42, 0x4D], // BM
    'image/tiff': [0x49, 0x49, 0x2A, 0x00], // II* (little endian)
    
    // Documents
    'application/pdf': [0x25, 0x50, 0x44, 0x46], // %PDF
    'application/msword': [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // OLE2
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [0x50, 0x4B, 0x03, 0x04], // ZIP (DOCX)
    
    // Archives
    'application/zip': [0x50, 0x4B, 0x03, 0x04], // ZIP
    'application/x-rar-compressed': [0x52, 0x61, 0x72, 0x21, 0x1A, 0x07, 0x00], // RAR
    'application/x-7z-compressed': [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], // 7Z
    
    // Executables (should be blocked)
    'application/x-executable': [0x4D, 0x5A], // MZ (PE/EXE)
    'application/x-elf': [0x7F, 0x45, 0x4C, 0x46], // ELF
    'application/x-mach-binary': [0xFE, 0xED, 0xFA, 0xCE], // Mach-O
  };

  // Dangerous file extensions that should always be blocked
  private readonly DANGEROUS_EXTENSIONS = [
    '.exe', '.bat', '.cmd', '.com', '.scr', '.pif', '.vbs', '.js', '.jar',
    '.sh', '.ps1', '.php', '.asp', '.jsp', '.py', '.rb', '.pl', '.cgi',
    '.bin', '.dll', '.so', '.dylib', '.app', '.deb', '.rpm', '.msi'
  ];

  /**
   * Validate a file against security and type requirements
   */
  async validateFile(
    file: File,
    options: Partial<FileValidationOptions> = {}
  ): Promise<ValidationResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const result: ValidationResult = {
      valid: true,
      fileType: file.type,
      fileSize: file.size,
      fileHash: '',
      mimeType: file.type,
      extension: this.getFileExtension(file.name),
      errors: [],
      warnings: []
    };

    // Calculate file hash
    result.fileHash = await this.calculateFileHash(file);

    // Check file size
    if (file.size > opts.maxSize) {
      result.valid = false;
      result.errors.push(
        `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds limit of ${(opts.maxSize / 1024 / 1024).toFixed(2)}MB`
      );
    }

    // Check for dangerous extensions
    if (this.DANGEROUS_EXTENSIONS.includes(result.extension.toLowerCase())) {
      result.valid = false;
      result.errors.push(`Dangerous file extension ${result.extension} is not allowed`);
    }

    // Check allowed extensions
    if (!opts.allowedExtensions.includes(result.extension.toLowerCase())) {
      result.valid = false;
      result.errors.push(
        `File extension ${result.extension} not allowed. Allowed: ${opts.allowedExtensions.join(', ')}`
      );
    }

    // Check MIME type
    if (!opts.allowedTypes.includes(file.type)) {
      result.valid = false;
      result.errors.push(
        `MIME type ${file.type} not allowed. Allowed: ${opts.allowedTypes.join(', ')}`
      );
    }

    // Validate file signature (magic bytes)
    const signatureValid = await this.validateFileSignature(file);
    if (!signatureValid) {
      result.valid = false;
      result.errors.push('File signature does not match declared type (possible file spoofing)');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = await this.checkSuspiciousPatterns(file);
    if (suspiciousPatterns.length > 0) {
      result.warnings.push(...suspiciousPatterns);
    }

    // Additional security checks
    await this.performSecurityChecks(file, result);

    return result;
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot === -1 ? '' : filename.substring(lastDot).toLowerCase();
  }

  /**
   * Calculate SHA-256 hash of file
   */
  private async calculateFileHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate file signature using magic bytes
   */
  private async validateFileSignature(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        if (!arrayBuffer) {
          resolve(false);
          return;
        }

        const bytes = new Uint8Array(arrayBuffer);
        const expectedSignature = this.FILE_SIGNATURES[file.type as keyof typeof this.FILE_SIGNATURES];
        
        if (!expectedSignature) {
          // If we don't have a signature for this type, allow it
          resolve(true);
          return;
        }

        // Check if the file starts with the expected signature
        const signatureMatch = expectedSignature.every((byte, index) => bytes[index] === byte);
        resolve(signatureMatch);
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsArrayBuffer(file.slice(0, 16)); // Read first 16 bytes
    });
  }

  /**
   * Check for suspicious patterns in file content
   */
  private async checkSuspiciousPatterns(file: File): Promise<string[]> {
    const warnings: string[] = [];
    
    // Only check text-based files for patterns
    if (!file.type.startsWith('text/') && !file.type.includes('json') && !file.type.includes('xml')) {
      return warnings;
    }

    try {
      const text = await file.text();
      
      // Check for script tags (potential XSS)
      if (text.includes('<script') || text.includes('javascript:')) {
        warnings.push('File contains script tags - potential security risk');
      }

      // Check for SQL injection patterns
      const sqlPatterns = [
        /union\s+select/i,
        /drop\s+table/i,
        /insert\s+into/i,
        /delete\s+from/i,
        /update\s+set/i
      ];
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(text)) {
          warnings.push('File contains SQL-like patterns - potential injection risk');
          break;
        }
      }

      // Check for executable patterns
      if (text.includes('#!/') || text.includes('<?php') || text.includes('<%')) {
        warnings.push('File contains executable code patterns');
      }

    } catch (error) {
      // If we can't read the file as text, that's fine
      console.log('Could not read file as text for pattern checking');
    }

    return warnings;
  }

  /**
   * Perform additional security checks
   */
  private async performSecurityChecks(file: File, result: ValidationResult): Promise<void> {
    // Check for double extensions (e.g., image.jpg.exe)
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    const hasDoubleExt = nameWithoutExt.includes('.');
    if (hasDoubleExt) {
      result.warnings.push('File has multiple extensions - verify this is intentional');
    }

    // Check for very long filenames (potential buffer overflow)
    if (file.name.length > 255) {
      result.valid = false;
      result.errors.push('Filename too long (max 255 characters)');
    }

    // Check for null bytes in filename (potential path traversal)
    if (file.name.includes('\0')) {
      result.valid = false;
      result.errors.push('Filename contains null bytes - potential security risk');
    }

    // Check for path traversal attempts
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      result.valid = false;
      result.errors.push('Filename contains path traversal characters');
    }
  }

  /**
   * Validate multiple files
   */
  async validateFiles(
    files: File[],
    options: Partial<FileValidationOptions> = {}
  ): Promise<ValidationResult[]> {
    const results = await Promise.all(
      files.map(file => this.validateFile(file, options))
    );
    return results;
  }

  /**
   * Check if file type is allowed for aircraft images
   */
  isAllowedImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Get human-readable file size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file type category
   */
  getFileCategory(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.startsWith('text/')) return 'Text';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
    if (mimeType.includes('zip') || mimeType.includes('archive')) return 'Archive';
    return 'Other';
  }
}

// Export singleton instance
export const fileValidationService = new FileValidationService();
