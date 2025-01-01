const authApi = require("./api/authApi");
console.log("Hello app");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../config/db.js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const connectWithRetry = async () => {
  try {
    await db.sync();
    console.log('Database synchronized');
    // Start the server after the database is synchronized
    const PORT = process.env.PORT || 6000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();

authApi(app);
