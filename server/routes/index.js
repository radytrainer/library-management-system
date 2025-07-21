const express = require('express');
const router = express.Router();
const apiResource = require('./ApiRescource');

const bookController = require('../controllers/bookController');


const resources = [
  apiResource('/books', bookController),
];

resources.forEach(resource => {
  router.use(resource.path, resource.router);
});

module.exports = router;
