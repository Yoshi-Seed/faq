const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const port = 3000;

// MIME types mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    // Default to animated-background.html for root path
    if (pathname === '/') {
        pathname = '/animated-background.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1>404 Not Found</h1><p>File not found: ' + pathname + '</p>');
            } else {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/html');
                res.end('<h1>500 Internal Server Error</h1>');
            }
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', mimeType);
            res.end(data);
        }
    });
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`);
    console.log(`Serving animated background demo at: http://0.0.0.0:${port}/animated-background.html`);
});