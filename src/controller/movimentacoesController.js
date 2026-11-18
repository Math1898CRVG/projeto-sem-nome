const movimentacoesService = require('../services/movimentacoesService')
const movimentacoesValidator = require('../validators/movimentacoesValidator')
const produtosValidator = require('../validators/produtosValidator')
const estoquesValidator = require('../validators/estoquesValidator')

// GET /estoques/:estoqueId/movimentacoes?produtoId=123 (produtoId é opcional)
async function listar(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)

        const produtoId = req.query.produtoId !== undefined
            ? produtosValidator.validarId(req.query.produtoId)
            : null

        const movimentacoes = await movimentacoesService.listar(
            req.usuario.id,
            estoqueId,
            produtoId
        )

        res.status(200).json(movimentacoes)
    } catch (erro) {
        next(erro)
    }
}

async function buscarPorId(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const id = movimentacoesValidator.validarId(req.params.id)

        const movimentacao = await movimentacoesService.buscarPorId(
            req.usuario.id,
            estoqueId,
            id
        )

        res.status(200).json(movimentacao)
    } catch (erro) {
        next(erro)
    }
}

async function criar(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const dados = movimentacoesValidator.validarCriacao(req.body)

        const movimentacao = await movimentacoesService.criar(
            req.usuario.id,
            estoqueId,
            dados
        )

        res.status(201).json(movimentacao)
    } catch (erro) {
        next(erro)
    }
}

module.exports = { listar, buscarPorId, criar }
