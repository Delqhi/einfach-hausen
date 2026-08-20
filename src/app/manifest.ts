import type { MetadataRoute } from 'next';

export default function manifest():MetadataRoute.Manifest{return {name:'Einfach Hausen',short_name:'Einfach Hausen',description:'Dein KI-Hausmeister für das Eigenheim',start_url:'/app',display:'standalone',background_color:'#f6f8f6',theme_color:'#267220',lang:'de-DE',categories:['lifestyle','business','utilities']};}
