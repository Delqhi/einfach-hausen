import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title:'Einfach Hausen · Dein KI-Hausmeister', description:'Du sagst, was dein Haus braucht. Wir kümmern uns um den Rest.' };
export default function RootLayout({children}:{children:React.ReactNode}){ return <html lang="de"><body>{children}</body></html>; }
