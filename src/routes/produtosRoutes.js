const { Router } = require('express')
const produtosController = require('../controller/produtosController')

// mergeParams para enxergar :estoqueId vindo de estoquesRoutes
const router = Router({ mergeParams: true })

router.get('/', produtosController.listar)
router.post('/', produtosController.criar)
router.get('/:id', produtosController.buscarPorId)
router.put('/:id', produtosController.atualizar)
router.delete('/:id', produtosController.excluir)

module.exports = router