import React from 'react';
import gtrLogo from '@assets/gtr_cubauto_logo_new.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export function GTRLogo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizeMap = {
    sm: { width: 80, height: 32, fontSize: 'text-lg' },
    md: { width: 120, height: 48, fontSize: 'text-2xl' },
    lg: { width: 160, height: 64, fontSize: 'text-3xl' },
    xl: { width: 200, height: 80, fontSize: 'text-4xl' }
  };

  const { width, height, fontSize } = sizeMap[size];

  if (variant === 'icon') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <img 
          src={gtrLogo}
          alt="GTR CUBAUTO"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))',
            mixBlendMode: 'normal',
            backgroundColor: 'transparent'
          }}
          data-testid="gtr-logo-icon"
        />
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`flex items-center ${className}`}>
        <span className={`font-black ${fontSize} tracking-tight`}>
          <span className="text-red-500">GTR</span>
          <span className="text-gray-300 mx-1">|</span>
          <span className="text-blue-400">CUBA</span>
          <span className="text-white">AUTO</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {/* Professional GTR CUBAUTO Logo */}
      <div className="relative">
        <img 
          src={gtrLogo}
          alt="GTR CUBAUTO"
          width={width}
          height={height}
          className="object-contain transition-all duration-300 hover:scale-105 hover:brightness-110"
          style={{
            filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 16px rgba(59, 130, 246, 0.2))',
            mixBlendMode: 'normal'
          }}
          data-testid="gtr-logo-image"
        />
        
        {/* Professional glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.4) 0%, transparent 70%)',
            borderRadius: '12px'
          }}
        />
      </div>
    </div>
  );
}

export default GTRLogo;