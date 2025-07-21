const { PrismaClient } = require('@prisma/client');
const { mockIAResponse } = require('../services/ai.service');

const prisma = new PrismaClient();

const createQuery = async (req, res) => {
  try {
    const { pergunta, datasetId } = req.body;
    const { userId } = req;

    if (!pergunta || !datasetId) {
      return res.status(400).json({ message: 'Pergunta e datasetId são obrigatórios.' });
    }

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset não encontrado.' });
    }

    if (dataset.usuarioId !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Este dataset não pertence a você.' });
    }

    const resposta = mockIAResponse(pergunta);

    const newQuery = await prisma.query.create({
      data: {
        pergunta,
        resposta,
        usuarioId: userId,
      },
    });

    res.status(201).json(newQuery);
  } catch (error) {
    console.error('Erro ao criar query:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  createQuery,
}; 