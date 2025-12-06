const router = require('express').Router();
const controller = require('../controllers/calculateController');

router.post('/', controller.calculate);

module.exports = router;