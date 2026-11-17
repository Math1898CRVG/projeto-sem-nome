const express = require('express')
const usuariosController = require('../controller/usuariosController')
const router = express.Router()

router.post('/', usuariosController.criarUsuário)
router.put('/:id', usuariosController.editarUsuário)
router.delete('/:id', usuariosController.excluirUsuário)

module.exports = router