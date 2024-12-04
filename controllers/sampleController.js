const Sample = require('../models/sampleModel');

// Get all samples
// const getSamples = async (req, res) => {
//   try {
//     const samples = await Sample.findAll();
//     res.json(samples);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// // Create a sample
// const createSample = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const newSample = await Sample.create({ name });
//     res.json(newSample);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

let samples = [
    { id: 1, name: 'Sample 1' },
    { id: 2, name: 'Sample 2' },
  ];
  
  // Get all samples
  const getSamples = async (req, res) => {
    console.log("Request has been made")
    res.json(samples); // Return the in-memory array
  };
  
  // Create a sample
  const createSample = async (req, res) => {
    const { name } = req.body;
    const newSample = { id: samples.length + 1, name }; // Simulate creating a new record
    samples.push(newSample); // Add it to the in-memory array
    res.json(newSample); // Respond with the new sample
  };
  
module.exports = { getSamples, createSample };
