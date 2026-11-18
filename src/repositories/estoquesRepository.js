const pool = require('../config/db')

async function buscarTodos(usuarioId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT id, usuario_id, nome, criado_em
         FROM estoques
         WHERE usuario_id = ?
         ORDER BY nome ASC`,
        [usuarioId]
    )

    return rows
}

async function buscarPorId(id, usuarioId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT id, usuario_id, nome, criado_em
         FROM estoques
         WHERE id = ? AND usuario_id = ?`,
        [id, usuarioId]
    )

    return rows[0] || null
}

async function buscarPorNome(nome, usuarioId, conexao = pool) {
    const [rows] = await conexao.execute(
        `SELECT id, usuario_id, nome, criado_em
         FROM estoques
         WHERE nome = ? AND usuario_id = ?`,
        [nome, usuarioId]
    )

    return rows[0] || null
}

async function criar(dados, conexao = pool) {
    const [resultado] = await conexao.execute(
        `INSERT INTO estoques (usuario_id, nome)
         VALUES (?, ?)`,
        [
            dados.usuario_id,
            dados.nome
        ]
    )

    return resultado.insertId
}

async function atualizar(id, usuarioId, dados, conexao = pool) {
    const [resultado] = await conexao.execute(
        `UPDATE estoques
         SET nome = ?
         WHERE id = ? AND usuario_id = ?`,
        [
            dados.nome,
            id,
            usuarioId
        ]
    )

    return resultado.affectedRows
}

async function excluir(id, usuarioId, conexao = pool) {
    const [resultado] = await conexao.execute(
        `DELETE FROM estoques
         WHERE id = ? AND usuario_id = ?`,
        [
            id,
            usuarioId
        ]
    )

    return resultado.affectedRows
}

module.exports = {
    buscarTodos,
    buscarPorId,
    buscarPorNome,
    criar,
    atualizar,
    excluir
}