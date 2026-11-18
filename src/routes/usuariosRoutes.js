
const express = require('express')
const router = express.Router()

const usersController = require('../controller/usuariosController')

router.get('/', usersController.mostrarUsuarios)
router.post('/', usersController.criarUsuario)
router.put('/:id', usersController.editarUsuario)
router.patch('/:id/senha', usersController.alterarSenha)
router.delete('/:id', usersController.excluirUsuario)

module.exports = router
