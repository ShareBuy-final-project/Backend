const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
// const https = require('https');
// const fs = require('fs');

const app = express();

app.use(bodyParser.json({limit: '50mb'}));

// Increase payload size limit to 10MB
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

//app.use(bodyParser.urlencoded({ extended: true }));

// const privateKey = fs.readFileSync('../sslKeys/private.key', 'utf8');
// const certificate = fs.readFileSync('../sslKeys/certificate.crt', 'utf8');
// const credentials = { key: privateKey, cert: certificate };

const onProxyReq = function (proxyReq, req, res) {
  console.log(`Request made to ${req.originalUrl} with method ${req.method} and body: ${JSON.stringify(req.body)} and headers: ${JSON.stringify(req.headers)}`);
  if(req.body) {
    console.log('Request body:', req.body);
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader('Content-Type','application/json');
    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
};

const userServiceProxy = createProxyMiddleware({
  target: 'http://user-service:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/user': '', // remove /user prefix
  },
  on: { proxyReq: onProxyReq },
});

const authServiceProxy = createProxyMiddleware({
  target: 'http://authentication-service:6000',
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', // remove /auth prefix
  },
  on: { proxyReq: onProxyReq },
});

const groupServiceProxy = createProxyMiddleware({
  target: 'http://group-service:7000',
  changeOrigin: true,
  pathRewrite: {
    '^/group': '', // remove /group prefix
  },
  on: { proxyReq: onProxyReq },
});

const paymentServiceProxy = createProxyMiddleware({
  target: 'http://payment-service:8000',
  changeOrigin: true,
  pathRewrite: {
    '^/payment/': '/', // remove /payment prefix
  },
  on: { proxyReq: onProxyReq },
});

app.use('/user', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl} with body: ${JSON.stringify(req.body)} and headers: ${JSON.stringify(req.headers)}`);
  next();
}, userServiceProxy);

app.use('/auth', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl}`);
  next();
}, authServiceProxy);

app.use('/group', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl}`);
  next();
}, groupServiceProxy);

app.use('/payment', (req, res, next) => {
  console.log(`Before proxy: ${req.method} ${req.originalUrl}`);
  next();
}, paymentServiceProxy);

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