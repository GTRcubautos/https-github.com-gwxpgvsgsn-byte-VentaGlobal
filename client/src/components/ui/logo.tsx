import React from 'react';
import gtrLogo from '@assets/gtr_cubauto_logo.jpeg';

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
    <div className={`flex items-center gap-3 ${className}`}>
      {/* New Logo Image */}
      <div className="relative">
        <img 
          src={gtrLogo}
          alt="GTR CUBAUTO"
          width={height * 0.9}
          height={height * 0.9}
          className="object-contain transition-transform duration-300 hover:scale-105"
          style={{
            filter: 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.4)) drop-shadow(0 0 8px rgba(59, 130, 246, 0.3))',
            mixBlendMode: 'normal',
            backgroundColor: 'transparent'
          }}
          data-testid="gtr-logo-image"
        />
        
        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            borderRadius: '50%'
          }}
        />
      </div>
      
      {/* Logo Text */}
      <div className={`flex flex-col ${fontSize === 'text-lg' ? 'gap-0' : 'gap-1'}`}>
        <div className="flex items-center">
          <span className={`font-black ${fontSize} tracking-tight text-red-500`}>GTR</span>
          <span className={`${fontSize === 'text-lg' ? 'text-sm' : 'text-lg'} text-gray-400 mx-1`}>|</span>
          <span className={`font-bold ${fontSize === 'text-lg' ? 'text-base' : fontSize} tracking-wide text-blue-400`}>CUBA</span>
          <span className={`font-bold ${fontSize === 'text-lg' ? 'text-base' : fontSize} tracking-wide text-white ml-0.5`}>AUTO</span>
        </div>
        {size !== 'sm' && (
          <span className="text-xs text-gray-500 tracking-widest uppercase">
            Automotive Excellence
          </span>
        )}
      </div>
    </div>
  );
}

export default GTRLogo;