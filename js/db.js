const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', () => {
    console.log('🔥 Banco de dados conectado com sucesso!');
});

pool.on('error', (err) => {
    console.error('💥 Erro na conexão com o banco:', err);
    process.exit(-1);
});

module.exports = pool;
