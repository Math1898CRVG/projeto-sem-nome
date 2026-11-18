
const jwt = require('jsonwebtoken')

function autenticar(req, res, next) {
    try {
        const authorization = req.headers.authorization

        if (!authorization) {
            return res.status(401).json({
                erro: 'Token não informado!'
            })
        }

        const [tipo, token] = authorization.split(' ')

        if (tipo !== 'Bearer' || !token) {
            return res.status(401).json({
                erro: 'Formato de token inválido!'
            })
        }

        const segredo = process.env.JWT_SECRET

        if (!segredo) {
            throw new Error('JWT_SECRET não configurado')
        }

        const dados = jwt.verify(token, segredo)

        if (!Number.isSafeInteger(dados.id) || dados.id <= 0) {
            return res.status(401).json({
                erro: 'Token inválido!'
            })
        }

        req.usuario = {
            id: dados.id
        }

        next()
    } catch (e) {
        if (
            e.name === 'JsonWebTokenError' ||
            e.name === 'TokenExpiredError' ||
            e.name === 'NotBeforeError'
        ) {
            return res.status(401).json({
                erro: 'Token inválido ou expirado!'
            })
        }

        next(e)
    }
}

module.exports = autenticar