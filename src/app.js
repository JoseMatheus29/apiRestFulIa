const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const authRoutes = require('./routes/auth.routes');
const datasetRoutes = require('./routes/dataset.routes');
const queryRoutes = require('./routes/query.routes');
const { swaggerUi, specs } = require('./config/swagger');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('src/public'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/auth', authRoutes);
app.use('/datasets', datasetRoutes);
app.use('/queries', queryRoutes);

// Rota da Documentação
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 