import type { Metadata,Viewport } from 'next';
import './globals.css';
import './design-system.css';
import { PwaRegister } from '@/components/pwa-register';
import { AuthProvider } from '@/components/AuthContext';
import NativeInit from '@/components/NativeInit';

export const metadata: Metadata = {
  applicationName:'Einfach Hausen',
  title:{default:'Einfach Hausen · Alles rund ums Eigenheim',template:'%s · Einfach Hausen'},
  description:'Ein Ansprechpartner für alles rund ums Eigenheim. Fragen klären, passende Menschen finden, Aufträge organisieren und Hauswissen an einem Ort behalten.',
  manifest:'/manifest.webmanifest',
  appleWebApp:{capable:true,statusBarStyle:'black-translucent',title:'Einfach Hausen'},
  formatDetection:{telephone:false},
  icons:{icon:[{url:'/icons/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/icons/icon-192.png',sizes:'192x192',type:'image/png'}],apple:[{url:'/icons/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]},
};

export const viewport:Viewport={width:'device-width',initialScale:1,viewportFit:'cover',themeColor:'#ffffff'};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="de"><body><NativeInit><AuthProvider><PwaRegister/>{children}</AuthProvider></NativeInit></body></html>;
}
