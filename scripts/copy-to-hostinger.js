const { readdirSync, cpSync, mkdirSync, existsSync } = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const outDir = path.join(rootDir, 'out');
const destDir = path.join(rootDir, 'public_html');

if (existsSync(outDir)) {
  mkdirSync(destDir, { recursive: true });
  const items = readdirSync(outDir);
  items.forEach((item) => {
    cpSync(path.join(outDir, item), path.join(destDir, item), { recursive: true, force: true });
  });
  console.log('✅ Successfully copied static export from out/ to public_html/');
} else {
  console.log('⚠️ out/ directory not found, skipping copy.');
}
