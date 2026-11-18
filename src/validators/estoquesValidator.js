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
        throw criarErro('Nome do estoque inválido')
    }

    nome = nome.trim()

    const tamanho = [...nome].length

    if (tamanho < 2) {
        throw criarErro(
            'O nome do estoque deve possuir pelo menos 2 caracteres'
        )
    }

    if (tamanho > 100) {
        throw criarErro(
            'O nome do estoque não pode ultrapassar 100 caracteres'
        )
    }

    return nome
}

function validarCriacao(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome)
    }
}

function validarAtualizacao(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome)
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
    validarCriacao,
    validarAtualizacao,
    validarId
}