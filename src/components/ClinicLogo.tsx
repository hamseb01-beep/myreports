import React from 'react';

interface ClinicLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'emerald' | 'navy';
  size?: number | string;
}

export const ClinicLogo: React.FC<ClinicLogoProps> = ({
  className = 'w-8 h-8',
  variant = 'dark',
  size
}) => {
  let colorClass = 'text-slate-900';
  if (variant === 'light') colorClass = 'text-white';
  if (variant === 'emerald') colorClass = 'text-[#0a6b2f]';
  if (variant === 'navy') colorClass = 'text-[#0d2350]';

  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 240"
      fill="currentColor"
      className={`${colorClass} ${className} shrink-0`}
      style={style}
      aria-label="Beergeel Clinic Logo"
    >
      {/* Mother's Head */}
      <circle cx="100" cy="30" r="18" />

      {/* Mother's Body Sweeping Arm/Silhouette */}
      <path d="M 100 50 
               C 50 50 22 90 22 135 
               C 22 175 48 200 62 205
               C 48 185 38 160 38 135 
               C 38 98 62 65 100 65 
               C 140 65 178 95 178 140 
               C 178 190 140 225 98 240 
               C 152 220 196 182 196 135 
               C 196 82 152 50 100 50 Z" />

      {/* Baby's Head */}
      <circle cx="138" cy="88" r="12" />

      {/* Baby's Body Sweeping Inner Crescent */}
      <path d="M 138 102 
               C 115 102 96 118 96 142 
               C 96 168 116 182 128 185 
               C 114 172 108 158 108 142 
               C 108 126 122 112 138 112 
               C 154 112 166 126 166 142 
               C 166 158 150 172 138 178 
               C 158 170 176 155 176 140 
               C 176 118 158 102 138 102 Z" />
    </svg>
  );
};
