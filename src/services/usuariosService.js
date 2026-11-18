const bcrypt = require('bcryptjs')
const usuariosRepository = require('../repositories/usuariosRepository')

const CUSTO_HASH = 12

function criarErro(mensagem, status) {
    const erro = new Error(mensagem)
    erro.status = status

    return erro
}

async function cadastrar(dados) {
    const existente = await usuariosRepository.buscarPorEmail(dados.email)

    if (existente) {
        throw criarErro('E-mail já cadastrado', 409)
    }

    const senhaHash = await bcrypt.hash(dados.senha, CUSTO_HASH)

    let id

    try {
        id = await usuariosRepository.criar({
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash
        })
    } catch (erro) {
        // Dois cadastros simultâneos com o mesmo e-mail
        if (erro.code === 'ER_DUP_ENTRY') {
            throw criarErro('E-mail já cadastrado', 409)
        }

        throw erro
    }

    return usuariosRepository.buscarPorId(id)
}

async function buscarPorId(id) {
    const usuario = await usuariosRepository.buscarPorId(id)

    if (!usuario) {
        throw criarErro('Usuário não encontrado', 404)
    }

    return usuario
}

module.exports = {
    cadastrar,
    buscarPorId
}