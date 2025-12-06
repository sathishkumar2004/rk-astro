const express = require('express');
const router = express.Router();
const calculateController = require('../controllers/calculateController');

// Only pass functions, not called functions
router.post('/calculate-chart', calculateController.calculateChart);
router.get('/get-chart/:chart_type/:meta_id', calculateController.getChart);
router.get('/list-charts', calculateController.listCharts);
router.delete('/delete-chart/:chart_type/:meta_id', calculateController.deleteChart);

module.exports = router;
