import { useState, useEffect } from 'react';

export const useTabVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  const [isOnMobile, setIsOnMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth <= 768;
      setIsOnMobile(isMobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    const handleFocus = () => {
      setIsVisible(true);
    };

    const handleBlur = () => {
      if (isOnMobile) {
        setIsVisible(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', checkMobile);
    };
  }, [isOnMobile]);

  return { isVisible, isOnMobile };
};