const pool = require('../config/db')

async function buscarPorEmail(email) {
    const [resultado] = await pool.execute(
        'SELECT id, nome, email FROM usuarios WHERE email = ?',
        [email]
    )

    return resultado[0] || null
}

async function buscarPorEmailComSenha(email) {
    const [resultado] = await pool.execute(
        'SELECT id, nome, email, senha FROM usuarios WHERE email = ?',
        [email]
    )

    return resultado[0] || null
}

async function buscarPorId(id) {
    const [resultado] = await pool.execute(
        'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
        [id]
    )

    return resultado[0] || null
}

async function criar(dados) {
    const [resultado] = await pool.execute(
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