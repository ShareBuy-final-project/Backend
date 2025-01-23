const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize, GroupUser, Group} = require('models'); 
const paymentApi = require('./api/paymentApi');
 
const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log('Starting Payment service service...');


app.use((req, res, next) => {
  console.log(`Payment service received request: ${req.method} ${req.url}`);
  next();
});

const connectWithRetry = async () => {
  try {
    // await sequelize.sync();
    console.log('Database synchronized');
    // Start the server after the database is synchronized
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();

paymentApi(app);
