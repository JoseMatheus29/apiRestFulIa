const { Router } = require('express');
const queryController = require('../controllers/query.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.post('/', authMiddleware, queryController.createQuery);

module.exports = router; 