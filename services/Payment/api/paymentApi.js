const {pay}= require('../domain/payment');

module.exports = (app) => {
  app.post('/payment', async (req, res) => {
    console.log('Payment service received request to /payment');
    try {
      const accessToken = req.headers['authorization'][1];
      const {items} = req.body;
      
      const payment = await pay({items, accessToken});

      res.status(201).json({ payment });
    } catch (error) {
      res.status(400).json({ message: 'Error making payment', error: error.message });
    }
  });
};

