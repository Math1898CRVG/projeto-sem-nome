
const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usuariosController')

router.get('/', usersController.mostrar)
router.post('/', criarUsuario)
router.put('/:id', editarUsuario)
router.patch('/:id/senha', alterarSenha)
router.delete('/:id', excluirUsuario)

module.exports = router
