const express = require('express');
const router = express.Router();
const thandhirikamController = require('../Controllers/thandhirikamController');

router.post('/', thandhirikamController.createThandhirikam);
router.get('/', thandhirikamController.getAllThandhirikams);
router.get('/:id', thandhirikamController.getThandhirikamById);
router.put('/:id', thandhirikamController.updateThandhirikam);
router.delete('/:id', thandhirikamController.deleteThandhirikam);

module.exports = router;
