const router = require('express').Router();
const controller = require('../controllers/calculateController');

// Main calculation endpoint
router.post('/', controller.calculateChart);

// Optional: other routes
router.get('/', controller.listCharts);
router.get('/:id', controller.getChart);
router.delete('/:id', controller.deleteChart);

module.exports = router;
