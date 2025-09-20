const express = require('express');
const transferController = require('../controllers/transferController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /transfers:
 *   post:
 *     summary: Criar nova transferência
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toUserId
 *               - amount
 *             properties:
 *               toUserId:
 *                 type: integer
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transferência criada com sucesso
 *       400:
 *         description: Dados inválidos ou saldo insuficiente
 *       401:
 *         description: Token de acesso requerido
 */
router.post('/', authenticateToken, transferController.createTransfer);

/**
 * @swagger
 * /transfers/my:
 *   get:
 *     summary: Listar transferências do usuário logado
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de transferências do usuário
 *       401:
 *         description: Token de acesso requerido
 */
router.get('/my', authenticateToken, transferController.getTransfersByUser);

/**
 * @swagger
 * /transfers:
 *   get:
 *     summary: Listar todas as transferências
 *     tags: [Transfers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas as transferências
 *       401:
 *         description: Token de acesso requerido
 */
router.get('/', authenticateToken, transferController.getAllTransfers);

module.exports = router;
