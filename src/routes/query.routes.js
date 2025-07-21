const { Router } = require('express');
const queryController = require('../controllers/query.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', authMiddleware, queryController.getQueries);
router.post('/', authMiddleware, queryController.createQuery);

module.exports = router; 