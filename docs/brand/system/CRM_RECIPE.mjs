/** Complete native composition. Import from vendor/eh-design/src/html.mjs in the CRM.
 * searchForm is trusted application markup retaining actual filter names and handlers.
 * Every lead value is escaped by the canonical table. No auth/data/outreach logic is replaced.
 */
import {EHHtmlPage,EHHtmlLogo,EHHtmlHeader,EHHtmlTable,EHHtmlPanel,EHHtmlEmpty,EHHtmlButton} from "../../../packages/eh-design/src/html.mjs";
export function renderCRMOverview({leads,searchForm,primaryAction}) {
 const content=EHHtmlLogo()+EHHtmlHeader({eyebrow:"Einfachhausen CRM",title:"Dein Überblick.",text:"Kontakte, nächste Schritte und nachvollziehbare Vorgänge.",actions:primaryAction?EHHtmlButton(primaryAction):""})+
 EHHtmlPanel({title:"Kontakte finden",content:searchForm})+
 (leads.length?EHHtmlTable({caption:"Leads und nächste Schritte",columns:[{key:"name",label:"Kontakt"},{key:"status",label:"Status"},{key:"nextStep",label:"Nächster Schritt"}],rows:leads.map(lead=>({name:lead.name,status:lead.status,nextStep:lead.nextStep}))}):EHHtmlEmpty({title:"Keine passenden Kontakte",text:"Ändere deine Suche oder prüfe die aktiven Filter."}));
 return EHHtmlPage({title:"Einfachhausen CRM",content});
}
