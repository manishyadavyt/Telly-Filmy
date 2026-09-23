const { readdirSync, cpSync, mkdirSync, existsSync, copyFileSync } = require('fs');
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

  // Ensure save-posts.php and upload.php exist in public_html, out, and root
  const phpFiles = ['save-posts.php', 'upload.php'];
  phpFiles.forEach((file) => {
    const srcFile = path.join(rootDir, 'public', file);
    if (existsSync(srcFile)) {
      copyFileSync(srcFile, path.join(destDir, file));
      copyFileSync(srcFile, path.join(rootDir, file));
    }
  });

  // Ensure posts.json exists in root, public, and public_html
  const postsJsonSrc = path.join(rootDir, 'posts.json');
  if (existsSync(postsJsonSrc)) {
    copyFileSync(postsJsonSrc, path.join(destDir, 'posts.json'));
    copyFileSync(postsJsonSrc, path.join(rootDir, 'public', 'posts.json'));
  }

  console.log('✅ Successfully copied static export and dynamic endpoints to public_html/ and root');
} else {
  console.log('⚠️ out/ directory not found, skipping copy.');
}
