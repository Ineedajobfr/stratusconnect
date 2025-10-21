import { useNavigate } from 'react-router-dom';

interface StratusConnectLogoProps {
  className?: string;
}

export const StratusConnectLogo = ({ className = "" }: StratusConnectLogoProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Always redirect to home page
    navigate('/home');
  };

  return (
    <div 
      className={`text-lg font-bold bg-black text-white px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors ${className}`}
      onClick={handleLogoClick}
    >
      STRATUSCONNECT
    </div>
  );
};
