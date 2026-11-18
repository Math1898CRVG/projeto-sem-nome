const express = require('express')
const path = require('path')
const app = express()

const usuariosRoutes = require('./routes/usuariosRoutes')
const authRoutes = require('./routes/authRoutes')
const estoquesRoutes = require('./routes/estoquesRoutes')

const tratamentoErros = require('./middlewares/tratamentoErros')

app.use(express.json())

// Front-end (public/css, public/js, public/pages)
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req, res) => {
    return res.redirect('/pages/index.html')
})

app.get('/status', (req, res) => {
    return res.status(200).json({
        mensagem: 'API de controle de estoque funcionando!'
    })
})

// Rotas
// Produtos e movimentações ficam dentro de /estoques/:estoqueId/...
app.use('/usuarios', usuariosRoutes)
app.use('/auth', authRoutes)
app.use('/estoques', estoquesRoutes)

// Rota não encontrada
app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada')
    erro.status = 404
    next(erro)
})

// Tratamento centralizado de erros
app.use(tratamentoErros)

module.exports = app
