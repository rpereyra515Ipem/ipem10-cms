'use client';

import { useState } from 'react';
import Link from 'next/link';
import { importarDocentesAction, DocenteImportItem } from '@/actions/bulk-users';

export default function CargaMasivaClient() {
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [docentes, setDocentes] = useState<DocenteImportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const parseCSVText = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      setErrorMsg('El archivo debe tener al menos una fila de encabezados y un registro.');
      return;
    }

    const headerLine = lines[0];
    const separator = headerLine.includes(';') ? ';' : ',';
    const headers = headerLine.split(separator).map((h) => h.trim().toLowerCase().replace(/["']/g, ''));
    
    const idxEmail = headers.findIndex((h) => h.includes('email') || h.includes('correo') || h.includes('institucional'));
    const idxNombre = headers.findIndex((h) => h.includes('nombre') || h.includes('apellido') || h.includes('docente'));
    const idxPersonal = headers.findIndex((h) => h.includes('personal') || h.includes('alternativo') || h.includes('privado'));
    const idxRol = headers.findIndex((h) => h.includes('rol') || h.includes('cargo') || h.includes('funcion'));

    if (idxEmail === -1) {
      setErrorMsg('No se encontró una columna de correo electrónico institucional (debe llamarse email o correo).');
      return;
    }

    const parsed: DocenteImportItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(separator).map((c) => c.trim().replace(/^["']|["']$/g, ''));
      const email = row[idxEmail] || '';
      if (!email) continue;

      parsed.push({
        email,
        nombre: idxNombre !== -1 ? row[idxNombre] : 'Docente IPEM 10',
        personalEmail: idxPersonal !== -1 ? row[idxPersonal] : undefined,
        rol: idxRol !== -1 ? row[idxRol] : 'DOCENTE',
      });
    }

    setDocentes(parsed);
    setErrorMsg('');
    setResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSVText(text);
    };
    reader.readAsText(file);
  };

  const handleFetchGoogleSheet = async () => {
    if (!googleSheetUrl) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const match = googleSheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        setErrorMsg('URL de Google Sheets inválida. Formato: https://docs.google.com/spreadsheets/d/ID_DE_LA_HOJA/edit');
        setLoading(false);
        return;
      }

      const sheetId = match[1];
      const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      const res = await fetch(exportUrl);
      if (!res.ok) {
        throw new Error('No se pudo acceder a la planilla. Verifica que esté configurada como "Cualquiera con el enlace puede leer".');
      }

      const csvText = await res.text();
      parseCSVText(csvText);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con Google Sheets.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarImportacion = async () => {
    if (docentes.length === 0) return;
    setLoading(true);
    setErrorMsg('');

    const res = await importarDocentesAction(docentes);
    setLoading(false);

    if (res.success) {
      setResult(res);
      setDocentes([]);
    } else {
      setErrorMsg(res.error || 'Ocurrió un error al procesar la nómina.');
    }
  };

  const descargarPlantilla = () => {
    const csvContent = "data:text/csv;charset=utf-8,nombre,email,personal_email,rol\nJuan Perez,jperez@ipem10.edu.ar,juan.perez@gmail.com,DOCENTE\nMaria Gomez,mgomez@ipem10.edu.ar,maria.gomez@gmail.com,DOCENTE\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla_docentes_ipem10.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <header className="bg-emerald-900 border-b-4 border-amber-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-300">
              10
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-400 text-emerald-950 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                  Área Restringida
                </span>
                <span className="text-xs text-emerald-200">Secretaría / Dirección</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Carga Masiva de Planta Docente
              </h1>
            </div>
          </div>

          <Link
            href="/secretaria"
            className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold border border-emerald-700 transition"
          >
            ← Volver a Secretaría
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opción 1: CSV */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded">
                  Opción 1: Archivo CSV
                </span>
                <button
                  onClick={descargarPlantilla}
                  className="text-xs text-emerald-700 hover:underline font-semibold"
                >
                  📥 Bajar Plantilla Modelo
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Subir Archivo CSV o Excel</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Exporta la nómina desde el sistema o Excel guardándola como <strong>.CSV</strong>.
              </p>
            </div>

            <div className="mt-6">
              <label className="block w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-xl p-6 text-center cursor-pointer transition">
                <span className="text-3xl block mb-2">📁</span>
                <span className="text-sm font-semibold text-emerald-900 block">
                  Seleccionar o arrastrar archivo .CSV
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  Compatible con separador por comas (,) o punto y coma (;)
                </span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Opción 2: Google Sheets */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded">
                Opción 2: Google Sheets
              </span>
              <h3 className="text-lg font-bold text-slate-800 mt-3">Importar desde Hoja de Cálculo</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Pega el enlace de la planilla compartida de Google Drive con columnas <code>nombre</code> y <code>email</code>.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <input
                type="url"
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                value={googleSheetUrl}
                onChange={(e) => setGoogleSheetUrl(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleFetchGoogleSheet}
                disabled={loading || !googleSheetUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-slate-300 text-white font-bold text-xs transition shadow-sm"
              >
                {loading ? 'Leyendo planilla...' : 'Conectar y Leer Google Sheet'}
              </button>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {result && (
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-2">
            <h3 className="font-bold text-lg text-emerald-900">
              ✅ Nómina Procesada con Éxito
            </h3>
            <p className="text-sm">
              Se crearon <strong>{result.creados} nuevos docentes</strong> y se actualizaron <strong>{result.actualizados} existentes</strong>.
            </p>
            {result.errores.length > 0 && (
              <div className="mt-3 text-xs text-amber-900 bg-amber-100/60 p-3 rounded-lg">
                <strong>Observaciones ({result.errores.length}):</strong>
                <ul className="list-disc list-inside mt-1">
                  {result.errores.map((err: string, idx: number) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-3">
              <Link
                href="/admin/usuarios"
                className="inline-block py-2 px-4 rounded-lg bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition"
              >
                Ver Lista de Usuarios en Administración →
              </Link>
            </div>
          </div>
        )}

        {docentes.length > 0 && (
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Previsualización de Docentes Detectados ({docentes.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Verifica que los correos correspondan a <code>@ipem10.edu.ar</code> antes de confirmar.
                </p>
              </div>

              <button
                type="button"
                onClick={handleConfirmarImportacion}
                disabled={loading}
                className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-black text-sm transition shadow-md"
              >
                {loading ? 'Guardando en Base de Datos...' : `Confirmar e Importar (${docentes.length}) Docentes`}
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Nombre y Apellido</th>
                    <th className="py-2.5 px-3">Email Institucional</th>
                    <th className="py-2.5 px-3">Email Personal (Opcional)</th>
                    <th className="py-2.5 px-3">Rol</th>
                    <th className="py-2.5 px-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {docentes.map((d, index) => {
                    const isIpemDomain = d.email.trim().toLowerCase().endsWith('@ipem10.edu.ar');
                    return (
                      <tr key={index} className={isIpemDomain ? 'hover:bg-slate-50' : 'bg-rose-50/50'}>
                        <td className="py-2.5 px-3 text-slate-400 font-mono">{index + 1}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{d.nombre}</td>
                        <td className="py-2.5 px-3 font-mono">{d.email}</td>
                        <td className="py-2.5 px-3 text-slate-500">{d.personalEmail || '-'}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-800">{d.rol}</td>
                        <td className="py-2.5 px-3">
                          {isIpemDomain ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Válido
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                              ⚠️ No es @ipem10.edu.ar
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
