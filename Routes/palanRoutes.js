const express = require('express');
const router = express.Router();
const palanController = require('../Controllers/palanController');
const  authenticateAdmin  = require('../Middleware/authMiddleware');

// Create Palan
router.post('/', authenticateAdmin, palanController.createPalan);

// Get All Palans
router.get('/', palanController.getAllPalans);

// Update Palan
router.put('/:palanId', authenticateAdmin, palanController.updatePalan);

// Delete Palan
router.delete('/:palanId', authenticateAdmin, palanController.deletePalan);

module.exports = router;
