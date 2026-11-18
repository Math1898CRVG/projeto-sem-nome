const estoquesRepository = require('../repositories/estoquesRepository')

function criarErro(mensagem, status) {
    const erro = new Error(mensagem)
    erro.status = status

    return erro
}

async function listar(usuarioId) {
    return estoquesRepository.buscarTodos(usuarioId)
}

async function buscarPorId(id, usuarioId) {
    const estoque = await estoquesRepository.buscarPorId(id, usuarioId)

    if (!estoque) {
        throw criarErro('Estoque não encontrado', 404)
    }

    return estoque
}

async function criar(usuarioId, dados) {
    const existente = await estoquesRepository.buscarPorNome(
        dados.nome,
        usuarioId
    )

    if (existente) {
        throw criarErro('Já existe um estoque com esse nome', 409)
    }

    let id

    try {
        id = await estoquesRepository.criar({
            usuario_id: usuarioId,
            nome: dados.nome
        })
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            throw criarErro('Já existe um estoque com esse nome', 409)
        }

        throw erro
    }

    return estoquesRepository.buscarPorId(id, usuarioId)
}

async function atualizar(id, usuarioId, dados) {
    await buscarPorId(id, usuarioId)

    const existente = await estoquesRepository.buscarPorNome(
        dados.nome,
        usuarioId
    )

    if (existente && existente.id !== id) {
        throw criarErro('Já existe um estoque com esse nome', 409)
    }

    try {
        await estoquesRepository.atualizar(id, usuarioId, dados)
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            throw criarErro('Já existe um estoque com esse nome', 409)
        }

        throw erro
    }

    return estoquesRepository.buscarPorId(id, usuarioId)
}

async function excluir(id, usuarioId) {
    await buscarPorId(id, usuarioId)
    await estoquesRepository.excluir(id, usuarioId)
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
}
