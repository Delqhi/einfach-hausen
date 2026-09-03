import fs from 'node:fs';

const page = fs.readFileSync('src/app/page.tsx', 'utf8');
const componentPath = 'src/components/marketing/home-services-grid.tsx';
const cssPath = 'src/components/marketing/home-services-grid.module.css';

const failures = [];
const requireText = (source, needle, label) => {
  if (!source.includes(needle)) failures.push(label || ('Missing: ' + needle));
};
const forbidText = (source, needle, label) => {
  if (source.includes(needle)) failures.push(label || ('Forbidden: ' + needle));
};

requireText(page, "@/components/marketing/home-services-grid", 'Homepage must import the services mosaic');
requireText(page, '<HomeServicesGrid />', 'Homepage must render the services mosaic');

if (!fs.existsSync(componentPath)) failures.push('Missing HomeServicesGrid component');
if (!fs.existsSync(cssPath)) failures.push('Missing isolated HomeServicesGrid styles');

if (fs.existsSync(componentPath)) {
  const component = fs.readFileSync(componentPath, 'utf8');
  const visibleComponent = component.replaceAll('&amp;', '&');
  for (const text of [
    'Für Eigentümer',
    'Neu bei einfach-hausen:',
    'Alles rund ums Zuhause',
    'Hausakte & Dokumente',
    'Modernisieren & Sanieren',
    'Verkaufen & Bewertung',
    'Handwerker finden',
    'Geprüfte Partner',
    'Weitere Services entdecken',
    '50+',
  ]) requireText(visibleComponent, text, 'Services mosaic missing copy: ' + text);

  // Brand visual language: the CardVisual library is the only allowed anchor imagery.
  requireText(component, 'CardVisual', 'Services mosaic must use the CardVisual brand library');
  for (const kind of ['digitalHomeFile', 'craftsmenService', 'solarEnergy', 'propertyValuation', 'verifiedPartners']) {
    requireText(component, `kind="${kind}"`, 'Services mosaic missing brand visual: ' + kind);
  }
  forbidText(component, '/images/haus.jpg', 'Random stock photo in mosaic');
  forbidText(component, '/images/handwerker.jpg', 'Random stock photo in mosaic');
  forbidText(component, '/images/welcome-house.png', 'Random stock photo in mosaic');
  forbidText(component, 'category-dach', 'Category photo in mosaic (use brand visuals)');
  forbidText(component, 'category-heizung', 'Category photo in mosaic (use brand visuals)');
  requireText(component, 'ArrowRight', 'Services mosaic must render circular arrow affordances');
}

if (fs.existsSync(cssPath)) {
  const css = fs.readFileSync(cssPath, 'utf8');
  // Design language: petrol feature card + white mint-tinted tiles, no photo filters
  for (const token of ['#105258', 'rgba(217, 240, 237', 'radial-gradient']) {
    requireText(css, token, 'Mosaic CSS missing brand token: ' + token);
  }
  forbidText(css, 'saturate(0.93)', 'Photo filter found (mosaic must not use stock photos)');
}

if (failures.length) {
  console.error('Homepage services mosaic contract failed (' + failures.length + '):');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Homepage services mosaic contract passed.');
