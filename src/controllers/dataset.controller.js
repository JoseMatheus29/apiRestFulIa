const { PrismaClient } = require('@prisma/client');
const { parseFileContent } = require('../services/file.service');

const prisma = new PrismaClient();

const uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const { originalname, mimetype, buffer } = req.file;
    const { userId } = req;

    const newDataset = await prisma.dataset.create({
      data: {
        nome: originalname,
        usuarioId: userId,
      },
    });

    const recordsData = await parseFileContent(buffer, mimetype);

    const recordsToCreate = recordsData.map(record => ({
      dadosJson: record,
      datasetId: newDataset.id,
    }));

    await prisma.record.createMany({
      data: recordsToCreate,
    });

    res.status(201).json({
      message: 'Dataset e seus registros foram salvos com sucesso.',
      dataset: newDataset,
      numberOfRecords: recordsToCreate.length,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Formato de arquivo inválido')) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Erro no upload do dataset:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getDatasets = async (req, res) => {
  try {
    const { userId } = req;

    const datasets = await prisma.dataset.findMany({
      where: {
        OR: [
          { usuarioId: userId },
          { usuario: { role: 'ADMIN' } }, 
        ],
      },
      orderBy: {
        criadoEm: 'desc',
      },
    });

    res.json(datasets);
  } catch (error) {
    console.error('Erro ao listar datasets:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

const getRecordsByDataset = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const datasetId = parseInt(id, 10);

    const dataset = await prisma.dataset.findUnique({
      where: { id: datasetId },
      include: { usuario: true }, 
    });

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset não encontrado.' });
    }

    if (dataset.usuarioId !== userId && dataset.usuario.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Acesso negado. Este dataset não pertence a você.' });
    }

    const records = await prisma.record.findMany({
      where: {
        datasetId: datasetId,
      },
    });

    res.json(records);
  } catch (error) {
    console.error('Erro ao listar registros do dataset:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

module.exports = {
  uploadDataset,
  getDatasets,
  getRecordsByDataset,
}; 