const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usuariosRepository = require('../repositories/usuariosRepository')

// Hash fictício usado para manter o tempo de resposta parecido
// quando o e-mail não existe (evita descobrir e-mails cadastrados)
const HASH_FALSO = '$2a$12$C6UzMDM.H6dfI/f/IKcEeO5k5lJ1Z5v0yX3QdD8oYk0m5r8mQ0b9S'

function criarErro(mensagem, status) {
    const erro = new Error(mensagem)
    erro.status = status

    return erro
}

async function login(email, senha) {
    const segredo = process.env.JWT_SECRET

    if (!segredo) {
        throw criarErro('Configuração de autenticação ausente', 500)
    }

    const emailNormalizado = email.trim().toLowerCase()

    const usuario = await usuariosRepository.buscarPorEmailComSenha(
        emailNormalizado
    )

    const senhaCorreta = await bcrypt.compare(
        senha,
        usuario ? usuario.senha : HASH_FALSO
    )

    if (!usuario || !senhaCorreta) {
        throw criarErro('E-mail ou senha inválidos', 401)
    }

    const token = jwt.sign(
        { id: usuario.id },
        segredo,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    )

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }
    }
}

module.exports = { login }
