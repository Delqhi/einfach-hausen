const pptxgen = require('/Users/jeremy/dev/einfach-hausen/presentation/node_modules/pptxgenjs');
const p = new pptxgen();
p.defineLayout({ name:'W', width:13.333, height:7.5 });
p.layout='W';
p.title='einfachhausen.de — Team-Präsentation Premium';
for(let i=1;i<=15;i++){
  const s=p.addSlide();
  s.addImage({path:`slide-${String(i).padStart(2,'0')}.png`, x:0,y:0,w:13.333,h:7.5});
}
p.writeFile({fileName:'einfachhausen-premium.pptx'}).then(()=>console.log('pptx ok'));
