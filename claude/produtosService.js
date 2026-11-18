const estoquesRepository = require('../repositories/estoquesRepository')
const produtosRepository = require('../repositories/produtosRepository')

function criarErro(mensagem, status) {
    const erro = new Error(mensagem)
    erro.status = status

    return erro
}

// Garante que o estoque existe e pertence ao usuário logado
async function garantirEstoque(usuarioId, estoqueId) {
    const estoque = await estoquesRepository.buscarPorId(estoqueId, usuarioId)

    if (!estoque) {
        throw criarErro('Estoque não encontrado', 404)
    }

    return estoque
}

async function listar(usuarioId, estoqueId) {
    await garantirEstoque(usuarioId, estoqueId)

    return produtosRepository.buscarTodos(estoqueId)
}

async function buscarPorId(usuarioId, estoqueId, id) {
    await garantirEstoque(usuarioId, estoqueId)

    const produto = await produtosRepository.buscarPorId(id, estoqueId)

    if (!produto) {
        throw criarErro('Produto não encontrado', 404)
    }

    return produto
}

async function criar(usuarioId, estoqueId, dados) {
    await garantirEstoque(usuarioId, estoqueId)

    const existente = await produtosRepository.buscarPorNome(
        dados.nome,
        estoqueId
    )

    if (existente) {
        throw criarErro('Já existe um produto com esse nome neste estoque', 409)
    }

    let id

    try {
        // A quantidade atual sempre começa em 0: o saldo só muda
        // por movimentações, para o histórico bater com o estoque
        id = await produtosRepository.criar({
            estoque_id: estoqueId,
            nome: dados.nome,
            quantidade_atual: 0,
            quantidade_minima: dados.quantidade_minima ?? 0
        })
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            throw criarErro(
                'Já existe um produto com esse nome neste estoque',
                409
            )
        }

        throw erro
    }

    return produtosRepository.buscarPorId(id, estoqueId)
}

async function atualizar(usuarioId, estoqueId, id, dados) {
    await buscarPorId(usuarioId, estoqueId, id)

    const existente = await produtosRepository.buscarPorNome(
        dados.nome,
        estoqueId
    )

    if (existente && existente.id !== id) {
        throw criarErro('Já existe um produto com esse nome neste estoque', 409)
    }

    try {
        await produtosRepository.atualizar(id, estoqueId, {
            nome: dados.nome,
            quantidade_minima: dados.quantidade_minima
        })
    } catch (erro) {
        if (erro.code === 'ER_DUP_ENTRY') {
            throw criarErro(
                'Já existe um produto com esse nome neste estoque',
                409
            )
        }

        throw erro
    }

    return produtosRepository.buscarPorId(id, estoqueId)
}

async function excluir(usuarioId, estoqueId, id) {
    await buscarPorId(usuarioId, estoqueId, id)
    await produtosRepository.excluir(id, estoqueId)
}

module.exports = {
    listar,
    buscarPorId,
    criar,
    atualizar,
    excluir
}
