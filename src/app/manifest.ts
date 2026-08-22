import type { MetadataRoute } from 'next';

export default function manifest():MetadataRoute.Manifest{
  return {
    name:'einfachhausen',
    short_name:'einfachhausen',
    description:'Ein Ansprechpartner für alles rund ums Eigenheim.',
    start_url:'/app',
    scope:'/',
    display:'standalone',
    background_color:'#064b38',
    theme_color:'#064b38',
    lang:'de-DE',
    categories:['lifestyle','business','utilities'],
    icons:[
      {src:'/icons/icon-192.png',sizes:'192x192',type:'image/png'},
      {src:'/icons/icon-512.png',sizes:'512x512',type:'image/png'},
      {src:'/icons/icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'},
    ],
    shortcuts:[
      {name:'Hausservice',short_name:'Hausservice',url:'/app/hausmeister',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
      {name:'Mein Haus',short_name:'Mein Haus',url:'/app/home',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
      {name:'Kontakte',short_name:'Kontakte',url:'/app/messages',icons:[{src:'/icons/icon-192.png',sizes:'192x192'}]},
    ],
  };
}
