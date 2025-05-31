const { Pool } = require('pg');

// Configuração da conexão
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // ou IP do servidor remoto
    database: 'fit-link',
    password: 'postgres',
    port: 5432,
});

// Teste de conexão
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro na conexão:', err);
    } else {
        console.log('Conexão bem-sucedida! Hora do servidor:', res.rows[0].now);
    }
    pool.end(); // Encerra a conexão
});