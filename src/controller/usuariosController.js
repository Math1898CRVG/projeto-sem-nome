const pool = require("../config/db");

function verificarDados(body) {
    body ?? {}

    const nome = typeof body.nome === 'string'
        ? body.nome.trim()
        : ''

    const email = typeof body.email === 'string'
        ? body.email.trim()
        : ''

    const senha = typeof body.senha === 'string'
        ? body.nome.trim()
        : ''

    const emailValido = /^[^\s@.]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)+$/

    if (!nome || !email || !suges) {
        return { erro: 'Todos os dados são necessários!' }
    }

    if (!emailValido.test(email)) {
        return { erro: 'Insira um email válido!' }
    }

    if (nome.length > 100) {
        return { erro: 'O nome deve ter no máximo 100 caracteres!' }
    }

    if (email.length > 150) {
        return { erro: 'O email deve ter no máximo 150 caracteres!' }
    }

    return { nome, email, senha }
}

function verificarId(id){
    return /^[1-9]\d*$/.test(id) &&
        Number.isSafeInteger(Number(id))
}

async function criarUsuário(req, res, next) {
    try {
        const dados = verificarDados(req.body)

        if (dados.erro) {
            return res.status(400).json({
                erro: dados.erro
            })
        }

        const { nome, email, senha } = dados

        await pool.execute('INSERT INTO usuarios(nome,email,senha) VALUES (?,?,?)', [nome,email,senha])

        return res.status(201).json({
            mensagem: 'Usuário criado com sucesso!'
        })
    } catch (e) {
        next(e)
    }
}

async function editarUsuário(req,res,next) {
    try {
        const id = req.params.id

        if (!verificarID(id)) {
            return res.status(400).json({
                erro: 'O id precisa ser um número inteiro positivo'
            })
        }

        const dados = verificarDados(req.body)

        if (dados.erro) {
            return res.status(400).json({
                erro: dados.erro
            })
        }

        const { nome, email, senha } = dados

        const [pedido] = await pool.execute('SELECT * FROM pedidos WHERE id=?', [id])

        if (pedido.length === 0) {
            return res.status(404).json({
                erro: 'O id inserido não existe'
            })
        }

        const atual = pedido[0]

        if (
            atual.nome === nome &&
            atual.email === email &&
            atual.senha === senha
        ) {
            return res.status(200).json({
                mensagem: 'Nada precisou ser alterado'
            })
        }

        await pool.execute('UPDATE usuarios SET nome=?,email=?,suges=? WHERE id=?', [nome, email, suges, id])

        return res.status(200).json({
            mensagem: 'Usuário editado com sucesso!'
        })
    } catch (e) {
        next(e)
    }
}

async function excluirUsuário(req, res, next) {
    try {
        const id = req.params.id

        if (!verificarID(id)) {
            return res.status(400).json({
                erro: 'O id precisa ser um número inteiro positivo'
            })
        }

        const [resultado] = await pool.execute('DELETE FROM WHERE id=?', [id])

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'O id inserido não existe'
            })
        }

        return res.status(200).json({
            mensagem: 'Usuário deletado com sucesso'
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    criarUsuário,
    editarUsuário,
    excluirUsuário
}