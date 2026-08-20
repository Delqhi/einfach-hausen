import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title:'Mein Hausmeister', description:'Sagen. Vergleichen. Buchen. Erledigt.' };
export default function RootLayout({children}:{children:React.ReactNode}){ return <html lang="de"><body>{children}</body></html>; }
