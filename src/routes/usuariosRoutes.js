const express = require('express')
const router = express.Router()

const usersController = require('../controller/usuariosController')
const autenticar = require('../middlewares/autenticacao')

// Rota pública
router.post('/login', usersController.loginUsuario)
router.post('/', usersController.criarUsuario)

// A partir daqui, todas exigem autenticação
router.use(autenticar)

router.get('/', usersController.mostrarUsuarios)
router.put('/:id', (req, res, next) => {
    if (req.params.id !== String(req.usuario.id)) {
        return res.status(403).json({ erro: 'Acesso negado' })
    }

    next()
}, usersController.editarUsuario)
router.patch('/senha', usersController.alterarSenha)
router.delete('/:id', (req, res, next) => {
    if (req.params.id !== String(req.usuario.id)) {
        return res.status(403).json({ erro: 'Acesso negado' })
    }

    next()
}, usersController.excluirUsuario)

module.exports = router