'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import SchoolLogo from '@/components/SchoolLogo';

function formatDate(dateValue: any) {
  if (!dateValue) return 'Reciente';
  try {
    return new Date(dateValue).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return 'Reciente';
  }
}

export default function NoticiasListClient({ initialPosts }: { initialPosts: any[] }) {
  const [sortOrder, setSortOrder] = useState<'RECIENTE' | 'ANTIGUO'>('RECIENTE');
  const [selectedYear, setSelectedYear] = useState<string>('TODOS');
  const [search, setSearch] = useState('');

  // Detectar años únicos presentes en las noticias
  const years = useMemo(() => {
    const setYears = new Set<string>();
    initialPosts.forEach((p) => {
      if (p.publishedAt) {
        const y = new Date(p.publishedAt).getFullYear().toString();
        if (!isNaN(Number(y))) setYears.add(y);
      }
    });
    return Array.from(setYears).sort((a, b) => Number(b) - Number(a));
  }, [initialPosts]);

  // Filtrar y ordenar en memoria al instante
  const filteredPosts = useMemo(() => {
    return initialPosts
      .filter((post) => {
        const term = search.toLowerCase();
        const matchTitle = post.title?.toLowerCase().includes(term);
        const matchExcerpt = post.excerpt?.toLowerCase().includes(term);
        const matchSearch = !search || matchTitle || matchExcerpt;

        let matchYear = true;
        if (selectedYear !== 'TODOS') {
          const y = post.publishedAt ? new Date(post.publishedAt).getFullYear().toString() : '';
          matchYear = y === selectedYear;
        }

        return matchSearch && matchYear;
      })
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return sortOrder === 'RECIENTE' ? dateB - dateA : dateA - dateB;
      });
  }, [initialPosts, sortOrder, selectedYear, search]);

  return (
    <div className="space-y-6">
      {/* Barra de Filtros, Orden y Búsqueda */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Buscador */}
        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Buscar por palabra o tema..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Controles de Orden y Fecha */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Selector de Año */}
          {years.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-500">Año:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-emerald-500"
              >
                <option value="TODOS">Todos los años</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}

          {/* Selector de Orden */}
          <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSortOrder('RECIENTE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                sortOrder === 'RECIENTE'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔽 Más recientes
            </button>
            <button
              type="button"
              onClick={() => setSortOrder('ANTIGUO')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                sortOrder === 'ANTIGUO'
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔼 Más antiguos
            </button>
          </div>
        </div>
      </div>

      {/* Indicador de Resultados */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <span>
          Mostrando <strong>{filteredPosts.length}</strong> de {initialPosts.length} comunicados
        </span>
        <span className="font-mono text-emerald-800 font-bold">
          {sortOrder === 'RECIENTE' ? 'Orden: Cronológico descendente' : 'Orden: Cronológico ascendente'}
        </span>
      </div>

      {/* Grilla de Publicaciones */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <span className="text-4xl block mb-2">🔍</span>
          <h3 className="text-base font-bold text-slate-700">No se encontraron comunicados</h3>
          <p className="text-xs text-slate-400 mt-1">Prueba con otra palabra clave o selecciona "Todos los años".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Contenedor Esmeralda con Escudo Oficial */}
                <div className="h-48 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-4 text-center select-none">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                    <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-300">
                      <SchoolLogo size="md" className="drop-shadow-lg" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-2 relative z-10">
                      IPEM N° 10 Roma
                    </span>
                  </div>

                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="w-full h-full object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  )}

                  <span className="absolute top-3 left-3 text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm z-20">
                    {post.type}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-medium text-slate-400 block">
                    {formatDate(post.publishedAt)}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-emerald-800 transition-colors">
                    <Link href={`/noticias/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed">
                    {post.excerpt || 'Haz clic para leer el comunicado completo.'}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[11px]">Lectura disponible</span>
                <Link
                  href={`/noticias/${post.slug}`}
                  className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
                >
                  <span>Leer comunicado →</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
