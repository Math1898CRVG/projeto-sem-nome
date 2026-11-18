const pool = require('../config/db')

async function buscarTodos(estoqueId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT id, estoque_id, nome, quantidade_atual,
                quantidade_minima, criado_em
         FROM produtos
         WHERE estoque_id = ?
         ORDER BY nome ASC`,
        [estoqueId]
    )

    return rows
}

async function buscarPorId(id, estoqueId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT id, estoque_id, nome, quantidade_atual,
                quantidade_minima, criado_em
         FROM produtos
         WHERE id = ? AND estoque_id = ?`,
        [id, estoqueId]
    )

    return rows[0] || null
}

async function buscarPorNome(nome, estoqueId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT id, estoque_id, nome, quantidade_atual,
                quantidade_minima, criado_em
         FROM produtos
         WHERE nome = ? AND estoque_id = ?`,
        [nome, estoqueId]
    )

    return rows[0] || null
}

async function criar(dados, conexao = pool) {
    const [resultado] = await conexao.execute(
        `INSERT INTO produtos
            (estoque_id, nome, quantidade_atual, quantidade_minima)
         VALUES (?, ?, ?, ?)`,
        [
            dados.estoque_id,
            dados.nome,
            dados.quantidade_atual ?? 0,
            dados.quantidade_minima ?? 0
        ]
    )

    return resultado.insertId
}

async function atualizar(id, estoqueId, dados, conexao = pool) {
    const [resultado] = await conexao.execute(
        `UPDATE produtos
         SET nome = ?, quantidade_minima = ?
         WHERE id = ? AND estoque_id = ?`,
        [
            dados.nome,
            dados.quantidade_minima,
            id,
            estoqueId
        ]
    )

    return resultado.affectedRows
}

async function atualizarQuantidade(id, estoqueId, quantidade, conexao = pool) {
    const [resultado] = await conexao.execute(
        `UPDATE produtos
         SET quantidade_atual = ?
         WHERE id = ? AND estoque_id = ?`,
        [quantidade, id, estoqueId]
    )

    return resultado.affectedRows
}

async function excluir(id, estoqueId, conexao = pool) {
    const [resultado] = await conexao.execute(
        `DELETE FROM produtos
         WHERE id = ? AND estoque_id = ?`,
        [id, estoqueId]
    )

    return resultado.affectedRows
}

module.exports = {
    buscarTodos,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    atualizarQuantidade,
    excluir
}