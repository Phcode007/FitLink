// backend/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());

// Configuração do PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});

// Rota de login
app.post('/api/auth/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificar em todas as tabelas
        const [clientesResult, nutricionistasResult, personalsResult] = await Promise.all([
            pool.query('SELECT * FROM "Clientes" WHERE "Email" = $1', [email]),
            pool.query('SELECT * FROM "Nutricionistas" WHERE "Email" = $1', [email]),
            pool.query('SELECT * FROM "Personal" WHERE "Email" = $1', [email])
        ]);

        let user = null;
        let userType = null;

        // Verificar Cliente
        if (clientesResult.rows.length > 0 && await bcrypt.compare(senha, clientesResult.rows[0].Senha_hash)) {
            user = clientesResult.rows[0];
            userType = 'cliente';
        }
        // Verificar Nutricionista
        else if (nutricionistasResult.rows.length > 0 && await bcrypt.compare(senha, nutricionistasResult.rows[0].Senha_hash)) {
            user = nutricionistasResult.rows[0];
            userType = 'nutricionista';
        }
        // Verificar Personal Trainer
        else if (personalsResult.rows.length > 0 && await bcrypt.compare(senha, personalsResult.rows[0].Senha_hash)) {
            user = personalsResult.rows[0];
            userType = 'personal';
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Criar token JWT
        const token = jwt.sign(
            { id: user.ID, tipo: userType, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            tipo: userType,
            id: user.ID,
            nome: user.Nome
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Middleware de autenticação
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
};

// Rota para obter dados do usuário
app.get('/api/user/me', authMiddleware, async (req, res) => {
    try {
        let user;
        const userId = req.user.id;
        const userType = req.user.tipo;

        switch (userType) {
            case 'cliente':
                const clientesResult = await pool.query('SELECT * FROM "Clientes" WHERE "ID" = $1', [userId]);
                if (clientesResult.rows.length > 0) user = clientesResult.rows[0];
                break;
            case 'nutricionista':
                const nutricionistasResult = await pool.query('SELECT * FROM "Nutricionistas" WHERE "ID" = $1', [userId]);
                if (nutricionistasResult.rows.length > 0) user = nutricionistasResult.rows[0];
                break;
            case 'personal':
                const personalsResult = await pool.query('SELECT * FROM "Personal" WHERE "ID" = $1', [userId]);
                if (personalsResult.rows.length > 0) user = personalsResult.rows[0];
                break;
            default:
                return res.status(400).json({ error: 'Tipo de usuário inválido' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Remover senha antes de enviar
        delete user.Senha_hash;
        res.json(user);

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para cadastro de cliente
app.post('/api/clientes', async (req, res) => {
    try {
        const { Nome, Sexo, Idade, Endereco, Telefone, Email, Turno, Senha, Data_Nascimento, Altura, Meta } = req.body;

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        const result = await pool.query(
            `INSERT INTO "Clientes" (
        "Nome", "Sexo", "Idade", "Endereço", "Telefone", "Email", "Turno", "Senha_hash", "Data_Nascimento", "Altura", "Meta"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [Nome, Sexo, Idade, Endereco, Telefone, Email, Turno, senhaHash, Data_Nascimento, Altura, Meta]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ error: 'Erro no cadastro' });
    }
});

// Rota para cadastro de nutricionista
app.post('/api/nutricionistas', async (req, res) => {
    try {
        const { Nome, Idade, Endereco, Telefone, Email, CRN, Senha } = req.body;

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        const result = await pool.query(
            `INSERT INTO "Nutricionistas" (
        "Nome", "Idade", "Endereço", "Telefone", "Email", "CRN", "Senha_hash"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [Nome, Idade, Endereco, Telefone, Email, CRN, senhaHash]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar nutricionista:', error);
        res.status(500).json({ error: 'Erro no cadastro' });
    }
});

// Rota para cadastro de personal
app.post('/api/personals', async (req, res) => {
    try {
        const { Nome, Idade, Endereco, Telefone, Email, CREF, Senha } = req.body;

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        const result = await pool.query(
            `INSERT INTO "Personal" (
        "Nome", "Idade", "Endereço", "Telefone", "Email", "CREF", "Senha_hash"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [Nome, Idade, Endereco, Telefone, Email, CREF, senhaHash]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar personal trainer:', error);
        res.status(500).json({ error: 'Erro no cadastro' });
    }
});

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});