const pool = require('../config/db')

async function criar(estoqueId, nome, quantidadeMinima) {
    const [resultado] = await pool.execute(
        `INSERT INTO produtos
        (estoque_id, nome, quantidade_minima)
        VALUES (?, ?, ?)`,
        [estoqueId, nome, quantidadeMinima]
    )

    return resultado.insertId
}

async function buscarPorId(id) {
    const [resultado] = await pool.execute(
        `SELECT
            id,
            estoque_id,
            nome,
            quantidade_atual,
            quantidade_minima,
            criado_em
        FROM produtos
        WHERE id = ?`,
        [id]
    )

    return resultado[0] || null
}

async function listarPorEstoque(estoqueId) {
    const [resultado] = await pool.execute(
        `SELECT
            id,
            estoque_id,
            nome,
            quantidade_atual,
            quantidade_minima,
            criado_em
        FROM produtos
        WHERE estoque_id = ?
        ORDER BY nome ASC`,
        [estoqueId]
    )

    return resultado
}

async function atualizar(id, nome, quantidadeMinima) {
    const [resultado] = await pool.execute(
        `UPDATE produtos
        SET nome = ?, quantidade_minima = ?
        WHERE id = ?`,
        [nome, quantidadeMinima, id]
    )

    return resultado.affectedRows > 0
}

async function atualizarQuantidade(id, quantidade, conexao = pool) {
    const [resultado] = await conexao.execute(
        `UPDATE produtos
        SET quantidade_atual = ?
        WHERE id = ?`,
        [quantidade, id]
    )

    return resultado.affectedRows > 0
}

async function excluir(id) {
    const [resultado] = await pool.execute(
        'DELETE FROM produtos WHERE id = ?',
        [id]
    )

    return resultado.affectedRows > 0
}

module.exports = {
    criar,
    buscarPorId,
    listarPorEstoque,
    atualizar,
    atualizarQuantidade,
    excluir
}