// routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('/back_controler/auth_controller.js');
const alunoController = require('/back_controler/alunocont.js');

router.use(authController.protect);
router.use(authController.restrictTo('aluno'));

router.get('/dashboard', alunoController.getDashboard);
router.post('/metricas', alunoController.registrarMetrica);

module.exports = router;