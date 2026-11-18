const produtosService = require('../services/produtosService')
const produtosValidator = require('../validators/produtosValidator')
const estoquesValidator = require('../validators/estoquesValidator')

async function listar(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const produtos = await produtosService.listar(req.usuario.id, estoqueId)

        res.status(200).json(produtos)
    } catch (erro) {
        next(erro)
    }
}

async function buscarPorId(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const id = produtosValidator.validarId(req.params.id)
        const produto = await produtosService.buscarPorId(req.usuario.id, estoqueId, id)

        res.status(200).json(produto)
    } catch (erro) {
        next(erro)
    }
}

async function criar(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const dados = produtosValidator.validarCriacao(req.body)
        const produto = await produtosService.criar(req.usuario.id, estoqueId, dados)

        res.status(201).json(produto)
    } catch (erro) {
        next(erro)
    }
}

async function atualizar(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const id = produtosValidator.validarId(req.params.id)
        const dados = produtosValidator.validarAtualizacao(req.body)
        const produto = await produtosService.atualizar(req.usuario.id, estoqueId, id, dados)

        res.status(200).json(produto)
    } catch (erro) {
        next(erro)
    }
}

async function excluir(req, res, next) {
    try {
        const estoqueId = estoquesValidator.validarId(req.params.estoqueId)
        const id = produtosValidator.validarId(req.params.id)

        await produtosService.excluir(req.usuario.id, estoqueId, id)

        res.status(204).send()
    } catch (erro) {
        next(erro)
    }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }