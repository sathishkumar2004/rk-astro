const express = require('express');
const router = express.Router();
const girahamController = require('../Controllers/girahamController');
const { authenticateAdmin } = require('../Middleware/adminMiddleware');
const checkModulePermission = require('../Middleware/checkModulePermission');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // temp folder

// Create Single Giraham
router.post('/giraham',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Giraham';
    req.body.moduleId = req.body.girahamId; 
    next();
  },
  checkModulePermission,
  girahamController.createGiraham
);

// Get All, Get by Id, Update, Delete
router.get('/', girahamController.getAllGirahams);
router.get('/:id', girahamController.getGirahamById);
router.put('/:id', girahamController.updateGiraham);
router.delete('/:id', girahamController.deleteGiraham);
router.get("/gid/:id",girahamController.getGirahamByGId);

// Bulk Upload Girahams (Excel)
router.post('/bulk-upload-giraham', girahamController.bulkUploadGiraham);

module.exports = router;
