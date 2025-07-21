const express = require('express');
const router = express.Router();
const apiResource = require('./ApiRescource');

const bookController = require('../controllers/bookController');
const categoriesController = require('../controllers/categoriesController');
const borrowController = require('../controllers/borrowController');


const resources = [
  apiResource('/books', bookController),
  apiResource('/categories', categoriesController),
  apiResource('/borrow', borrowController),
];

resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;
