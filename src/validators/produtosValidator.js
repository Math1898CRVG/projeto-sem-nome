const LIMITE_INT_UNSIGNED = 4294967295

function criarErro(mensagem) {
    const erro = new Error(mensagem)
    erro.status = 400

    return erro
}

function verificarObjeto(body) {
<<<<<<< HEAD
    if (
        body === null ||
        typeof body !== 'object' ||
        Array.isArray(body)
    ) {
=======
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
        throw criarErro('Dados inválidos')
    }
}

function validarNome(nome) {
    if (typeof nome !== 'string') {
        throw criarErro('Nome do produto inválido')
    }

    nome = nome.trim()
<<<<<<< HEAD

    const tamanho = [...nome].length

    if (tamanho < 2) {
        throw criarErro(
            'O nome do produto deve possuir pelo menos 2 caracteres'
        )
    }

    if (tamanho > 100) {
        throw criarErro(
            'O nome do produto não pode ultrapassar 100 caracteres'
        )
=======
    const tamanho = [...nome].length

    if (tamanho < 2 || tamanho > 100) {
        throw criarErro('O nome deve possuir entre 2 e 100 caracteres')
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
    }

    return nome
}

function validarQuantidadeMinima(quantidade) {
    if (
<<<<<<< HEAD
        typeof quantidade !== 'number' ||
        !Number.isSafeInteger(quantidade)
    ) {
        throw criarErro('Quantidade mínima inválida')
    }

    if (quantidade < 0) {
        throw criarErro('A quantidade mínima não pode ser negativa')
    }

    if (quantidade > LIMITE_INT_UNSIGNED) {
        throw criarErro('A quantidade mínima excede o limite permitido')
    }

    return quantidade
}

function validarCriacao(body) {
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome),
        // Opcional na criação: se não vier, começa em 0
        quantidade_minima: body.quantidade_minima === undefined
            ? 0
            : validarQuantidadeMinima(body.quantidade_minima)
    }
}

function validarAtualizacao(body) {
=======
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
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
    verificarObjeto(body)

    return {
        nome: validarNome(body.nome),
<<<<<<< HEAD
        quantidade_minima: validarQuantidadeMinima(body.quantidade_minima)
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
=======
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
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
}

module.exports = {
    validarCriacao,
    validarAtualizacao,
    validarId
}
