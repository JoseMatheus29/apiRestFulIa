const { Router } = require('express');
const datasetController = require('../controllers/dataset.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Datasets
 *   description: Endpoints para gerenciamento de datasets e seus registros
 */

/**
 * @swagger
 * /datasets:
 *   get:
 *     summary: Lista todos os datasets do usuário autenticado
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de datasets
 *       401:
 *         description: Não autorizado
 */
router.get('/', authMiddleware, datasetController.getDatasets);

/**
 * @swagger
 * /datasets/{id}/records:
 *   get:
 *     summary: Lista todos os registros de um dataset específico
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do dataset
 *     responses:
 *       200:
 *         description: Lista de registros do dataset
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Dataset não encontrado
 */
router.get('/:id/records', authMiddleware, datasetController.getRecordsByDataset);

/**
 * @swagger
 * /datasets/upload:
 *   post:
 *     summary: Realiza o upload de um novo dataset (.csv ou .pdf)
 *     tags: [Datasets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Dataset e registros salvos com sucesso
 *       400:
 *         description: Nenhum arquivo enviado ou formato inválido
 *       401:
 *         description: Não autorizado
 */
router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  datasetController.uploadDataset
);

module.exports = router; 