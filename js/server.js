import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuração do PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware de autenticação JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Rota de cadastro para Clientes
app.post('/api/clientes', async (req, res) => {
    try {
        const { nome, sexo, data_nascimento, endereco, telefone, email, turno, senha, altura, meta, observacao } = req.body;

        // Hash da senha
        const senha_hash = await bcrypt.hash(senha, 10);

        const query = `
            INSERT INTO "Clientes" (
                "Nome", "Sexo", "Data_Nascimento", "Endereço", "Telefone",
                "Email", "Turno", "Senha_hash", "Altura", "Meta", "Observacao", "Data_cadastro"
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_DATE)
                RETURNING *;
        `;

        const values = [nome, sexo, data_nascimento, endereco, telefone, email, turno, senha_hash, altura, meta, observacao];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao cadastrar cliente' });
    }
});

// Rota de login
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const result = await pool.query(
            'SELECT * FROM "Clientes" WHERE "Email" = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const user = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, user.Senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user.ID, email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.ID,
                nome: user.Nome,
                email: user.Email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Rota para obter dados do dashboard (protegida)
app.get('/api/dashboard', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Obter dados do perfil
        const perfilQuery = await pool.query(
            `SELECT "Nome", "Data_Nascimento", "Altura", "Peso", "Meta"
             FROM "Clientes"
             WHERE "ID" = $1`,
            [userId]
        );

        // Obter desempenho (últimas 4 consultas)
        const desempenhoQuery = await pool.query(
            `SELECT "Data_consulta", "Peso", "IMC"
             FROM "Consultas"
             WHERE "ID_Paciente" = $1
             ORDER BY "Data_consulta" DESC
                 LIMIT 4`,
            [userId]
        );

        // Obter treinos do dia
        const hoje = new Date().toISOString().split('T')[0];
        const treinosQuery = await pool.query(
            `SELECT "ID", "Exercicios", "Data_Treino", "Completo"
             FROM "Treinos"
             WHERE "ID_Paciente" = $1 AND "Data_Treino" = $2`,
            [userId, hoje]
        );

        // Calcular progresso
        const treinosCompletos = treinosQuery.rows.filter(t => t.Completo).length;
        const progressoPercentual = treinosQuery.rows.length > 0
            ? Math.round((treinosCompletos / treinosQuery.rows.length) * 100)
            : 0;

        // Montar resposta
        const response = {
            perfil: perfilQuery.rows[0] || {},
            desempenho: desempenhoQuery.rows,
            treinos: treinosQuery.rows,
            progresso: progressoPercentual
        };

        res.json(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
});

// Rota para atualizar o status de um treino
app.post('/api/treino/status', authenticateToken, async (req, res) => {
    try {
        const { treinoId, status } = req.body;
        const userId = req.user.id;

        // Verificar se o treino pertence ao usuário
        const verifyQuery = await pool.query(
            `SELECT "ID" FROM "Treinos"
             WHERE "ID" = $1 AND "ID_Paciente" = $2`,
            [treinoId, userId]
        );

        if (verifyQuery.rows.length === 0) {
            return res.status(403).json({ error: 'Acesso não autorizado' });
        }

        await pool.query(
            `UPDATE "Treinos"
             SET "Completo" = $1
             WHERE "ID" = $2`,
            [status, treinoId]
        );

        res.json({ success: true });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar status do treino' });
    }
});

// Rota para obter dados de nutrição (exemplo)
app.get('/api/nutricao', authenticateToken, async (req, res) => {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const result = await pool.query(
            `SELECT "Refeicao", "Alimentos", "Calorias"
             FROM "Refeicoes"
             WHERE "ID_Cliente" = $1 AND "Data" = $2`,
            [req.user.id, hoje]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar dados de nutrição' });
    }
});

const PORT = process.env.PORT || 5432;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});