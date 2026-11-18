const { Router } = require('express')
const movimentacoesController = require('../controllers/movimentacoesController')

// mergeParams para enxergar :estoqueId vindo de estoquesRoutes
const router = Router({ mergeParams: true })

router.get('/', movimentacoesController.listar)
router.post('/', movimentacoesController.criar)
router.get('/:id', movimentacoesController.buscarPorId)

module.exports = router