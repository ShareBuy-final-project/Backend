const authApi = require("./api/authApi");
console.log("Hello app")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../config/db.js');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database

authApi(app);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
