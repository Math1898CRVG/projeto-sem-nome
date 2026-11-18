const LIMITE_INT_UNSIGNED = 4294967295

function criarErro(mensagem) {
    const erro = new Error(mensagem)
    erro.status = 400

    return erro
}

function verificarObjeto(body) {
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
        throw criarErro('Dados inválidos')
    }
}

function validarNome(nome) {
    if (typeof nome !== 'string') {
        throw criarErro('Nome do produto inválido')
    }

    nome = nome.trim()
    const tamanho = [...nome].length

    if (tamanho < 2 || tamanho > 100) {
        throw criarErro('O nome deve possuir entre 2 e 100 caracteres')
    }

    return nome
}

function validarQuantidadeMinima(quantidade) {
    if (
        !Number.isInteger(quantidade) ||
        quantidade < 0 ||
        quantidade > LIMITE_INT_UNSIGNED
    ) {
        throw criarErro('A quantidade mínima deve ser um inteiro não negativo válido')
    }

    return quantidade
}

function validarId(id) {
    if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
        throw criarErro('ID inválido')
    }

    const numero = Number(id)

    if (!Number.isSafeInteger(numero)) {
        throw criarErro('ID inválido')
    }

    return numero
}

function validarCriacao(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome),
        quantidade_minima: validarQuantidadeMinima(
            body.quantidade_minima === undefined ? 0 : body.quantidade_minima
        )
    }
}

function validarAtualizacao(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome),
        quantidade_minima: validarQuantidadeMinima(body.quantidade_minima)
    }
}

module.exports = {
    validarCriacao,
    validarAtualizacao,
    validarId
}
