const express = require('express');
const router = express.Router();
const controller = require('../Controllers/bookmarkController');

// Create
router.post('/', controller.createBookmark);

// Get
router.get('/id/:id', controller.getById);
router.get('/name/:name', controller.getByName);
router.get('/part/:part', controller.getByPart);

router.get('/all/ids', controller.getAllId);
router.get('/all/names', controller.getAllName);
router.get('/all/parts', controller.getAllPart);

// Delete
router.delete('/id/:id', controller.deleteById);
router.delete('/name/:name', controller.deleteByName);
router.delete('/part/:part', controller.deleteByPart);

// Update
router.put('/:id', controller.updateBookmark);

module.exports = router;
