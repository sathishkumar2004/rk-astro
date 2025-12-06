const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { authenticateAdmin } = require('../Middleware/adminMiddleware');
const checkModulePermission = require('../Middleware/checkModulePermission');

// ===== Auth =====
router.get('/access/:adminId',adminController.getPermissionsByAdminId);
router.post('/login', adminController.login);
router.post(
  '/request-access',
  authenticateAdmin,
  adminController.requestAccess
);

// ===== Raasi =====
router.post('/raasi',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Raasi';
    req.body.moduleId = req.body.raasiId;
    next();
  },
  checkModulePermission,
  adminController.createRaasiPost
);
router.delete('/raasi/:postId', authenticateAdmin, adminController.deleteRaasiPost);
router.put('/raasi/:postId', authenticateAdmin, adminController.updateRaasiPost);
router.get('/raasi', adminController.getAllRaasiPosts);
router.get('/raasi/post/:postId', adminController.getRaasiPostByPostId);
router.get('/raasi/raasi/:raasiId', adminController.getRaasiPostsByRaasiId);
router.get('/raasi/admin/adminId', authenticateAdmin, adminController.getRaasiPostsByAdminId); // 🔍 added
router.post('/raasi/bulk-upload', authenticateAdmin, adminController.bulkUploadRaasi);

// ===== Star =====
router.post('/star',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Star';
    req.body.moduleId = req.body.starId;
    next();
  },
  checkModulePermission,
  adminController.createStarPost
);
router.delete('/star/:postId', authenticateAdmin, adminController.deleteStarPost);
router.put('/star/:postId', authenticateAdmin, adminController.updateStarPost);
router.get('/star', adminController.getAllStarPosts);
router.get('/star/post/:postId', adminController.getStarPostByPostId);
router.get('/star/star/:starId', adminController.getStarPostsByStarId);
router.get('/star/admin/adminId',authenticateAdmin,  adminController.getStarPostsByAdminId); // 🔍 added
router.post('/star/bulk-upload', authenticateAdmin, adminController.bulkUploadStar);

// ===== Laknam =====
router.post('/laknam',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Laknam';
    req.body.moduleId = req.body.LaknamId;
    next();
  },
  checkModulePermission,
  adminController.createLaknamPost
);
router.delete('/laknam/:postId', authenticateAdmin, adminController.deleteLaknamPost);
router.put('/laknam/:postId', authenticateAdmin, adminController.updateLaknamPost);
router.get('/laknam', adminController.getAllLaknamPosts);
router.get('/laknam/post/:postId', adminController.getLaknamPostByPostId);
router.get('/laknam/laknam/:laknamId', adminController.getLaknamPostsByLaknamId);
router.get('/laknam/admin/adminId',authenticateAdmin,  adminController.getLaknamPostsByAdminId); // 🔍 added
router.post('/laknam/bulk-upload', authenticateAdmin, adminController.bulkUploadLaknam);

// ===== Join =====
router.post('/join',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Join';
    req.body.moduleId = req.body.JoinId;
    next();
  },
  checkModulePermission,
  adminController.createJoinPost
);
router.delete('/join/:postId', authenticateAdmin, adminController.deleteJoinPost);
router.put('/join/:postId', authenticateAdmin, adminController.updateJoinPost);
router.get('/join', adminController.getAllJoinPosts);
router.get('/join/post/:postId', adminController.getJoinPostByPostId);
router.get('/join/join/:JoinId', adminController.getJoinPostsByJoinId);
router.get('/join/admin/adminId',authenticateAdmin,  adminController.getJoinPostsByAdminId); // 🔍 added
router.post('/join/bulk-upload', authenticateAdmin, adminController.bulkUploadJoin);

// ===== ThreeJoin =====
router.post('/threejoin',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'ThreeJoin';
    req.body.moduleId = req.body.threeJoinId;
    next();
  },
  checkModulePermission,
  adminController.createThreeJoinPost
);
router.delete('/threejoin/:postId', authenticateAdmin, adminController.deleteThreeJoinPost);
router.put('/threejoin/:postId', authenticateAdmin, adminController.updateThreeJoinPost);
router.get('/threejoin', adminController.getAllThreeJoinPosts);
router.get('/threejoin/post/:postId', adminController.getThreeJoinPostByPostId);
router.get('/threejoin/threejoin/:threeJoinId', adminController.getThreeJoinPostsByThreeJoinId);
// router.get('/threejoin/admin/adminId', adminController.getThreeJoinPostsByAdminId); // 🔍 added

// ===== Sin =====
router.post('/sin',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Sin';
    req.body.moduleId = req.body.sinId;
    next();
  },
  checkModulePermission,
  adminController.createSinPost
);
router.delete('/sin/:postId', authenticateAdmin, adminController.deleteSinPost);
router.put('/sin/:postId', authenticateAdmin, adminController.updateSinPost);
router.get('/sin', adminController.getAllSinPosts);
router.get('/sin/post/:postId', adminController.getSinPostByPostId);
router.get('/sin/sin/:sinId', adminController.getSinPostsBySinId);
router.get('/sin/admin/adminId',authenticateAdmin,  adminController.getSinPostsByAdminId); // 🔍 added
router.post('/sin/bulk-upload', authenticateAdmin, adminController.bulkUploadSin);

// ===== Thosham =====
router.post('/thosham',
  authenticateAdmin,
  (req, res, next) => {
    req.body.moduleName = 'Thosham';
    req.body.moduleId = req.body.thoshamId;
    next();
  },
  checkModulePermission,
  adminController.createThosham
);
router.delete('/thosham/:id', authenticateAdmin, adminController.deleteThosham);
router.put('/thosham/:id', authenticateAdmin, adminController.updateThosham);
router.get('/thosham', authenticateAdmin, adminController.getAllThosham);
router.get('/thosham/:id', authenticateAdmin, adminController.getThoshamById);
// Note: Not adding get by admin for Thosham unless adminId is part of model

module.exports = router;
