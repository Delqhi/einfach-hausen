import fs from 'node:fs';

const page = fs.readFileSync('src/app/page.tsx', 'utf8');
const componentPath = 'src/components/marketing/home-services-grid.tsx';
const cssPath = 'src/components/marketing/home-services-grid.module.css';

const failures = [];
const requireText = (source, needle, label) => {
  if (!source.includes(needle)) failures.push(label || ('Missing: ' + needle));
};

requireText(page, "@/components/marketing/home-services-grid", 'Homepage must import the services mosaic');
requireText(page, '<HomeServicesGrid />', 'Homepage must render the services mosaic');

if (!fs.existsSync(componentPath)) failures.push('Missing HomeServicesGrid component');
if (!fs.existsSync(cssPath)) failures.push('Missing isolated HomeServicesGrid styles');

if (fs.existsSync(componentPath)) {
  const component = fs.readFileSync(componentPath, 'utf8');
  const visibleComponent = component.replaceAll('&amp;', '&');
  for (const text of [
    'FÜR EIGENTÜMER',
    'Neu bei einfach-hausen:',
    'Alles rund ums Zuhause',
    'Hausakte & Dokumente',
    'Versicherung',
    'Modernisieren & Sanieren',
    'Verkaufen & Bewertung',
    'Handwerker finden',
    'Weitere Services entdecken',
    '50+',
  ]) requireText(visibleComponent, text, 'Services mosaic missing copy: ' + text);
  requireText(component, 'next/image', 'Services mosaic must use real image cards');
  requireText(component, 'ArrowRight', 'Services mosaic must render circular arrow affordances');
}

if (failures.length) {
  console.error('Homepage services mosaic contract failed (' + failures.length + '):');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Homepage services mosaic contract passed.');
