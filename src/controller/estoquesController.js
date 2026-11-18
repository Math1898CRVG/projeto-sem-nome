const estoquesService = require('../services/estoquesService')
const estoquesValidator = require('../validators/estoquesValidator')

async function listar(req, res, next) {
    try {
        const estoques = await estoquesService.listar(req.usuario.id)

        res.status(200).json(estoques)
    } catch (erro) {
        next(erro)
    }
}

async function buscarPorId(req, res, next) {
    try {
        const id = estoquesValidator.validarId(req.params.id)
        const estoque = await estoquesService.buscarPorId(id, req.usuario.id)

        res.status(200).json(estoque)
    } catch (erro) {
        next(erro)
    }
}

async function criar(req, res, next) {
    try {
        const dados = estoquesValidator.validarCriacao(req.body)
        const estoque = await estoquesService.criar(req.usuario.id, dados)

        res.status(201).json(estoque)
    } catch (erro) {
        next(erro)
    }
}

async function atualizar(req, res, next) {
    try {
        const id = estoquesValidator.validarId(req.params.id)
        const dados = estoquesValidator.validarAtualizacao(req.body)
        const estoque = await estoquesService.atualizar(id, req.usuario.id, dados)

        res.status(200).json(estoque)
    } catch (erro) {
        next(erro)
    }
}

async function excluir(req, res, next) {
    try {
        const id = estoquesValidator.validarId(req.params.id)

        await estoquesService.excluir(id, req.usuario.id)

        res.status(204).send()
    } catch (erro) {
        next(erro)
    }
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir }
