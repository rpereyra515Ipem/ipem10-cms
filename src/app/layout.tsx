import './globals.css';
import type { Metadata } from 'next';
import SchoolBot from '@/components/SchoolBot';

export const metadata: Metadata = {
  title: 'IPEM N° 10 Roma - Sistema Escolar',
  description: 'Portal Oficial de Comunicaciones, Gestión y Contenidos del IPEM 10 Roma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-gray-900 min-h-screen relative">
        {children}
        {/* Asistente virtual disponible en toda la web */}
        <SchoolBot />
      </body>
    </html>
  );
}
