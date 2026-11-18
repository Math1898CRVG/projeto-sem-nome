const pool = require('../config/db')
const estoquesRepository = require('../repositories/estoquesRepository')
const produtosRepository = require('../repositories/produtosRepository')
const movimentacoesRepository = require('../repositories/movimentacoesRepository')

const LIMITE_INT_UNSIGNED = 4294967295

function criarErro(mensagem, status) {
    const erro = new Error(mensagem)
    erro.status = status

    return erro
}

async function garantirEstoque(usuarioId, estoqueId) {
    const estoque = await estoquesRepository.buscarPorId(estoqueId, usuarioId)

    if (!estoque) {
        throw criarErro('Estoque não encontrado', 404)
    }

    return estoque
}

async function listar(usuarioId, estoqueId, produtoId = null) {
    await garantirEstoque(usuarioId, estoqueId)

    if (produtoId === null) {
        return movimentacoesRepository.buscarTodos(estoqueId)
    }

    const produto = await produtosRepository.buscarPorId(produtoId, estoqueId)

    if (!produto) {
        throw criarErro('Produto não encontrado', 404)
    }

    return movimentacoesRepository.buscarPorProduto(produtoId, estoqueId)
}

async function buscarPorId(usuarioId, estoqueId, id) {
    await garantirEstoque(usuarioId, estoqueId)

    const movimentacao = await movimentacoesRepository.buscarPorId(
        id,
        estoqueId
    )

    if (!movimentacao) {
        throw criarErro('Movimentação não encontrada', 404)
    }

    return movimentacao
}

async function criar(usuarioId, estoqueId, dados) {
    await garantirEstoque(usuarioId, estoqueId)

    const conexao = await pool.getConnection()

    try {
        await conexao.beginTransaction()

        // Trava a linha do produto até o commit: duas saídas simultâneas
        // não conseguem gastar o mesmo saldo
        const produto = await produtosRepository.buscarPorIdParaAtualizacao(
            dados.produto_id,
            estoqueId,
            conexao
        )

        if (!produto) {
            throw criarErro('Produto não encontrado', 404)
        }

        let novaQuantidade

        if (dados.tipo === 'entrada') {
            novaQuantidade = produto.quantidade_atual + dados.quantidade

            if (novaQuantidade > LIMITE_INT_UNSIGNED) {
                throw criarErro('A quantidade em estoque excede o limite permitido', 400)
            }
        } else {
            if (dados.quantidade > produto.quantidade_atual) {
                throw criarErro(
                    `Estoque insuficiente: disponível ${produto.quantidade_atual}`,
                    422
                )
            }

            novaQuantidade = produto.quantidade_atual - dados.quantidade
        }

        await produtosRepository.atualizarQuantidade(
            produto.id,
            estoqueId,
            novaQuantidade,
            conexao
        )

        const id = await movimentacoesRepository.criar(
            {
                produto_id: produto.id,
                tipo: dados.tipo,
                quantidade: dados.quantidade
            },
            conexao
        )

        await conexao.commit()

        return movimentacoesRepository.buscarPorId(id, estoqueId)
    } catch (erro) {
        await conexao.rollback()

        throw erro
    } finally {
        conexao.release()
    }
}

module.exports = {
    listar,
    buscarPorId,
    criar
}
