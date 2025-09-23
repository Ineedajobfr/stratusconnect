import { useNavigate } from 'react-router-dom';

interface StratusConnectLogoProps {
  className?: string;
  terminalType?: 'broker' | 'operator' | 'crew' | 'pilot' | 'main';
}

export const StratusConnectLogo = ({ className = "", terminalType = 'main' }: StratusConnectLogoProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    // Always redirect to home page
    navigate('/');
  };

  const getLogoText = () => {
    switch (terminalType) {
      case 'broker':
        return 'StratusBroker';
      case 'operator':
        return 'StratusOperator';
      case 'crew':
        return 'StratusCrew';
      case 'pilot':
        return 'StratusPilot';
      case 'main':
      default:
        return 'StratusConnect';
    }
  };

  return (
    <h1 
      className={`text-4xl font-bold text-white cursor-pointer transition-all duration-300 hover:scale-105 
        drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] 
        hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]
        ${className}`}
      onClick={handleLogoClick}
    >
      {getLogoText()}
    </h1>
  );
};