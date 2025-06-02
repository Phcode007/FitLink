// db.js

// Configuração da conexão
import {Pool} from "pg";

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fit-link',
    password: 'postgres',
    port: 5432,
});


export async function getClientes() {
    try {
        const res = await pool.query('SELECT * FROM Clientes');
        console.log(res)
        return res.rows;
    } catch (err) {
        console.error('Erro na busca de clientes:', err);
        return [];
    }
}

getClientes()
