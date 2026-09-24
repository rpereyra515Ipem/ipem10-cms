'use client';

import React, { useState } from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SchoolLogo({ className = '', size = 'md' }: SchoolLogoProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-28 h-28',
  };

  // Si la imagen física /escudo.png existe en public/, la renderiza con recorte
  if (!imgError) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <img
          src="/escudo.png"
          alt="Escudo Oficial IPEM N° 10 Roma"
          className="w-full h-full object-contain drop-shadow-md"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Respaldo vectorial con los colores oficiales (Verde y Rojo)
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-br from-emerald-900 to-green-950 text-white shadow-md border border-red-700 select-none ${sizeClasses[size]} ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none">
        <path
          d="M50 6 C24 6 16 18 16 46 C16 75 50 94 50 94 C50 94 84 75 84 46 C84 18 76 6 50 6 Z"
          fill="#047857"
          stroke="#b91c1c"
          strokeWidth="4"
        />
        <text x="50" y="30" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">
          IPEM 10
        </text>
        <text x="50" y="44" textAnchor="middle" fill="#facc15" fontSize="12" fontWeight="900">
          ROMA
        </text>
        <path d="M35 58 Q50 66 65 58" stroke="#ffffff" strokeWidth="3" fill="none" />
        <text x="50" y="80" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">
          CÓRDOBA
        </text>
      </svg>
    </div>
  );
}
