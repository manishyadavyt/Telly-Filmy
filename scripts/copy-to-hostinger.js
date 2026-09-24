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

  // Ensure index.php, save-posts.php, upload.php, and .htaccess exist in public_html and root
  const vitalFiles = ['index.php', 'save-posts.php', 'upload.php', '.htaccess'];
  vitalFiles.forEach((file) => {
    const srcFile = path.join(rootDir, 'public', file);
    if (existsSync(srcFile)) {
      copyFileSync(srcFile, path.join(destDir, file));
      copyFileSync(srcFile, path.join(rootDir, file));
      if (existsSync(outDir)) {
        copyFileSync(srcFile, path.join(outDir, file));
      }
    }
  });

  // Ensure posts.json exists in root, public, out, and public_html
  const postsJsonSrc = path.join(rootDir, 'posts.json');
  if (existsSync(postsJsonSrc)) {
    copyFileSync(postsJsonSrc, path.join(destDir, 'posts.json'));
    copyFileSync(postsJsonSrc, path.join(rootDir, 'public', 'posts.json'));
    if (existsSync(outDir)) {
      copyFileSync(postsJsonSrc, path.join(outDir, 'posts.json'));
    }
  }

  console.log('✅ Successfully copied static export and dynamic endpoints to public_html/ and root');
} else {
  console.log('⚠️ out/ directory not found, skipping copy.');
}
