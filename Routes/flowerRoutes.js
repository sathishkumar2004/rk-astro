const express = require('express');
const router = express.Router();
const flowerController = require('../Controllers/flowerController');

// Add your middleware like `authenticateAdmin` if needed

router.post('/flower', flowerController.createFlower);
router.get('/flower', flowerController.getAllFlowers);
router.get('/flower/:id', flowerController.getFlowerById);
router.put('/flower/:id', flowerController.updateFlower);
router.delete('/flower/:id', flowerController.deleteFlower);

module.exports = router;
