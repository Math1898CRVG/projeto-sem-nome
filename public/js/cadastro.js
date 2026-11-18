(function () {
    const form = document.querySelector('.auth-card form')
    const aviso = document.getElementById('erro-cadastro')

    function mostrarErro(mensagem) {
        aviso.textContent = mensagem
        aviso.hidden = false
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault()
        aviso.hidden = true

        const nome = document.getElementById('nome').value.trim()
        const email = document.getElementById('email').value.trim()
        const senha = document.getElementById('senha').value
        const confirmar = document.getElementById('confirmar').value
        const botao = form.querySelector('[type="submit"]')

        if (senha !== confirmar) {
            mostrarErro('A confirmação da senha não corresponde.')
            return
        }

        if (senha.length < 8) {
            mostrarErro('A senha deve ter no mínimo 8 caracteres.')
            return
        }

        if (new TextEncoder().encode(senha).length > 72) {
            mostrarErro('A senha excede o limite permitido.')
            return
        }

        botao.disabled = true

        try {
            await window.ControleEstoque.request('/usuarios', {
                method: 'POST',
                body: { nome, email, senha }
            })

            window.location.assign('login.html')
        } catch (erro) {
            mostrarErro(erro.message)
        } finally {
            botao.disabled = false
        }
    })
})()