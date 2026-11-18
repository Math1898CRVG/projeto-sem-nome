
const express = require('express')
const app = express()
const path = require('path')

const diretorioPublico = path.join(__dirname, '..', 'public')
const usuariosRoutes = require('./routes/usuariosRoutes')
const authRoutes = require('./routes/authRoutes')
const estoquesRoutes = require('./routes/estoquesRoutes')

const tratamentoErros = require('./middlewares/tratamentoErros')

app.use(express.json())

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        mensagem: 'API de controle de estoque funcionando!'
    })
})

app.use(express.static(diretorioPublico))
app.get('/', (req, res) => {
    res.redirect('/pages/index.html')
})

// Rotas
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