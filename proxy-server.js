const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('.'));

// Proxy endpoint - /proxy?url=https://youtube.com/watch?v=...
app.use('/proxy', createProxyMiddleware({
  target: (req) => {
    const url = req.query.url;
    if (!url) return 'https://www.google.com';
    return url;
  },
  changeOrigin: true,
  pathRewrite: {'^/proxy': ''},
  onProxyReq: (proxyReq, req, res) => {
    // Headers for sites like YouTube
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  }
}));

// Serve this.html as index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'this.html'));
});

app.listen(port, () => {
  console.log(`CroxyProxy clone running at http://localhost:${port}`);
  console.log('Test: http://localhost:3000/ (opens this.html)');
  console.log('Proxy: http://localhost:3000/proxy?url=https://www.youtube.com');
});
