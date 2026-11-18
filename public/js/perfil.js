(function () {
    const api = window.ControleEstoque
    const session = api.getSession()
    const aviso = document.getElementById('perfil-aviso')

    if (!session.token || !session.usuario || !session.usuario.id) {
        api.clearSession()
        window.location.replace('login.html')
        return
    }

    let usuario = session.usuario
    const id = encodeURIComponent(String(usuario.id))
    const forms = document.querySelectorAll('.perfil-grade form')
    const formDados = forms[0]
    const formSenha = forms[1]
    const formExcluir = forms[2]

    function atualizarIdentidade() {
        document.getElementById('perfil-nome').textContent = usuario.nome
        document.getElementById('perfil-email').textContent = usuario.email
        document.getElementById('avatar').textContent =
            Array.from(usuario.nome.trim())[0].toLocaleUpperCase('pt-BR')
        document.getElementById('nome').value = usuario.nome
        document.getElementById('email').value = usuario.email
    }

    function mostrarAviso(mensagem) {
        aviso.textContent = mensagem
        aviso.hidden = false
    }

    function tratarErro(erro) {
        mostrarAviso(erro.message)
    }

    atualizarIdentidade()

    formDados.addEventListener('submit', async function (event) {
        event.preventDefault()
        aviso.hidden = true

        const nome = document.getElementById('nome').value.trim()
        const email = document.getElementById('email').value.trim()
        const botao = formDados.querySelector('[type="submit"]')
        botao.disabled = true

        try {
            await api.request(`/usuarios/${id}`, {
                method: 'PUT',
                auth: true,
                body: { nome, email }
            })

            usuario = Object.assign({}, usuario, { nome, email })
            api.saveSession({ token: session.token, usuario })
            atualizarIdentidade()
            mostrarAviso('Dados da conta atualizados com sucesso.')
        } catch (erro) {
            tratarErro(erro)
        } finally {
            botao.disabled = false
        }
    })

    formSenha.addEventListener('submit', async function (event) {
        event.preventDefault()
        aviso.hidden = true

        const senhaAtual = document.getElementById('senha-atual').value
        const novaSenha = document.getElementById('senha-nova').value
        const confirmarSenha = document.getElementById('senha-confirmar').value
        const botao = formSenha.querySelector('[type="submit"]')

        if (novaSenha.length < 8) {
            mostrarAviso('A nova senha deve ter no mínimo 8 caracteres.')
            return
        }

        if (new TextEncoder().encode(novaSenha).length > 72) {
            mostrarAviso('A nova senha excede o limite permitido.')
            return
        }

        if (novaSenha !== confirmarSenha) {
            mostrarAviso('A confirmação da senha não corresponde.')
            return
        }

        botao.disabled = true

        try {
            await api.request('/usuarios/senha', {
                method: 'PATCH',
                auth: true,
                body: { senhaAtual, novaSenha, confirmarSenha }
            })

            formSenha.reset()
            mostrarAviso('Senha alterada com sucesso.')
        } catch (erro) {
            tratarErro(erro)
        } finally {
            botao.disabled = false
        }
    })

    formExcluir.addEventListener('submit', async function (event) {
        event.preventDefault()

        if (!window.confirm('Deseja realmente excluir sua conta? Esta ação não pode ser desfeita.')) {
            return
        }

        const botao = formExcluir.querySelector('[type="submit"]')
        botao.disabled = true

        try {
            await api.request(`/usuarios/${id}`, {
                method: 'DELETE',
                auth: true
            })

            api.clearSession()
            window.location.assign('login.html')
        } catch (erro) {
            tratarErro(erro)
        } finally {
            botao.disabled = false
        }
    })
})()