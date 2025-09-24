import { useNavigate } from 'react-router-dom';

interface StratusConnectLogoProps {
  className?: string;
}

export const StratusConnectLogo = ({ className = "" }: StratusConnectLogoProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Always redirect to home page
    navigate('/');
  };

  return (
    <h1 
      className={`text-4xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105 
        drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] 
        hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]
        ${className}`}
      onClick={handleLogoClick}
    >
      StratusConnect
    </h1>
  );
};