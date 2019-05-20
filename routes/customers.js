const errors    = require('restify-errors');
const Customer  = require('../models/Customer'); 

module.exports = server => {
  
  // Get all customers
  server.get('/customers', async (req, res, next) => {
    try {
      const customers = await Customer.find({});
      res.send(customers);
      next();
    }
    catch(err) {
      return next(new errors.InvalidContentError(err));
    }
  });

  // Get single customer
  server.get('/customers/:id', async (req, res, next) => {
    try {
      const customer = await Customer.findById(req.params.id);
      res.send(customer);
      next();
    }
    catch(err) {
      return next(new errors.ResourceNotFoundError(`No customer with id of ${req.params.id}`));
    }
  });
  
  // Add customer
  server.post('/customers', async (req, res, next) => {
    // Check for JSON
    if (!req.is('application/json')) {
      return next(new errors.InvalidContentError("Expects 'application/json'"));
    }

    // Destructure body
    const { name, email, balance } = req.body;

    const customer = new Customer({
      name,
      email,
      balance
    });

    try {
      const newCustomer = await customer.save();
      res.send(201);
      next();
    } catch(err) {
      return next(new errors.InternalError(err.message));
    }
  });
}