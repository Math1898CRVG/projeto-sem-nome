
const pool = require("../config/db")
const bcrypt = require("bcrypt")

function verificarDados(body, exigirSenha = true) {
    body = body && typeof body === 'object' && !Array.isArray(body)
        ? body
        : {}

    const nome = typeof body.nome === 'string'
        ? body.nome.trim()
        : ''

    const email = typeof body.email === 'string'
        ? body.email.trim().toLowerCase()
        : ''

    const senha = typeof body.senha === 'string'
        ? body.senha.trim()
        : ''

    const emailValido = /^[^\s@.]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)+$/

    if (!nome || !email || (exigirSenha && !senha)) {
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

    if (exigirSenha && senha.length < 8) {
        return { erro: 'A senha deve ter no mínimo 8 caracteres!' }
    }

    if (senha.length > 72) {
        return { erro: 'A senha deve ter no máximo 72 caracteres!' }
    }

    return { nome, email, senha }
}

function verificarId(id) {
    return /^[1-9]\d*$/.test(id) &&
        Number.isSafeInteger(Number(id))
}

async function verificarEmail(email, id = null) {
    let sql = 'SELECT id FROM usuarios WHERE email = ?'
    const valores = [email]

    if (id !== null) {
        sql += ' AND id != ?'
        valores.push(id)
    }

    const [rows] = await pool.execute(sql, valores)

    return rows.length > 0
}

async function mostrarUsuarios(req, res, next) {
    try {
        const [rows] = await pool.execute(
            'SELECT id, nome, email FROM usuarios'
        )

        return res.status(200).json(rows)
    } catch (e) {
        next(e)
    }
}

async function criarUsuario(req, res, next) {
    try {
        const dados = verificarDados(req.body)

        if (dados.erro) {
            return res.status(400).json({
                erro: dados.erro
            })
        }

        const { nome, email, senha } = dados

        if (await verificarEmail(email)) {
            return res.status(409).json({
                erro: 'Este email já está cadastrado!'
            })
        }

        const hash = await bcrypt.hash(senha, 10)

        await pool.execute(
            'INSERT INTO usuarios(nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, hash]
        )

        return res.status(201).json({
            mensagem: 'Usuário criado com sucesso!'
        })
    } catch (e) {
        next(e)
    }
}

async function editarUsuario(req, res, next) {
    try {
        const id = req.params.id

        if (!verificarId(id)) {
            return res.status(400).json({
                erro: 'O id precisa ser um número inteiro positivo'
            })
        }

        const dados = verificarDados(req.body, false)

        if (dados.erro) {
            return res.status(400).json({
                erro: dados.erro
            })
        }

        const { nome, email } = dados

        const [usuarios] = await pool.execute(
            'SELECT id, nome, email FROM usuarios WHERE id = ?',
            [id]
        )

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'O usuário inserido não existe'
            })
        }

        const atual = usuarios[0]

        if (
            atual.nome === nome &&
            atual.email === email
        ) {
            return res.status(200).json({
                mensagem: 'Nada precisou ser alterado'
            })
        }

        if (await verificarEmail(email, id)) {
            return res.status(409).json({
                erro: 'Este email já está cadastrado!'
            })
        }

        await pool.execute(
            'UPDATE usuarios SET nome = ?, email = ? WHERE id = ?',
            [nome, email, id]
        )

        return res.status(200).json({
            mensagem: 'Usuário editado com sucesso!'
        })
    } catch (e) {
        next(e)
    }
}

async function alterarSenha(req, res, next) {
    try {
        const id = req.params.id

        if (!verificarId(id)) {
            return res.status(400).json({
                erro: 'O id precisa ser um número inteiro positivo'
            })
        }

        const body = req.body ?? {}

        const senhaAtual = typeof body.senhaAtual === 'string'
            ? body.senhaAtual
            : ''

        const novaSenha = typeof body.novaSenha === 'string'
            ? body.novaSenha
            : ''

        const confirmarSenha = typeof body.confirmarSenha === 'string'
            ? body.confirmarSenha
            : ''

        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            return res.status(400).json({
                erro: 'Todos os campos são necessários!'
            })
        }

        if (novaSenha.length < 8) {
            return res.status(400).json({
                erro: 'A nova senha deve ter no mínimo 8 caracteres!'
            })
        }

        if (Buffer.byteLength(novaSenha, 'utf8') > 72) {
            return res.status(400).json({
                erro: 'A nova senha excede o limite permitido!'
            })
        }

        if (novaSenha !== confirmarSenha) {
            return res.status(400).json({
                erro: 'A confirmação da senha não corresponde!'
            })
        }

        if (senhaAtual === novaSenha) {
            return res.status(400).json({
                erro: 'A nova senha precisa ser diferente da atual!'
            })
        }

        const [usuarios] = await pool.execute(
            'SELECT senha FROM usuarios WHERE id = ?',
            [id]
        )

        if (usuarios.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado!'
            })
        }

        const senhaCorreta = await bcrypt.compare(
            senhaAtual,
            usuarios[0].senha
        )

        if (!senhaCorreta) {
            return res.status(401).json({
                erro: 'Senha atual incorreta!'
            })
        }

        const hash = await bcrypt.hash(novaSenha, 10)

        await pool.execute(
            'UPDATE usuarios SET senha = ? WHERE id = ?',
            [hash, id]
        )

        return res.status(200).json({
            mensagem: 'Senha alterada com sucesso!'
        })
    } catch (e) {
        next(e)
    }
}

async function excluirUsuario(req, res, next) {
    try {
        const id = req.params.id

        if (!verificarId(id)) {
            return res.status(400).json({
                erro: 'O id precisa ser um número inteiro positivo'
            })
        }

        const [resultado] = await pool.execute(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        )

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                erro: 'O usuário inserido não existe'
            })
        }

        return res.status(200).json({
            mensagem: 'Usuário deletado com sucesso!'
        })
    } catch (e) {
        next(e)
    }
}

module.exports = {
    mostrarUsuarios,
    criarUsuario,
    editarUsuario,
    alterarSenha,
    excluirUsuario
}