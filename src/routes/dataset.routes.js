const { Router } = require('express');
const datasetController = require('../controllers/dataset.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  datasetController.uploadDataset
);

module.exports = router; 