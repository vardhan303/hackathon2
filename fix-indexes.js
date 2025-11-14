// Quick script to fix database indexes
// Usage: node fix-indexes.js [backend-url]

const https = require('https');
const http = require('http');

const backendUrl = process.argv[2] || 'https://hackbyte-backend.vercel.app';
const endpoint = '/api/auth/fix-registration-indexes';

console.log(`🔧 Running database index fix...`);
console.log(`Backend: ${backendUrl}`);
console.log(`Endpoint: ${endpoint}\n`);

const url = new URL(endpoint, backendUrl);
const protocol = url.protocol === 'https:' ? https : http;

const options = {
  hostname: url.hostname,
  port: url.port,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = protocol.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}\n`);
    
    try {
      const result = JSON.parse(data);
      console.log('Response:');
      console.log(JSON.stringify(result, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ Success! Database indexes have been fixed.');
      } else {
        console.log('\n❌ Error occurred. Please check the response above.');
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Network Error:', error.message);
  console.error('Error code:', error.code);
  console.error('Full error:', error);
  console.log('\nTroubleshooting:');
  console.log('1. Verify the backend URL is correct');
  console.log('2. Ensure the backend is deployed and running');
  console.log('3. Check your internet connection');
  console.log('4. Try opening the URL in your browser:', backendUrl);
});

req.end();
