function tratamentoErros(err, req, res, next) {
    console.error(err)

    if (res.headersSent) {
        return next(err)
    }

    const status = Number.isInteger(err.status) &&
        err.status >= 400 &&
        err.status <= 599
        ? err.status
        : 500

    return res.status(status).json({
        erro: status === 500
            ? 'Erro interno do servidor'
            : err.message
    })
}

module.exports = tratamentoErros