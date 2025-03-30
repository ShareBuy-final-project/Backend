const { initializeDatabase } = require('../config/models/init');

initializeDatabase().then(() => {
  console.log('Database initialization complete');
}).catch((err) => {
  console.error('Error during database initialization:', err);
});
