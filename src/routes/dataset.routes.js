const { Router } = require('express');
const datasetController = require('../controllers/dataset.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

router.get('/', authMiddleware, datasetController.getDatasets);
router.get('/:id/records', authMiddleware, datasetController.getRecordsByDataset);

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  datasetController.uploadDataset
);

module.exports = router; 