import { useEffect, ReactNode } from 'react';
import { useTabVisibility } from '@/hooks/useTabVisibility';
import { Shield, Eye } from 'lucide-react';

interface PrivacyProtectionProps {
  children: ReactNode;
  enabled?: boolean;
}

export const PrivacyProtection = ({ children, enabled = true }: PrivacyProtectionProps) => {
  const { isVisible, isOnMobile } = useTabVisibility();

  useEffect(() => {
    if (!enabled) return;

    // Disable text selection, copy, paste, and context menu
    const preventSelection = (e: Event) => e.preventDefault();
    const preventCopy = (e: ClipboardEvent) => e.preventDefault();
    const preventContextMenu = (e: MouseEvent) => e.preventDefault();
    const preventKeyboard = (e: KeyboardEvent) => {
      // Prevent common shortcuts
      if (
        e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'v' || e.key === 's' || e.key === 'p') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
      }
    };

    // Add CSS to disable text selection
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Add event listeners
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('paste', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventKeyboard);

    return () => {
      // Cleanup
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('paste', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventKeyboard);
      document.head.removeChild(style);
    };
  }, [enabled]);

  // Show privacy screen when tab is not visible (especially on mobile)
  if (enabled && (!isVisible || (isOnMobile && !isVisible))) {
    return (
      <div className="fixed inset-0 bg-terminal-bg z-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative mb-6">
            <Shield className="w-24 h-24 mx-auto text-terminal-glow animate-pulse" />
            <Eye className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Privacy Protection Active</h2>
          <p className="text-gunmetal max-w-md">
            This screen protects sensitive information when you switch tabs or leave the application.
            Return to this tab to continue working.
          </p>
          <div className="mt-6 text-xs text-gunmetal">
            Stratus Connect - Professional Aviation Platform
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};