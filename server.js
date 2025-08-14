const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
    // Convert URL to file path, defaulting to index.html for root
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    // Get file extension
    const extname = path.extname(filePath);

    // Set content type based on file extension
    const contentType = MIME_TYPES[extname] || 'text/plain';

    // Add CORS and Service Worker headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Service-Worker-Allowed', '/');

    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File not found
                res.writeHead(404);
                res.end('File not found');
            } else {
                // Server error
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            // Success - serve file with correct MIME type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('MIME Types configured:');
    Object.entries(MIME_TYPES).forEach(([ext, type]) => {
        console.log(`  ${ext}: ${type}`);
    });
}); 