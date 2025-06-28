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
        const [clientesResult, nutricionistasResult, personalsResult] = await Promise.all([
            pool.query('SELECT * FROM "Clientes" WHERE "Email" = $1', [email]),
            pool.query('SELECT * FROM "Nutricionistas" WHERE "Email" = $1', [email]),
            pool.query('SELECT * FROM "Personal" WHERE "Email" = $1', [email])
        ]);

        let user = null;
        let userType = null;

        if (clientesResult.rows.length > 0 && await bcrypt.compare(senha, clientesResult.rows[0].Senha_hash)) {
            user = clientesResult.rows[0];
            userType = 'cliente';
        } else if (nutricionistasResult.rows.length > 0 && await bcrypt.compare(senha, nutricionistasResult.rows[0].Senha_hash)) {
            user = nutricionistasResult.rows[0];
            userType = 'nutricionista';
        } else if (personalsResult.rows.length > 0 && await bcrypt.compare(senha, personalsResult.rows[0].Senha_hash)) {
            user = personalsResult.rows[0];
            userType = 'personal';
        }

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

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

        // Verificar e-mail duplicado
        const emailCheck = await pool.query('SELECT 1 FROM "Clientes" WHERE "Email" = $1 UNION SELECT 1 FROM "Nutricionistas" WHERE "Email" = $1 UNION SELECT 1 FROM "Personal" WHERE "Email" = $1', [Email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        const result = await pool.query(
            `INSERT INTO "Clientes" (
                "Nome", "Sexo", "Idade", "Endereço", "Telefone", "Email", "Turno", "Senha_hash", "Data_Nascimento", "Altura", "Meta", "Data_cadastro"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [Nome, Sexo, Idade, Endereco, Telefone, Email, Turno, senhaHash, Data_Nascimento, Altura, Meta, new Date()]
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

        const emailCheck = await pool.query('SELECT 1 FROM "Clientes" WHERE "Email" = $1 UNION SELECT 1 FROM "Nutricionistas" WHERE "Email" = $1 UNION SELECT 1 FROM "Personal" WHERE "Email" = $1', [Email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        const result = await pool.query(
            `INSERT INTO "Nutricionistas" (
                "Nome", "Idade", "Endereço", "Telefone", "Email", "CRN", "Senha_hash", "Data_cadastro"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [Nome, Idade, Endereco, Telefone, Email, CRN, senhaHash, new Date()]
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

        const emailCheck = await pool.query('SELECT 1 FROM "Clientes" WHERE "Email" = $1 UNION SELECT 1 FROM "Nutricionistas" WHERE "Email" = $1 UNION SELECT 1 FROM "Personal" WHERE "Email" = $1', [Email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'E-mail já cadastrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(Senha, salt);

        const result = await pool.query(
            `INSERT INTO "Personal" (
                "Nome", "Idade", "Endereço", "Telefone", "Email", "CREF", "Senha_hash", "Data_cadastro"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [Nome, Idade, Endereco, Telefone, Email, CREF, senhaHash, new Date()]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao cadastrar personal trainer:', error);
        res.status(500).json({ error: 'Erro no cadastro' });
    }
});

// Rota para listar clientes do personal trainer
app.get('/api/personal/clientes', authMiddleware, async (req, res) => {
    if (req.user.tipo !== 'personal') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
        const result = await pool.query(
            `SELECT c."ID", c."Nome", c."Email", c."Meta"
             FROM "Clientes" c
             INNER JOIN "Conexoes" co ON c."ID" = co."Cliente_ID"
             WHERE co."Personal_ID" = $1 AND co."Status" = 'ativo'`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para listar clientes do nutricionista
app.get('/api/nutricionista/clientes', authMiddleware, async (req, res) => {
    if (req.user.tipo !== 'nutricionista') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
        const result = await pool.query(
            `SELECT c."ID", c."Nome", c."Email", c."Meta"
             FROM "Clientes" c
             INNER JOIN "Conexoes" co ON c."ID" = co."Cliente_ID"
             WHERE co."Nutricionista_ID" = $1 AND co."Status" = 'ativo'`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para listar treinos
app.get('/api/personal/treinos', authMiddleware, async (req, res) => {
    if (req.user.tipo !== 'personal') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
        const result = await pool.query(
            `SELECT t.*, c."Nome" as ClienteNome
             FROM "Treinos" t
             INNER JOIN "Clientes" c ON t."ID_Paciente" = c."ID"
             WHERE t."ID_Personal" = $1`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar treinos:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para criar treino
app.post('/api/personal/treinos', authMiddleware, async (req, res) => {
    if (req.user.tipo !== 'personal') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { Cliente_ID, Nome, Objetivo, Descricao, Exercicios } = req.body;

    try {
        // Verificar se o cliente está conectado ao personal
        const connectionCheck = await pool.query(
            `SELECT 1 FROM "Conexoes" WHERE "Cliente_ID" = $1 AND "Personal_ID" = $2 AND "Status" = 'ativo'`,
            [Cliente_ID, req.user.id]
        );
        if (connectionCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Cliente não está conectado a este personal' });
        }

        const result = await pool.query(
            `INSERT INTO "Treinos" (
                "Data_Treino", "Exercicios", "Observacao", "ID_Paciente", "ID_Personal"
            ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [new Date(), Exercicios, Descricao, Cliente_ID, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar treino:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para listar planos alimentares
app.get('/api/nutricionista/planos', authMiddleware, async (req, res) => {
    if (req.user.tipo !== 'nutricionista') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
        const result = await pool.query(
            `SELECT p.*, c."Nome" as ClienteNome
             FROM "Planos_Alimentares" p
             INNER JOIN "Clientes" c ON p."ID_Paciente" = c."ID"
             WHERE p."ID_Nutricionista" = $1`,
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Erro ao buscar planos alimentares:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para criar plano alimentar
app.post('/api/nutricionista/planos', authMiddleware, async (req, res) => {
    if (req.user.tipo !== 'nutricionista') {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    const { Cliente_ID, Nome, Objetivo, Descricao } = req.body;

    try {
        const connectionCheck = await pool.query(
            `SELECT 1 FROM "Conexoes" WHERE "Cliente_ID" = $1 AND "Nutricionista_ID" = $2 AND "Status" = 'ativo'`,
            [Cliente_ID, req.user.id]
        );
        if (connectionCheck.rows.length === 0) {
            return res.status(400).json({ error: 'Cliente não está conectado a este nutricionista' });
        }

        const result = await pool.query(
            `INSERT INTO "Planos_Alimentares" (
                "Nome", "Objetivo", "Descricao", "ID_Paciente", "ID_Nutricionista", "Data_Criacao"
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [Nome, Objetivo, Descricao, Cliente_ID, req.user.id, new Date()]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar plano alimentar:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});