const fs = require('fs');
const pool = require('./db');

const sql = fs.readFileSync('/bd/bdfitlink.sql', 'utf-8');

pool.query(sql)
  .then(() => {
    console.log('Arquivo SQL executado com sucesso!');
    process.exit();
  })
  .catch((err) => {
    console.error('Erro ao executar o arquivo SQL:', err);
    process.exit(1);
  });