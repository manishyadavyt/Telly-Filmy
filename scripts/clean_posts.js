const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
let cleanedCount = 0;

for (const p of posts) {
  if (p.content) {
    const original = p.content;
    // Strip invalid img tags with empty or incomplete src like src="https://" or src="http://"
    p.content = p.content
      .replace(/<img[^>]*src=["']https?:\/\/["'][^>]*\/?>/gi, '')
      .replace(/<img[^>]*src=["']["'][^>]*\/?>/gi, '')
      .replace(/!\[.*?\]\((?:https?:\/\/)?\)/gi, '')
      .trim();
    
    if (original !== p.content) {
      cleanedCount++;
      console.log('Cleaned post:', p.title);
    }
  }
}

console.log(`Total cleaned: ${cleanedCount}`);

if (cleanedCount > 0) {
  const jsonStr = JSON.stringify(posts, null, 2);
  fs.writeFileSync('posts.json', jsonStr, 'utf8');
  fs.writeFileSync('public/posts.json', jsonStr, 'utf8');
  fs.writeFileSync('public_html/posts.json', jsonStr, 'utf8');
  console.log('✅ Updated posts.json across all folders!');
}
