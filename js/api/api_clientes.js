// api/clientes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota POST para criar novo cliente
router.post('/', async (req, res) => {
    const {
        Nome,
        Email,
        Senha,
        Sexo,
        Data_Nascimento,
        Endereço,
        Telefone,
        Turno,
        Altura,
        Meta,
        Observacao
    } = req.body;

    try {
        // Verificar se email já existe
        const existingUser = await db.query('SELECT * FROM Clientes WHERE Email = ?', [Email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(Senha, 10);

        // Inserir novo cliente
        const result = await db.query(
            `INSERT INTO Clientes
             (Nome, Email, Senha, Sexo, Data_Nascimento, Endereço, Telefone, Turno, Altura, Meta, Observacao)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Nome,
                Email,
                hashedPassword,
                Sexo,
                Data_Nascimento,
                Endereço,
                Telefone,
                Turno,
                Altura,
                Meta,
                Observacao
            ]
        );

        // Gerar token JWT
        const token = jwt.sign(
            { id: result.insertId, tipo: 'cliente', nome: Nome },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Cliente cadastrado com sucesso!',
            token,
            tipo: 'cliente',
            id: result.insertId,
            nome: Nome
        });

    } catch (error) {
        console.error('Erro no cadastro de cliente:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// Rota GET para obter dados do cliente
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await db.query('SELECT * FROM Clientes WHERE ID = ?', [id]);

        if (cliente.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        // Remover senha do retorno
        const { Senha, ...clienteData } = cliente[0];
        res.json(clienteData);

    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = router;