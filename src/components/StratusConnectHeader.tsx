import React from 'react';
import { useNavigate } from 'react-router-dom';

interface StratusConnectHeaderProps {
  className?: string;
}

export const StratusConnectHeader: React.FC<StratusConnectHeaderProps> = ({ 
  className = "" 
}) => {
  const navigate = useNavigate();

  return (
    <div 
      className={`absolute top-8 left-8 text-white text-lg font-bold bg-black px-6 py-3 rounded backdrop-blur-sm cursor-pointer hover:bg-gray-800 transition-colors z-20 ${className}`}
      onClick={() => navigate('/home')}
    >
      STRATUSCONNECT
    </div>
  );
};

export default StratusConnectHeader;










