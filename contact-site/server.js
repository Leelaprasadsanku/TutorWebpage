const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;

// Simple file sender with explicit error handling
function sendFile(res, filePath, contentType) {
  console.log('Reading file:', filePath);
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {'Content-Type': contentType});
    res.end(data);
  } catch (err) {
    console.error('Error reading file:', err);
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not found: ' + filePath);
  }
}

function getContentType(filePath){
  const ext = path.extname(filePath).toLowerCase();
  switch(ext){
    case '.html': return 'text/html; charset=utf-8';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'application/octet-stream';
  }
}

// Create the server
const server = http.createServer((req, res) => {
  console.log('Request for:', req.url);
  
  // Handle API endpoint
  if (req.url === '/api/contact' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        fs.appendFileSync(
          path.join(__dirname, 'submissions.log'),
          JSON.stringify({ date: new Date(), ...data }) + '\n'
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  // Handle static files
  let filePath = path.join(PUBLIC_DIR,
    req.url === '/' ? 'contact.html' : req.url.replace(/^\//, ''));

  // Security: Ensure the path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  // Determine content type
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  const contentType = contentTypes[ext] || 'application/octet-stream';

  // Send the file
  sendFile(res, filePath, contentType);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Serving files from: ${PUBLIC_DIR}`);
});
