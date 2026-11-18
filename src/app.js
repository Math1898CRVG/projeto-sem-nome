
const express = require('express')
const app = express()

const usuariosRoutes = require('./routes/usuariosRoutes')
const authRoutes = require('./routes/authRoutes')
const estoquesRoutes = require('./routes/estoquesRoutes')
const produtosRoutes = require('./routes/produtosRoutes')
const movimentacoesRoutes = require('./routes/movimentacoesRoutes')

const tratamentoErros = require('./middlewares/tratamentoErros')

app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).json({
        mensagem: 'API de controle de estoque funcionando!'
    })
})

// Rotas
app.use('/usuarios', usuariosRoutes)
app.use('/auth', authRoutes)
app.use('/estoques', estoquesRoutes)
app.use('/produtos', produtosRoutes)
app.use('/movimentacoes', movimentacoesRoutes)

// Rota não encontrada
app.use((req, res, next) => {
    const erro = new Error('Rota não encontrada')
    erro.status = 404
    next(erro)
})

// Tratamento centralizado de erros
app.use(tratamentoErros)

module.exports = app