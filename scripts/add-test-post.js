const fs = require('fs');

const newPost = {
  id: 'pati-patni-aur-panga-celebrities-spotted-on-set',
  slug: 'pati-patni-aur-panga-celebrities-spotted-on-set',
  title: 'Pati Patni Aur Panga | Celebrities Spotted ON Set | Colors Tv Shabir Ahluwalia, Archana Puran Singh',
  excerpt: 'Popular television celebrities including Shabir Ahluwalia, Archana Puran Singh, Ronit Roy, and Divyanka Tripathi were spotted on the sets of Colors TV upcoming show Pati Patni Aur Panga.',
  content: "MUMBAI: The excitement around Colors TV's much-anticipated reality show 'Pati Patni Aur Panga: Jodiyon Ka Reality Check' reached a whole new high as a star-studded lineup of beloved television celebrities was spotted on the sets today.\n\nAmong the prominent personalities making heads turn were Shabir Ahluwalia, Archana Puran Singh, Ronit Roy, Divyanka Tripathi, and other celebrated faces from the Indian television industry. Dressed in vibrant and festive ethnic ensembles, the stars shared great camaraderie and infectious energy behind the scenes.\n\n'Pati Patni Aur Panga' brings a fresh and hilarious twist to reality television, testing celebrity couples through entertaining challenges, witty banter, and unfiltered reality checks. Fans are eagerly anticipating the grand premiere on Colors TV to watch their favorite jodis take on the ultimate fun-filled tests.\n\nStay tuned to TellyFilmy for exclusive updates, behind-the-scenes glimpses, and premiere announcements directly from the world of entertainment!",
  category: 'TV Serials',
  isTopStory: true,
  isTrending: true,
  imageUrl: '/images/posts/pati-patni-aur-panga-celebrities-spotted-on-set/main.jpeg',
  imageHint: 'Pati Patni Aur Panga Celebrities Spotted ON Set Colors Tv Shabir Ahluwalia Archana Puran Singh',
  images: [
    '/images/posts/pati-patni-aur-panga-celebrities-spotted-on-set/image-1.jpeg'
  ],
  tags: [
    'Pati Patni Aur Panga',
    'Colors TV',
    'Shabir Ahluwalia',
    'Archana Puran Singh',
    'Ronit Roy',
    'Divyanka Tripathi',
    'TV Serials',
    'Celebrities Spotted',
    'Reality Show',
    'Entertainment News'
  ],
  author: {
    name: 'Telly Filmy',
    avatarUrl: '/logo.png'
  },
  date: '2026-09-23T18:00:00Z',
  views: 0,
  metaTitle: 'Pati Patni Aur Panga | Celebrities Spotted ON Set Colors TV',
  metaDescription: 'Watch celebrities including Shabir Ahluwalia, Archana Puran Singh spotted on set for Colors TV Pati Patni Aur Panga.',
  focusKeyword: 'Pati Patni Aur Panga Colors TV'
};

const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
const filtered = posts.filter(p => p.slug !== newPost.slug);
filtered.unshift(newPost);

fs.writeFileSync('posts.json', JSON.stringify(filtered, null, 2), 'utf8');
fs.writeFileSync('public/posts.json', JSON.stringify(filtered, null, 2), 'utf8');
console.log('✅ Successfully added test post to posts.json and public/posts.json! Total posts:', filtered.length);
