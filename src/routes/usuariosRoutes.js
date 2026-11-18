const express = require('express')
const router = express.Router()

const usersController = require('../controller/usuariosController')
const autenticar = require('../middlewares/autenticacao')

// Rotas públicas
router.post('/login', usersController.loginUsuario)
router.post('/', usersController.criarUsuario)

// A partir daqui, todas exigem autenticação
router.use(autenticar)

router.get('/', usersController.mostrarUsuarios)
router.put('/:id', usersController.editarUsuario)
router.patch('/senha', usersController.alterarSenha)
router.delete('/:id', usersController.excluirUsuario)

module.exports = router