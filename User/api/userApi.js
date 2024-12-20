const express = require('express');
const User = require('../data/models/User');
const { register } = require('../domain/user');

module.exports = (app) => {
  app.post('/api/register', async (req, res) => {// Implemnt function by calling the function register from 'domain/user'
    try {
      const { username, password, email } = req.body;
  
      // Call the register function from 'domain/user'
      const newUser = await register({ username, password, email });
  
      res.status(201).json({ message: 'User registered successfully', user: newUser });
      console.log('User registered successfully');
    } catch (error) {
      res.status(400).json({ message: 'Error registering user', error: error.message });
    }  
  })
}

