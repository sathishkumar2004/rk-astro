const express = require('express');
const router = express.Router();
const mantrigamController = require('../Controllers/mantrigamController');

router.post('/', mantrigamController.createMantrigam);
router.get('/', mantrigamController.getAllMantrigam);
router.get('/:id', mantrigamController.getMantrigamById);
router.put('/:id', mantrigamController.updateMantrigam);
router.delete('/:id', mantrigamController.deleteMantrigam);

module.exports = router;
