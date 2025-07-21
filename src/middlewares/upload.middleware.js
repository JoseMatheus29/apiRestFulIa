const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Formato de arquivo inválido. Apenas .csv e .pdf são permitidos.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
});

module.exports = upload; 