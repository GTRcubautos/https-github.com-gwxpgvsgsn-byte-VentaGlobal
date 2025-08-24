import React from 'react';

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
        <svg 
          width={width * 0.8} 
          height={height * 0.8} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Círculo exterior futurista */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            stroke="url(#gradient1)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
          />
          
          {/* Hexágono central */}
          <path 
            d="M25 35 L50 20 L75 35 L75 65 L50 80 L25 65 Z" 
            fill="url(#gradient2)" 
            stroke="rgba(239, 68, 68, 0.8)" 
            strokeWidth="1.5"
          />
          
          {/* Letra G estilizada */}
          <path 
            d="M35 40 Q30 35 35 30 Q45 25 55 30 Q60 35 55 40 L55 50 L45 50 L45 45 L50 45 L50 40 Q47 37 42 37 Q37 37 35 40 Z" 
            fill="white"
          />
          
          {/* Efectos de velocidad */}
          <path 
            d="M20 45 L35 48 L20 51 Z" 
            fill="url(#gradient3)" 
            opacity="0.7"
          />
          <path 
            d="M15 40 L30 43 L15 46 Z" 
            fill="url(#gradient3)" 
            opacity="0.5"
          />
          <path 
            d="M10 35 L25 38 L10 41 Z" 
            fill="url(#gradient3)" 
            opacity="0.3"
          />
          
          {/* Definición de gradientes */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#1F2937" />
            </linearGradient>
            
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1F2937" />
              <stop offset="50%" stopColor="#374151" />
              <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            
            <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
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
      {/* Logo Icon */}
      <div className="relative">
        <svg 
          width={height * 0.9} 
          height={height * 0.9} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Anillo exterior con efecto neón */}
          <circle 
            cx="50" 
            cy="50" 
            r="47" 
            stroke="url(#outerGradient)" 
            strokeWidth="1.5" 
            fill="none"
            className="opacity-60"
          />
          
          {/* Forma principal del logo */}
          <path 
            d="M20 30 Q50 10 80 30 Q85 50 80 70 Q50 90 20 70 Q15 50 20 30 Z" 
            fill="url(#mainGradient)" 
            stroke="rgba(239, 68, 68, 0.6)" 
            strokeWidth="1"
          />
          
          {/* Letras GTR integradas */}
          <g fill="white" fontSize="16" fontWeight="bold" fontFamily="Inter, sans-serif">
            {/* G */}
            <path d="M25 35 Q20 30 25 25 Q35 20 45 25 Q50 30 45 35 L45 45 L35 45 L35 40 L40 40 L40 35 Q37 32 32 32 Q27 32 25 35 Z" />
            
            {/* T */}
            <rect x="48" y="25" width="3" height="20" />
            <rect x="43" y="25" width="13" height="3" />
            
            {/* R */}
            <path d="M60 25 L60 45 L63 45 L63 36 L70 36 Q73 36 73 32 Q73 28 70 28 L63 28 L63 25 Z M63 28 L70 28 Q70 32 70 33 L63 33 Z L70 36 L75 45 L78 45 L72 36" />
          </g>
          
          {/* Elementos de velocidad y tecnología */}
          <g opacity="0.8">
            <path d="M15 45 L25 47 L15 49 Z" fill="#EF4444" />
            <path d="M12 42 L22 44 L12 46 Z" fill="#3B82F6" opacity="0.7" />
            <path d="M10 39 L20 41 L10 43 Z" fill="#6B7280" opacity="0.5" />
          </g>
          
          {/* Detalles tecnológicos */}
          <circle cx="75" cy="25" r="2" fill="#EF4444" opacity="0.8" />
          <circle cx="80" cy="35" r="1.5" fill="#3B82F6" opacity="0.6" />
          <circle cx="78" cy="45" r="1" fill="#6B7280" opacity="0.4" />
          
          {/* Gradientes */}
          <defs>
            <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#EF4444" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6B7280" stopOpacity="0.7" />
            </linearGradient>
            
            <radialGradient id="mainGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#374151" />
              <stop offset="70%" stopColor="#1F2937" />
              <stop offset="100%" stopColor="#111827" />
            </radialGradient>
          </defs>
        </svg>
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