const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const groupApi = require('./api/groupApi');
// Import other models as needed:
const { sequelize, Group, SavedGroup, GroupUser } = require('models');

const app = express();

// Increase payload size limit to 50MB - Move these configurations to the top
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

console.log('Starting Group service...');

app.use((req, res, next) => {
  console.log(`Group service received request: ${req.method} ${req.url}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});


const connectWithRetry = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    // Start the server after the database is synchronized
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

connectWithRetry();
groupApi(app);