const fs = require('fs');

const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
for (const p of posts) {
  if (p.content && p.content.includes('<img')) {
    console.log('Post with <img:', p.title);
    const matches = p.content.match(/<img[^>]+>/g);
    console.log('Matches:', matches);
  }
}
