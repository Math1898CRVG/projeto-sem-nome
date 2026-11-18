
function criarErro(mensagem) {
    const erro = new Error(mensagem)
    erro.status = 400

    return erro
}

function verificarObjeto(body) {
    if (
        body === null ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
        throw criarErro('Dados inválidos')
    }
}

function validarNome(nome) {
    if (typeof nome !== 'string') {
        throw criarErro('Nome inválido')
    }

    nome = nome.trim()

    const tamanho = [...nome].length

    if (tamanho < 2) {
        throw criarErro('O nome deve possuir pelo menos 2 caracteres')
    }

    if (tamanho > 100) {
        throw criarErro('O nome não pode ultrapassar 100 caracteres')
    }

    return nome
}

function validarEmail(email) {
    if (typeof email !== 'string') {
        throw criarErro('E-mail inválido')
    }

    email = email.trim().toLowerCase()

    if (email.length === 0) {
        throw criarErro('O e-mail é obrigatório')
    }

    if ([...email].length > 255) {
        throw criarErro('O e-mail não pode ultrapassar 255 caracteres')
    }

    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formatoValido.test(email)) {
        throw criarErro('Formato de e-mail inválido')
    }

    return email
}

function validarSenha(senha) {
    if (typeof senha !== 'string') {
        throw criarErro('Senha inválida')
    }

    const tamanho = [...senha].length
    const bytes = Buffer.byteLength(senha, 'utf8')

    if (tamanho < 8) {
        throw criarErro('A senha deve possuir pelo menos 8 caracteres')
    }

    if (bytes > 72) {
        throw criarErro('A senha não pode ultrapassar 72 bytes')
    }

    return senha
}

function validarCadastro(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome),
        email: validarEmail(body.email),
        senha: validarSenha(body.senha)
    }
}

function validarAtualizacao(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome),
        email: validarEmail(body.email)
    }
}

function validarId(id) {
    if (
        typeof id !== 'string' ||
        !/^[1-9]\d*$/.test(id)
    ) {
        throw criarErro('ID inválido')
    }

    const numero = Number(id)

    if (!Number.isSafeInteger(numero)) {
        throw criarErro('ID inválido')
    }

    return numero
}

module.exports = {
    validarCadastro,
    validarAtualizacao,
    validarId
}
