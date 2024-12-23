const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('../config/db');
const userApi = require('./api/userApi');
const User = require('./data/models/user'); // Import the User model
// Import other models as needed

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database and synchronize models
sequelize.sync().then(() => {
  console.log('Database synchronized');
  // Start the server after the database is synchronized
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Unable to synchronize the database:', err);
});

userApi(app);
