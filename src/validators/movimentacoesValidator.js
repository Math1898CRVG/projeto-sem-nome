<<<<<<< HEAD
const TIPOS_VALIDOS = ['entrada', 'saida']
=======
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
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

<<<<<<< HEAD
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
=======
function validarId(id) {
    if (typeof id !== 'string' || !/^[1-9]\d*$/.test(id)) {
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
        throw criarErro('ID inválido')
    }

    const numero = Number(id)

    if (!Number.isSafeInteger(numero)) {
        throw criarErro('ID inválido')
    }

    return numero
}

<<<<<<< HEAD
module.exports = {
    validarCriacao,
    validarId
}
=======
function validarCriacao(body) {
    verificarObjeto(body)

    if (!Number.isSafeInteger(body.produto_id) || body.produto_id <= 0) {
        throw criarErro('Produto inválido')
    }

    if (body.tipo !== 'entrada' && body.tipo !== 'saida') {
        throw criarErro('Tipo de movimentação inválido')
    }

    if (
        !Number.isInteger(body.quantidade) ||
        body.quantidade < 1 ||
        body.quantidade > LIMITE_INT_UNSIGNED
    ) {
        throw criarErro('A quantidade deve ser um inteiro positivo válido')
    }

    return {
        produto_id: body.produto_id,
        tipo: body.tipo,
        quantidade: body.quantidade
    }
}

module.exports = {
    validarCriacao,
    validarId
}
>>>>>>> b75f732302145d50ae5bb56224f3da961b3f1dba
