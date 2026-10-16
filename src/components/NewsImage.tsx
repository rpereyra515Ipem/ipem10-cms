'use client';

import { useState } from 'react';
import SchoolLogo from '@/components/SchoolLogo';

export default function NewsImage({
  src,
  size = 'md',
}: {
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hasError, setHasError] = useState(false);

  // Si no hay imagen o dio error 404, muestra el ESCUDO OFICIAL sobre el verde esmeralda
  if (!src || hasError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Escudo Oficial del IPEM N° 10 Roma */}
        <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
          <SchoolLogo size={size === 'lg' ? 'lg' : 'md'} />
        </div>
        
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-2.5 relative z-10 drop-shadow-sm">
          IPEM N° 10 Roma
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setHasError(true)}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
    />
  );
}
