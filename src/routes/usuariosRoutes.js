const express = require('express')
const router = express.Router()

const usersController = require('../controllers/usuariosController')
const autenticar = require('../middlewares/autenticacao')

// Rota pública
router.post('/login', usersController.loginUsuario)

// A partir daqui, todas exigem autenticação
router.use(autenticar)

router.get('/', usersController.mostrarUsuarios)
router.post('/', usersController.criarUsuario)
router.put('/:id', usersController.editarUsuario)
router.patch('/senha', usersController.alterarSenha)
router.delete('/:id', usersController.excluirUsuario)

module.exports = router