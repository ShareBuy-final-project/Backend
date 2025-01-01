const authApi = require("./api/authApi");
console.log("Hello app")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../config/db.js');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database and synchronize models
db.sync().then(() => {
  console.log('Database synchronized');
  // Start the server after the database is synchronized
  const PORT = process.env.PORT || 6000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Unable to synchronize the database:', err);
});

authApi(app);
