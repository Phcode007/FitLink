const Aluno = require('../models/Aluno');

exports.getDashboard = async (req, res) => {
    try {
        // Popula dados relacionados (treinos e dietas)
        const aluno = await Aluno.findById(req.user.id)
            .populate('treinos')
            .populate('dietas');

        res.status(200).json({
            status: 'success',
            data: {
                nome: aluno.nome,
                treinos: aluno.treinos,
                dietas: aluno.dietas,
                metricas: aluno.metricas
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
};

exports.registrarMetrica = async (req, res) => {
    try {
        const { peso, altura, imc } = req.body;

        await Aluno.findByIdAndUpdate(req.user.id, {
            $push: {
                metricas: {
                    data: new Date(),
                    peso,
                    altura,
                    imc
                }
            }
        });

        res.status(200).json({ status: 'success', message: 'Métrica registrada' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar métrica' });
    }
};