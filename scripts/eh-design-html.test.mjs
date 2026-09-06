import test from "node:test";
import assert from "node:assert/strict";
import {EHHtmlPage,EHHtmlHeader,EHHtmlField,EHHtmlTable,EHHtmlButton,EHHtmlStatus} from "../packages/eh-design/src/html.mjs";
test("HTML adapter escapes user content in text and attributes",()=>{
 const bad='<img src=x onerror="alert(1)">';
 const html=EHHtmlPage({title:bad,content:EHHtmlHeader({title:bad})+EHHtmlField({id:"query",label:bad,value:bad})+EHHtmlTable({caption:bad,columns:[{key:"name",label:bad}],rows:[{name:bad}]})});
 assert(!html.includes(bad));assert(html.includes("&lt;img"));assert(html.includes("&quot;alert(1)&quot;"));assert(html.includes("data:font/woff2;base64,"));
});
test("untrusted URL schemes and visual variants fail closed",()=>{
 assert.throws(()=>EHHtmlButton({label:"Open",href:"javascript:alert(1)"}));
 assert.throws(()=>EHHtmlButton({label:"Open",variant:"invented"}));
 assert.throws(()=>EHHtmlStatus({label:"Open",tone:"neon"}));
 assert(EHHtmlButton({label:"Lead",href:"/leads?id=1&tab=history"}).includes("&amp;"));
});
