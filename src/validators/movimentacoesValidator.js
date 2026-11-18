const TIPOS_VALIDOS = ['entrada', 'saida']
const LIMITE_INT_UNSIGNED = 4294967295

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

function validarProdutoId(produtoId) {
    if (
        typeof produtoId !== 'number' ||
        !Number.isSafeInteger(produtoId) ||
        produtoId < 1
    ) {
        throw criarErro('ID do produto inválido')
    }

    return produtoId
}

function validarTipo(tipo) {
    if (typeof tipo !== 'string') {
        throw criarErro('Tipo de movimentação inválido')
    }

    tipo = tipo.trim().toLowerCase()

    if (!TIPOS_VALIDOS.includes(tipo)) {
        throw criarErro(
            'O tipo da movimentação deve ser "entrada" ou "saida"'
        )
    }

    return tipo
}

function validarQuantidade(quantidade) {
    if (
        typeof quantidade !== 'number' ||
        !Number.isSafeInteger(quantidade)
    ) {
        throw criarErro('Quantidade inválida')
    }

    if (quantidade < 1) {
        throw criarErro('A quantidade deve ser maior que zero')
    }

    if (quantidade > LIMITE_INT_UNSIGNED) {
        throw criarErro('A quantidade excede o limite permitido')
    }

    return quantidade
}

function validarCriacao(body) {
    verificarObjeto(body)

    return {
        produto_id: validarProdutoId(body.produto_id),
        tipo: validarTipo(body.tipo),
        quantidade: validarQuantidade(body.quantidade)
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
    validarId
}