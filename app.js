// Middlewares

// Import dependencies
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Server to DB connection
const db = require('./API/models/connection_db');
db.connectDatabase();

// Routers/Connections
const userRouter = require('../backend/API/routers/user_router');
const checkoutRouter = require('../backend/API/routers/checkout_router');
const prodRouter = require('../backend/API/routers/product_router');
const addtocartRouter = require('../backend/API/routers/addtocart_router');

// Body parser and morgan settings
app.use(morgan('dev')); // Use morgan in dev phase only
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Header settings
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', '*');
    return res.status(200).json({});
  }
  next();
});

// Module endpoint + router
app.use('/usershop', userRouter);
app.use('/checkout', checkoutRouter);
app.use('/products', prodRouter);
app.use('/addtocart', addtocartRouter);

// Error middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;