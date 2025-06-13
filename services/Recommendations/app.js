const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const recommendationsApi = require('./api/recommendationsApi');
const { sequelize } = require('models');

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log('Starting Recommendations service...');

app.use((req, res, next) => {
  console.log(`Recommendations service received request: ${req.method} ${req.url}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

const connectWithRetry = async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized');
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to synchronize the database:', err);
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();
recommendationsApi(app);