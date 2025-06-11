const Personal = require('../models/Personal');

exports.criarTreino = async (req, res) => {
    try {
        const { alunoId, exercicios } = req.body;

        const treino = await Treino.create({
            exercicios,
            personal: req.user.id,
            aluno: alunoId
        });

        // Atualiza aluno e personal trainer
        await Promise.all([
            Aluno.findByIdAndUpdate(alunoId, { $push: { treinos: treino._id } }),
            Personal.findByIdAndUpdate(req.user.id, { $push: { treinosCriados: treino._id } })
        ]);

        res.status(201).json({ status: 'success', data: treino });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar treino' });
    }
};

exports.acompanharProgresso = async (req, res) => {
    try {
        const { alunoId } = req.params;

        const aluno = await Aluno.findById(alunoId)
            .select('metricas nome')
            .populate('treinos');

        // Análise básica de progresso
        const progresso = aluno.metricas.map(metrica => ({
            data: metrica.data,
            peso: metrica.peso,
            imc: metrica.imc
        }));

        res.status(200).json({
            status: 'success',
            data: {
                aluno: aluno.nome,
                treinos: aluno.treinos.length,
                progresso
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao analisar progresso' });
    }
};