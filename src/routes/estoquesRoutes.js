const { Router } = require('express')
const estoquesController = require('../controller/estoquesController')
const autenticacao = require('../middlewares/autenticacao')
const produtosRoutes = require('./produtosRoutes')
const movimentacoesRoutes = require('./movimentacoesRoutes')

const router = Router()

router.use(autenticacao)

router.get('/', estoquesController.listar)
router.post('/', estoquesController.criar)
router.get('/:id', estoquesController.buscarPorId)
router.put('/:id', estoquesController.atualizar)
router.delete('/:id', estoquesController.excluir)

// Rotas aninhadas: produtos e movimentações pertencem a um estoque
router.use('/:estoqueId/produtos', produtosRoutes)
router.use('/:estoqueId/movimentacoes', movimentacoesRoutes)

module.exports = router
