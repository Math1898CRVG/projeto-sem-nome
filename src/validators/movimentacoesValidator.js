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
