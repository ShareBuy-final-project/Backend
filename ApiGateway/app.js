const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
// const https = require('https');
// const fs = require('fs');

const app = express();

// const privateKey = fs.readFileSync('../sslKeys/private.key', 'utf8');
// const certificate = fs.readFileSync('../sslKeys/certificate.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

const userServiceProxy = createProxyMiddleware({
  target: 'http://user-service:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/user': '', // remove /user prefix
  },
});

const authServiceProxy = createProxyMiddleware({
  target: 'http://authentication-service:6000',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // remove /auth prefix
  },
});

app.use('/user', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl}`);
  next();
}, userServiceProxy);

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