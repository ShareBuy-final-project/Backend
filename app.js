console.log("Hello app")
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const sampleRoutes = require('./routes/sampleRoutes.js');
const businessRegisterRoute = require('./routes/businessRegisterRoute.js');
const userRegisterRoute = require('./routes/userRegisterRoute.js');
const loginRoute = require('./routes/loginRoute.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to database
// db.authenticate()
//   .then(() => console.log('Database connected...'))
//   .catch((err) => console.log('Error: ' + err));

// Routes
app.use('/api/samples', sampleRoutes);
app.use('/api/businessRegister', businessRegisterRoute);
app.use('/api/userRegister', userRegisterRoute);
app.use('/api/login', loginRoute);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
