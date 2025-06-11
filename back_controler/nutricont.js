const Nutricionista = require('../models/Nutricionista');
const Aluno = require('../models/Aluno');

exports.getPacientes = async (req, res) => {
    try {
        const nutricionista = await Nutricionista.findById(req.user.id)
            .populate('pacientes');

        res.status(200).json({
            status: 'success',
            results: nutricionista.pacientes.length,
            data: nutricionista.pacientes
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar pacientes' });
    }
};

exports.criarPlanoAlimentar = async (req, res) => {
    try {
        const { alunoId, plano } = req.body;

        // 1. Criar o plano
        const novoPlano = await PlanoAlimentar.create({
            ...plano,
            nutricionista: req.user.id
        });

        // 2. Associar ao aluno
        await Aluno.findByIdAndUpdate(alunoId, {
            $push: { dietas: novoPlano._id }
        });

        // 3. Associar ao nutricionista
        await Nutricionista.findByIdAndUpdate(req.user.id, {
            $push: { planosCriados: novoPlano._id }
        });

        res.status(201).json({ status: 'success', data: novoPlano });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar plano alimentar' });
    }
};