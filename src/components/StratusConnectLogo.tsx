import { useNavigate } from "react-router-dom";

interface StratusConnectLogoProps {
  className?: string;
}

export const StratusConnectLogo = ({ className = "" }: StratusConnectLogoProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Stay on current page or go to home if on a terminal page
    const currentPath = window.location.pathname;
    if (currentPath.includes('/terminal/') || currentPath.includes('/beta/')) {
      // If on a terminal page, go to home
      navigate('/');
    }
    // Otherwise, do nothing (stay on current page)
  };

  return (
    <h1 
      className={`text-2xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] ${className}`}
      onClick={handleLogoClick}
    >
      StratusConnect
    </h1>
  );
};