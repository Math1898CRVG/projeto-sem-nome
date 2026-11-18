const pool = require('../config/db')

async function buscarPorEmail(email, conexao = pool) {
    const [rows] = await conexao.execute(
        'SELECT id, nome, email FROM usuarios WHERE email = ?',
        [email]
    )

    return rows[0] || null
}

async function buscarPorEmailComSenha(email, conexao = pool) {
    const [rows] = await conexao.execute(
        'SELECT id, nome, email, senha FROM usuarios WHERE email = ?',
        [email]
    )

    return rows[0] || null
}

async function buscarPorId(id, conexao = pool) {
    const [rows] = await conexao.execute(
        'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
        [id]
    )

    return rows[0] || null
}

async function criar(dados, conexao = pool) {
    const [resultado] = await conexao.execute(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [dados.nome, dados.email, dados.senha]
    )

    return resultado.insertId
}

module.exports = {
    buscarPorEmail,
    buscarPorEmailComSenha,
    buscarPorId,
    criar
}