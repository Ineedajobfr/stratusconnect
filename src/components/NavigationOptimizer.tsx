import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Component to optimize navigation and prevent page reloads
export const NavigationOptimizer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Intercept all anchor clicks and convert to React Router navigation
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        
        // Only handle internal links
        if (url.origin === window.location.origin) {
          e.preventDefault();
          navigate(url.pathname + url.search + url.hash);
        }
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [navigate]);

  // Preload critical routes
  useEffect(() => {
    const criticalRoutes = ['/enter', '/demo', '/about'];
    
    // Preload these routes after a short delay
    setTimeout(() => {
      criticalRoutes.forEach(route => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });
    }, 2000);
  }, []);

  return null;
};