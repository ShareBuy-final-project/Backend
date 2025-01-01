const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

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