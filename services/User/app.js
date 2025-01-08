const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('../config/db');
const userApi = require('./api/userApi');
const User = require('./data/models/user'); // Import the User model
const Business = require('./data/models/business'); // Import the Business model
// Import other models as needed

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log('Starting User service...');

app.use((req, res, next) => {
  console.log(`User service received request: ${req.method} ${req.url}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// Add a simple route to test if the service is running
app.get('/test', (req, res) => {
  res.send('User service is running');
});

const connectWithRetry = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    // Start the server after the database is synchronized
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();

userApi(app);
