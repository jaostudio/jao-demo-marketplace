const https = require('https');
https.get('https://www.pexels.com/search/fresh%20fish/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  timeout: 10000
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/\/photo\/[^"'"]+-(\d+)\//g);
    if (matches) {
      const ids = [...new Set(matches.map(m => m.match(/-(\d+)\//)[1]))];
      console.log('Found IDs:', ids.slice(0, 10).join(', '));
    } else {
      console.log('No IDs found, length:', data.length);
      console.log(data.slice(0, 2000));
    }
  });
}).on('error', e => console.error('Error:', e.message));