const csv = require('csv-parser');
const pdf = require('pdf-parse');
const { Readable } = require('stream');

const parseFileContent = (fileBuffer, mimetype) => {
  return new Promise((resolve, reject) => {
    if (mimetype === 'text/csv') {
      const results = [];
      const stream = Readable.from(fileBuffer.toString('utf8'));
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    } else if (mimetype === 'application/pdf') {
      pdf(fileBuffer)
        .then(data => {
          // Para o PDF, cada "registro" pode ser uma linha ou parágrafo.
          // Vamos simplesmente dividir por quebra de linha.
          const lines = data.text.split('\n').filter(line => line.trim() !== '');
          const results = lines.map(line => ({ content: line }));
          resolve(results);
        })
        .catch(error => reject(error));
    } else {
      reject(new Error('Tipo de arquivo não suportado para processamento.'));
    }
  });
};

module.exports = {
  parseFileContent,
}; 