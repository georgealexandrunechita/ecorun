require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db');
const authRoutes = require('./routes/auth');
const runRoutes = require('./routes/runs');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API EcoRun',
        estado: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/runs', runRoutes);

const PORT = process.env.PORT || 8080;
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor: http://localhost:${PORT}`);
    });
});
