const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Increase payload size limit to 50MB - Move these configurations to the top
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

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

const proxyConfig = {
  changeOrigin: true,
  onProxyReq,
  proxyTimeout: 60000, // Add timeout
  timeout: 60000,      // Add timeout
};

const userServiceProxy = createProxyMiddleware({
  ...proxyConfig,
  target: 'http://user-service:5000',
  pathRewrite: {
    '^/user': '', // remove /user prefix
  },
});

const authServiceProxy = createProxyMiddleware({
  ...proxyConfig,
  target: 'http://authentication-service:6000',
  pathRewrite: {
    '^/auth': '', // remove /auth prefix
  },
});

const groupServiceProxy = createProxyMiddleware({
  ...proxyConfig,
  target: 'http://group-service:7000',
  pathRewrite: {
    '^/group': '', // remove /group prefix
  },
});

const paymentServiceProxy = createProxyMiddleware({
  ...proxyConfig,
  target: 'http://payment-service:8000',
  pathRewrite: {
    '^/payment/': '/', // remove /payment prefix
  },
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