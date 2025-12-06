const express = require('express');
const router = express.Router();
const prasanamController = require('../Controllers/prasanamController');

router.post('/', prasanamController.createPrasanam);
router.get('/', prasanamController.getAllPrasanams);
router.get('/:id', prasanamController.getPrasanamById);
router.put('/:id', prasanamController.updatePrasanam);
router.delete('/:id', prasanamController.deletePrasanam);

module.exports = router;
