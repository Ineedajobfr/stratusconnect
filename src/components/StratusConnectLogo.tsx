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
      className={`text-2xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-110 
        drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] 
        hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]
        shadow-[0_0_10px_rgba(255,165,0,0.3)]
        hover:shadow-[0_0_20px_rgba(255,165,0,0.6)]
        ${className}`}
      onClick={handleLogoClick}
    >
      StratusConnect
    </h1>
  );
};