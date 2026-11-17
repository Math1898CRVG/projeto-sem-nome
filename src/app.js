const express = require('express')
const path = require('path')
const app = express()
const usuariosRoutes = require('./routes/usuariosRoutes')

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.get('/', (req,res)=>{
    res.sendFile(path.join())
})

app.use('/usuario', usuariosRoutes)

module.exports = app