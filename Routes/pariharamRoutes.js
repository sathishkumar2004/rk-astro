const express = require('express');
const router = express.Router();
const pariharamController = require('../Controllers/pariharamController');

router.post('/pariharam', pariharamController.createPariharam);
router.get('/pariharams', pariharamController.getAllPariharams);
router.get('/pariharam/type/:type', pariharamController.getPariharamsByType);
router.put('/pariharam/:id', pariharamController.updatePariharam);
router.delete('/pariharam/:id', pariharamController.deletePariharam);

module.exports = router;
