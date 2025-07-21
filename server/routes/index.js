const express = require('express');
const router = express.Router();
const apiResource = require('./ApiRescource');

const bookController = require('../controllers/bookController');
const categoriesController = require('../controllers/categoriesController');


const resources = [
  apiResource('/books', bookController),
  apiResource('/categories', categoriesController),
];

resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;
