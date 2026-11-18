const pool = require('../config/db')

async function buscarTodos(estoqueId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT
            m.id,
            m.produto_id,
            p.nome AS produto_nome,
            m.tipo,
            m.quantidade,
            m.criado_em
         FROM movimentacoes AS m
         INNER JOIN produtos AS p
            ON p.id = m.produto_id
         WHERE p.estoque_id = ?
         ORDER BY m.criado_em DESC, m.id DESC`,
        [estoqueId]
    )

    return rows
}

async function buscarPorId(id, estoqueId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT
            m.id,
            m.produto_id,
            p.nome AS produto_nome,
            m.tipo,
            m.quantidade,
            m.criado_em
         FROM movimentacoes AS m
         INNER JOIN produtos AS p
            ON p.id = m.produto_id
         WHERE m.id = ? AND p.estoque_id = ?`,
        [id, estoqueId]
    )

    return rows[0] || null
}

async function buscarPorProduto(produtoId, estoqueId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT
            m.id,
            m.produto_id,
            p.nome AS produto_nome,
            m.tipo,
            m.quantidade,
            m.criado_em
         FROM movimentacoes AS m
         INNER JOIN produtos AS p
            ON p.id = m.produto_id
         WHERE m.produto_id = ?
            AND p.estoque_id = ?
         ORDER BY m.criado_em DESC, m.id DESC`,
        [produtoId, estoqueId]
    )

    return rows
}

async function criar(dados, conexao = pool) {
    const [resultado] = await conexao.execute(
        `INSERT INTO movimentacoes
            (produto_id, tipo, quantidade)
         VALUES (?, ?, ?)`,
        [
            dados.produto_id,
            dados.tipo,
            dados.quantidade
        ]
    )

    return resultado.insertId
}

module.exports = {
    buscarTodos,
    buscarPorId,
    buscarPorProduto,
    criar
}