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
<<<<<<< HEAD
router.put('/:id', usersController.editarUsuario)
=======
router.put('/:id', (req, res, next) => {
    if (req.params.id !== String(req.usuario.id)) {
        return res.status(403).json({ erro: 'Acesso negado' })
    }

    next()
}, usersController.editarUsuario)
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
router.patch('/senha', usersController.alterarSenha)
router.delete('/:id', (req, res, next) => {
    if (req.params.id !== String(req.usuario.id)) {
        return res.status(403).json({ erro: 'Acesso negado' })
    }

    next()
}, usersController.excluirUsuario)

module.exports = router
