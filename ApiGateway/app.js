const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
// const https = require('https');
// const fs = require('fs');

const app = express();

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

// const privateKey = fs.readFileSync('../sslKeys/private.key', 'utf8');
// const certificate = fs.readFileSync('../sslKeys/certificate.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

const userServiceProxy = createProxyMiddleware({
  target: 'http://user-service:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/user': '', // remove /user prefix
  },
  // onProxyReq: (proxyReq, req, res) => {
  //   if (req.body) {
  //     console.log(`Proxying request with body: ${JSON.stringify(req.body)}`);
  //     const bodyData = JSON.stringify(req.body);
  //     proxyReq.setHeader('Content-Type', 'application/json');
  //     proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
  //     proxyReq.write(bodyData);
  //     proxyReq.end();
  //   }
  // },
  // onError: (err, req, res) => {
  //   console.error('Error in proxy:', err);
  //   res.status(500).send('Proxy error');
  // },
  // onProxyRes: (proxyRes, req, res) => {
  //   let body = '';
  //   proxyRes.on('data', (chunk) => {
  //     body += chunk;
  //   });
  //   proxyRes.on('end', () => {
  //     console.log(`Response from User service: ${body}`);
  //   });
  // },
});

const authServiceProxy = createProxyMiddleware({
  target: 'http://authentication-service:6000',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // remove /auth prefix
  },
});

app.use('/user', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl} with body: ${JSON.stringify(req.body)}`);
  next();
}, userServiceProxy);

// Add a simple route to test if the API Gateway is running
app.get('/test', (req, res) => {
  res.send('API Gateway is running');
});

app.use('/auth', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl}`);
  next();
}, authServiceProxy);

app.use(cors());

const PORT = process.env.PORT || 443;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

// const httpsServer = https.createServer(credentials, app);
// // const PORT = process.env.PORT || 3000;
// httpsServer.listen(443, () => {
//   console.log('HTTPS Server running on port 443');
// });