import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
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

export default router;