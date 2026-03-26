/**
 * Generates QR assets for the public menu URL (PNG + SVG in /public).
 * Run: node scripts/generateMenuQr.js
 */
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const URL = process.argv[2] || 'https://menu-lucullus.vercel.app/';
const publicDir = path.join(__dirname, '..', 'public');

async function main() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const pngPath = path.join(publicDir, 'menu-qr.png');
  const svgPath = path.join(publicDir, 'menu-qr.svg');

  await QRCode.toFile(pngPath, URL, {
    type: 'png',
    width: 512,
    margin: 2,
    color: { dark: '#1b3226', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });

  const svg = await QRCode.toString(URL, {
    type: 'svg',
    width: 512,
    margin: 2,
    color: { dark: '#1b3226', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });

  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('Wrote', pngPath);
  console.log('Wrote', svgPath);
  console.log('Payload:', URL);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
