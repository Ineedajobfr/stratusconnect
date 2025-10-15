// Behavioral tracking service for enhanced security monitoring
// Collects user behavior data to detect suspicious activity

interface BehavioralData {
  hasMouseMovements: boolean;
  hasKeyboardActivity: boolean;
  hasAssetRequests: boolean;
  screenResolution: string;
  timezone: string;
  formFillSpeed: number;
  clickPattern: string[];
  navigationPattern: string[];
  requestTiming: number[];
  sessionId: string;
}

interface TrackingConfig {
  enabled: boolean;
  sampleRate: number; // 0-1, percentage of requests to track
  maxDataPoints: number;
  sendInterval: number; // milliseconds
}

class BehavioralTracker {
  private config: TrackingConfig = {
    enabled: false, // Temporarily disabled to prevent 404 errors
    sampleRate: 0.1, // Track 10% of requests
    maxDataPoints: 100,
    sendInterval: 30000 // Send data every 30 seconds
  };

  private data: BehavioralData = {
    hasMouseMovements: false,
    hasKeyboardActivity: false,
    hasAssetRequests: true,
    screenResolution: '',
    timezone: '',
    formFillSpeed: 0,
    clickPattern: [],
    navigationPattern: [],
    requestTiming: [],
    sessionId: this.generateSessionId()
  };

  private mouseMovementCount = 0;
  private keyboardActivityCount = 0;
  private clickTimestamps: number[] = [];
  private formStartTime: number | null = null;
  private requestTimestamps: number[] = [];
  private navigationHistory: string[] = [];
  private sendTimer: number | null = null;

  constructor() {
    if (this.config.enabled) {
      this.initializeTracking();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    // Get browser characteristics
    this.data.screenResolution = `${screen.width}x${screen.height}`;
    this.data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Track mouse movements
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true });
    document.addEventListener('mousedown', this.handleMouseDown.bind(this), { passive: true });

    // Track keyboard activity
    document.addEventListener('keydown', this.handleKeyDown.bind(this), { passive: true });

    // Track form interactions
    document.addEventListener('focusin', this.handleFormFocus.bind(this), { passive: true });
    document.addEventListener('focusout', this.handleFormBlur.bind(this), { passive: true });

    // Track navigation
    this.trackNavigation();

    // Start periodic data sending
    this.startPeriodicSending();

    // Track page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  private handleMouseMove(): void {
    this.mouseMovementCount++;
    this.data.hasMouseMovements = true;
  }

  private handleMouseDown(event: MouseEvent): void {
    const timestamp = Date.now();
    this.clickTimestamps.push(timestamp);
    
    // Track click patterns (approximate positions)
    const pattern = `${event.clientX},${event.clientY}`;
    this.data.clickPattern.push(pattern);
    
    // Keep only recent clicks (last 20)
    if (this.data.clickPattern.length > 20) {
      this.data.clickPattern = this.data.clickPattern.slice(-20);
    }
  }

  private handleKeyDown(): void {
    this.keyboardActivityCount++;
    this.data.hasKeyboardActivity = true;
  }

  private handleFormFocus(event: FocusEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      this.formStartTime = Date.now();
    }
  }

  private handleFormBlur(event: FocusEvent): void {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement && this.formStartTime) {
      const fillTime = Date.now() - this.formStartTime;
      if (fillTime > 0) {
        // Calculate characters per second
        const value = (event.target as HTMLInputElement).value;
        const speed = value.length / (fillTime / 1000);
        this.data.formFillSpeed = Math.max(this.data.formFillSpeed, speed);
      }
      this.formStartTime = null;
    }
  }

  private trackNavigation(): void {
    // Track current page
    this.navigationHistory.push(window.location.pathname);
    
    // Keep only recent navigation (last 10 pages)
    if (this.navigationHistory.length > 10) {
      this.navigationHistory = this.navigationHistory.slice(-10);
    }
    
    this.data.navigationPattern = [...this.navigationHistory];
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      this.trackNavigation();
    }
  }

  private startPeriodicSending(): void {
    this.sendTimer = window.setInterval(() => {
      this.sendBehavioralData();
    }, this.config.sendInterval);
  }

  public trackRequest(endpoint: string, method: string): void {
    // Only track a percentage of requests based on sample rate
    if (Math.random() > this.config.sampleRate) {
      return;
    }

    const timestamp = Date.now();
    this.requestTimestamps.push(timestamp);
    
    // Keep only recent requests (last 50)
    if (this.requestTimestamps.length > 50) {
      this.requestTimestamps = this.requestTimestamps.slice(-50);
    }
    
    this.data.requestTiming = [...this.requestTimestamps];
  }

  private async sendBehavioralData(): Promise<void> {
    try {
      // Prepare data for sending
      const dataToSend = {
        ...this.data,
        mouseMovementCount: this.mouseMovementCount,
        keyboardActivityCount: this.keyboardActivityCount,
        clickCount: this.clickTimestamps.length,
        requestCount: this.requestTimestamps.length,
        timestamp: Date.now()
      };

      // Send to behavioral monitoring endpoint
      const response = await fetch('/functions/v1/behavioral-monitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-mouse-movements': this.data.hasMouseMovements.toString(),
          'x-keyboard-activity': this.data.hasKeyboardActivity.toString(),
          'x-asset-requests': this.data.hasAssetRequests.toString(),
          'x-screen-resolution': this.data.screenResolution,
          'x-timezone': this.data.timezone,
          'x-form-fill-speed': this.data.formFillSpeed.toString(),
          'x-click-pattern': this.data.clickPattern.join(','),
          'x-navigation-pattern': this.data.navigationPattern.join(','),
          'x-request-timing': this.data.requestTiming.join(','),
          'x-session-id': this.data.sessionId
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Check if we should adjust our behavior based on risk score
        if (result.risk_score > 0.7) {
          console.warn('High risk score detected:', result.risk_score);
          // Could implement additional security measures here
        }
      }
    } catch (error) {
      console.error('Failed to send behavioral data:', error);
    }
  }

  public destroy(): void {
    if (this.sendTimer) {
      clearInterval(this.sendTimer);
      this.sendTimer = null;
    }
  }

  public getData(): BehavioralData {
    return { ...this.data };
  }

  public updateConfig(newConfig: Partial<TrackingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Create singleton instance
export const behavioralTracker = new BehavioralTracker();

// Export types for use in other modules
export type { BehavioralData, TrackingConfig };
