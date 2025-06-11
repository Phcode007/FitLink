const jwt = require('jsonwebtoken');

const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ mensagem: 'Token não enviado' });

    const [, token] = authHeader.split(' ');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
    }
};

// Middlewares específicos
const isAluno = (req, res, next) => {
    if (req.usuario.tipo !== 'aluno') return res.status(403).json({ mensagem: 'Acesso negado' });
    next();
};

const isNutricionista = (req, res, next) => {
    if (req.usuario.tipo !== 'nutricionista') return res.status(403).json({ mensagem: 'Acesso negado' });
    next();
};

const isPersonal = (req, res, next) => {
    if (req.usuario.tipo !== 'personal') return res.status(403).json({ mensagem: 'Acesso negado' });
    next();
};

module.exports = { autenticar, isAluno, isNutricionista, isPersonal };
