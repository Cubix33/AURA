import React from 'react';

interface AuraLogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  theme?: 'terracotta' | 'gold' | 'dark' | 'light' | 'white';
  showSubtitle?: boolean;
}

export const AuraLogo: React.FC<AuraLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  iconClassName = '',
  textClassName = '',
  theme = 'terracotta',
  showSubtitle = false,
}) => {
  // Dimensions map
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    custom: '',
  };

  const textSizes = {
    sm: 'text-lg tracking-[0.18em]',
    md: 'text-2xl tracking-[0.22em]',
    lg: 'text-3xl sm:text-4xl tracking-[0.25em]',
    xl: 'text-4xl sm:text-5xl tracking-[0.28em]',
    custom: '',
  };

  // Color schemes
  const colorMap = {
    terracotta: {
      primary: '#8E3B22',
      secondary: '#C97A5E',
      dark: '#5E2210',
      text: '#2B231F',
      accent: '#E89E86',
      subText: '#8E3B22',
    },
    gold: {
      primary: '#D4AF37',
      secondary: '#E6CA65',
      dark: '#8C6D1F',
      text: '#F5E8C7',
      accent: '#F3E5AB',
      subText: '#D4AF37',
    },
    dark: {
      primary: '#2B231F',
      secondary: '#54463E',
      dark: '#140F0D',
      text: '#2B231F',
      accent: '#8E3B22',
      subText: '#54463E',
    },
    light: {
      primary: '#FAF7F2',
      secondary: '#EADFD5',
      dark: '#FFFFFF',
      text: '#FAF7F2',
      accent: '#E89E86',
      subText: '#E8D5CE',
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#F5EBE6',
      dark: '#FFFFFF',
      text: '#FFFFFF',
      accent: '#E89E86',
      subText: '#FFFFFF',
    },
  };

  const colors = colorMap[theme];

  // The celestial emblem icon component matching the exact uploaded graphics:
  // 1. Dual crescent moons forming the vertical oval frame
  // 2. Sweeping diagonal elliptical orbit ring wrapping through the center
  // 3. Central 4-pointed radiant star with sharp points
  // 4. Vertical axis aligned celestial dots (graduated dots above & below)
  const EmblemIcon = (
    <svg
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${iconSizes[size]} ${iconClassName} shrink-0 select-none`}
    >
      <defs>
        {/* Main Gradient for Left Crescent & Swoop */}
        <linearGradient id={`aura-grad-main-${theme}`} x1="20" y1="15" x2="140" y2="145" gradientUnits="userSpaceOnUse">
          {theme === 'gold' ? (
            <>
              <stop offset="0%" stopColor="#F9F1D8" />
              <stop offset="45%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#997517" />
            </>
          ) : theme === 'white' || theme === 'light' ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F5EAE4" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#DE8E73" />
              <stop offset="40%" stopColor="#B35234" />
              <stop offset="100%" stopColor="#6E2816" />
            </>
          )}
        </linearGradient>

        {/* Right Crescent Shadow Gradient */}
        <linearGradient id={`aura-grad-dark-${theme}`} x1="145" y1="20" x2="70" y2="140" gradientUnits="userSpaceOnUse">
          {theme === 'gold' ? (
            <>
              <stop offset="0%" stopColor="#E6CA65" />
              <stop offset="100%" stopColor="#7A5B0B" />
            </>
          ) : theme === 'white' || theme === 'light' ? (
            <>
              <stop offset="0%" stopColor="#E8D5CE" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#C97A5E" />
              <stop offset="70%" stopColor="#7A3622" />
              <stop offset="100%" stopColor="#4A1C0E" />
            </>
          )}
        </linearGradient>

        {/* Radiant Center Star Gradient */}
        <linearGradient id={`aura-grad-star-${theme}`} x1="60" y1="60" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          {theme === 'gold' ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#F7E7B4" />
              <stop offset="100%" stopColor="#D4AF37" />
            </>
          ) : theme === 'white' || theme === 'light' ? (
            <>
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FAF0EB" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#F5D0C5" />
              <stop offset="60%" stopColor="#B8583B" />
              <stop offset="100%" stopColor="#7A321E" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* 1. Left Crescent Portal Arch */}
      <path
        d="M 80,16 C 52,18 26,44 26,78 C 26,110 48,138 80,144 C 70,140 40,120 40,78 C 40,46 62,24 80,16 Z"
        fill={`url(#aura-grad-main-${theme})`}
      />

      {/* 2. Right Crescent Portal Arch */}
      <path
        d="M 80,16 C 98,24 120,46 120,78 C 120,120 90,140 80,144 C 112,138 134,110 134,78 C 134,44 108,18 80,16 Z"
        fill={`url(#aura-grad-dark-${theme})`}
      />

      {/* 3. Sweeping Planetary Orbit Ring (Tilted Oval with tapered swoops) */}
      <path
        d="M 12,88 C 10,74 24,62 52,66 C 72,68 90,78 114,84 C 136,90 152,84 148,94 C 144,102 126,104 98,96 C 74,90 54,78 32,76 C 18,74 13,80 12,88 Z"
        fill={`url(#aura-grad-main-${theme})`}
        opacity="0.9"
      />

      {/* 4. Lower Dynamic Swirl Tail */}
      <path
        d="M 80,144 C 68,140 54,128 64,112 C 70,102 80,114 88,124 C 94,132 86,142 80,144 Z"
        fill={`url(#aura-grad-main-${theme})`}
        opacity="0.7"
      />

      {/* 5. Central Symmetrical 4-Pointed Sparkle / Diamond Star */}
      <path
        d="M 80,48 Q 80,80 56,80 Q 80,80 80,112 Q 80,80 104,80 Q 80,80 80,48 Z"
        fill={`url(#aura-grad-star-${theme})`}
      />

      {/* 6. Vertical Aligned Celestial Dots */}
      {/* Top Outer Dot */}
      <circle
        cx="80"
        cy="34"
        r="3.2"
        fill={theme === 'gold' ? '#D4AF37' : theme === 'white' || theme === 'light' ? '#FFFFFF' : '#8E3B22'}
      />
      {/* Top Inner Dot */}
      <circle
        cx="80"
        cy="42"
        r="2.2"
        fill={theme === 'gold' ? '#E6CA65' : theme === 'white' || theme === 'light' ? '#FFFFFF' : '#8E3B22'}
      />

      {/* Bottom Inner Dot */}
      <circle
        cx="80"
        cy="118"
        r="2.2"
        fill={theme === 'gold' ? '#E6CA65' : theme === 'white' || theme === 'light' ? '#FFFFFF' : '#8E3B22'}
      />
      {/* Bottom Outer Dot */}
      <circle
        cx="80"
        cy="126"
        r="3.2"
        fill={theme === 'gold' ? '#D4AF37' : theme === 'white' || theme === 'light' ? '#FFFFFF' : '#8E3B22'}
      />
    </svg>
  );

  // SVG-Styled Wordmark matching the high-contrast luxury serif in the uploaded image
  const WordmarkText = (
    <div className={`flex flex-col select-none ${textClassName}`}>
      <span
        className={`font-serif-editorial font-bold leading-none ${textSizes[size]}`}
        style={{ color: colors.text }}
      >
        AURA
      </span>
      {showSubtitle && (
        <span
          className="text-[8px] sm:text-[9px] tracking-[0.24em] uppercase font-bold mt-1"
          style={{ color: colors.subText }}
        >
          Rhythm Intelligence
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{EmblemIcon}</div>;
  }

  if (variant === 'wordmark') {
    return <div className={`inline-flex items-center ${className}`}>{WordmarkText}</div>;
  }

  if (variant === 'stacked') {
    return (
      <div className={`inline-flex flex-col items-center justify-center text-center gap-1.5 ${className}`}>
        {EmblemIcon}
        {WordmarkText}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {EmblemIcon}
      {WordmarkText}
    </div>
  );
};

