const express = require('express');
const router = express.Router();

// Caminho corrigido para importar a conexão com o PostgreSQL
const pool = require('/js/conect');

router.get('/', async (req, res) => {
    try {
        const clientes = await pool.query('SELECT COUNT(*) FROM Cliente');
        const personais = await pool.query('SELECT COUNT(*) FROM Personal');
        const nutricionistas = await pool.query('SELECT COUNT(*) FROM Nutricionista');

        res.json({
            totalClientes: clientes.rows[0].count,
            totalPersonais: personais.rows[0].count,
            totalNutricionistas: nutricionistas.rows[0].count
        });
    } catch (err) {
        console.error('Erro no dashboard:', err);
        res.status(500).json({ error: 'Erro ao carregar dados do dashboard.' });
    }
});

module.exports = router;

