const express = require('express');

function apiResource(path, controller) {
  const router = express.Router();

  if (typeof controller.index === 'function') {
    router.get('/', controller.index);
  }
  if (typeof controller.store === 'function') {
    router.post('/', controller.store);
  }
  if (typeof controller.show === 'function') {
    router.get('/:id', controller.show);
  }
  if (typeof controller.update === 'function') {
    router.put('/:id', controller.update);
  }
  if (typeof controller.destroy === 'function') {
    router.delete('/:id', controller.destroy);
  }

  return { path, router };
}

module.exports = apiResource;