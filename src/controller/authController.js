const authService = require('../services/authService')

function criarErro(mensagem) {
    const erro = new Error(mensagem)
    erro.status = 400

    return erro
}

async function login(req, res, next) {
    try {
        const { email, senha } = req.body ?? {}

        if (typeof email !== 'string' || typeof senha !== 'string') {
            throw criarErro('E-mail e senha são obrigatórios')
        }

        const resultado = await authService.login(email, senha)

        res.status(200).json(resultado)
    } catch (erro) {
        next(erro)
    }
}

module.exports = { login }
