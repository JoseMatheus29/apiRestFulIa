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

    // 1. Criar o dataset
    const newDataset = await prisma.dataset.create({
      data: {
        nome: originalname,
        usuarioId: userId,
      },
    });

    // 2. Processar o conteúdo do arquivo
    const recordsData = await parseFileContent(buffer, mimetype);

    // 3. Preparar os registros para inserção no banco
    const recordsToCreate = recordsData.map(record => ({
      dadosJson: record,
      datasetId: newDataset.id,
    }));

    // 4. Inserir os registros em lote
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

module.exports = {
  uploadDataset,
}; 