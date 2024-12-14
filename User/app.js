const userApi = require("./api/userApi");
console.log("Hello app")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('../config/db.js');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database
// db.authenticate()
//   .then(() => console.log('Database connected...'))
//   .catch((err) => console.log('Error: ' + err));

// app.use('/api/businessRegister', businessRegisterRoute);
// app.use('/api/userRegister', userRegisterRoute);
// app.use('/api/login', loginRoute);
userApi(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
