// routes/nutricionistaRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('/back_controler/auth_controller.js');
const nutricionistaController = require('back_controler/nutricont.js');

router.use(authController.protect);
router.use(authController.restrictTo('nutricionista'));

router.get('/pacientes', nutricionistaController.getPacientes);
router.post('/planos-alimentares', nutricionistaController.criarPlanoAlimentar);

module.exports = router;