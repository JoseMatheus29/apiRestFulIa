const { Router } = require('express');
const queryController = require('../controllers/query.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Queries
 *   description: Endpoints para realizar buscas simuladas e ver o histórico
 */

/**
 * @swagger
 * /queries:
 *   get:
 *     summary: Lista o histórico de queries do usuário autenticado
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de queries
 *       401:
 *         description: Não autorizado
 */
router.get('/', authMiddleware, queryController.getQueries);

/**
 * @swagger
 * /queries:
 *   post:
 *     summary: Cria uma nova query (busca simulada por IA)
 *     tags: [Queries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pergunta
 *               - datasetId
 *             properties:
 *               pergunta:
 *                 type: string
 *               datasetId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Query criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado ao dataset
 *       404:
 *         description: Dataset não encontrado
 */
router.post('/', authMiddleware, queryController.createQuery);

module.exports = router; 