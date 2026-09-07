/** Canonical HTML adapter for the Cloudflare CRM. User values are escaped; content slots accept trusted component output only. */
import {EHHtmlStyles,EHLogoData} from "./html-style.mjs";
export const escapeEH=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function hrefEH(value){const s=String(value);if(!/^(?:\/(?!\/)|#|https?:\/\/|mailto:|tel:)/i.test(s))throw Error("Unsupported link scheme");return escapeEH(s);}
export function EHHtmlLogo({href="/"}={}) {return '<a class="eh-logoLink" href="'+hrefEH(href)+'" aria-label="einfachhausen – Startseite"><img class="eh-logo" src="'+EHLogoData+'" alt="einfachhausen" width="126"></a>';}
export function EHHtmlButton({label,href,type="button",name,value,variant="primary"}) {
 if(!["primary","secondary","quiet","on-dark","danger"].includes(variant))throw Error("Unsupported button variant");
 const attrs=' class="eh-button" data-variant="'+variant+'"';
 if(href)return '<a'+attrs+' href="'+hrefEH(href)+'">'+escapeEH(label)+'</a>';
 if(!["button","submit","reset"].includes(type))throw Error("Unsupported button type");
 return '<button'+attrs+' type="'+type+'"'+(name?' name="'+escapeEH(name)+'"':'')+(value!==undefined?' value="'+escapeEH(value)+'"':'')+'>'+escapeEH(label)+'</button>';
}
export function EHHtmlStatus({label,tone="neutral"}) {if(!["neutral","info","success","warning","error"].includes(tone))throw Error("Unsupported status");return '<span class="eh-status" data-status="'+tone+'">'+escapeEH(label)+'</span>';}
export function EHHtmlHeader({eyebrow,title,text,actions=""}) {return '<header class="eh-appHeader"><div>'+(eyebrow?'<p class="eh-eyebrow">'+escapeEH(eyebrow)+'</p>':'')+'<h1 class="eh-heading" data-scale="app">'+escapeEH(title)+'</h1>'+(text?'<p class="eh-text">'+escapeEH(text)+'</p>':'')+'</div><div class="eh-actions">'+actions+'</div></header>';}
export function EHHtmlField({id,label,name=id,value="",type="text",hint,error,required=false}) {
 if(!["text","search","email","tel","url","number","date","password"].includes(type))throw Error("Unsupported field type");
 const key=escapeEH(id);const described=[hint?key+"-hint":"",error?key+"-error":""].filter(Boolean).join(" ");
 return '<div class="eh-field"><label for="'+key+'">'+escapeEH(label)+(required?' <span>(erforderlich)</span>':'')+'</label>'+(hint?'<p class="eh-fieldHint" id="'+key+'-hint">'+escapeEH(hint)+'</p>':'')+'<input class="eh-input" id="'+key+'" name="'+escapeEH(name)+'" type="'+type+'" value="'+escapeEH(value)+'"'+(required?' required':'')+(described?' aria-describedby="'+described+'"':'')+(error?' aria-invalid="true"':'')+'>'+(error?'<p class="eh-fieldError" id="'+key+'-error" role="alert">'+escapeEH(error)+'</p>':'')+'</div>';
}
export function EHHtmlTable({caption,columns,rows}) {
 return '<div class="eh-tableScroll" role="region" aria-label="'+escapeEH(caption)+'" tabindex="0"><table class="eh-table"><caption>'+escapeEH(caption)+'</caption><thead><tr>'+columns.map(c=>'<th scope="col">'+escapeEH(c.label)+'</th>').join("")+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+columns.map((c,i)=>'<'+(i?'td':'th scope="row"')+'>'+escapeEH(row[c.key])+'</'+(i?'td':'th')+'>').join("")+'</tr>').join("")+'</tbody></table></div>';
}
export function EHHtmlList({label,items}) {
 return '<ul class="eh-list" aria-label="'+escapeEH(label)+'">'+items.map(item=>'<li><div>'+(item.href?'<a class="eh-listTitle" href="'+hrefEH(item.href)+'">'+escapeEH(item.title)+'</a>':'<span class="eh-listTitle">'+escapeEH(item.title)+'</span>')+(item.text?'<p class="eh-text">'+escapeEH(item.text)+'</p>':'')+'</div>'+(item.status?EHHtmlStatus(item.status):'')+'</li>').join("")+'</ul>';
}
export function EHHtmlPanel({title,content}) {return '<section class="eh-panel">'+(title?'<h2 class="eh-heading" data-scale="item">'+escapeEH(title)+'</h2>':'')+'<div class="eh-panelBody">'+content+'</div></section>';}
export function EHHtmlEmpty({title,text}) {return '<div class="eh-emptyState"><h2 class="eh-heading" data-scale="item">'+escapeEH(title)+'</h2><p class="eh-text">'+escapeEH(text)+'</p></div>';}
export function EHHtmlPage({title,content,lang="de"}) {
 if(!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(lang))throw Error("Invalid language");
 return '<!doctype html><html lang="'+lang+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeEH(title)+'</title><style>'+EHHtmlStyles+'</style></head><body class="eh-scope" data-eh-app="true"><main><section class="eh-section" data-compact="true"><div class="eh-container">'+content+'</div></section></main></body></html>';
}
