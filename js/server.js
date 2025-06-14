const express = require('express');
const pool = require('/db.js'); // Ajuste o caminho conforme onde você colocou o arquivo

const app = express();
app.use(express.json());

app.get('/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM clientes');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro no servidor');
    }
});

app.listen(5432, (localhost) => {
    console.log('🚀 Servidor rodando na porta 5432');
});
