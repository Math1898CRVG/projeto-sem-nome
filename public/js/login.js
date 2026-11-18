(function () {
    const form = document.querySelector('.auth-card form')
    const aviso = document.getElementById('erro-login')

    function mostrarErro(mensagem) {
        aviso.textContent = mensagem
        aviso.hidden = false
    }

    form.addEventListener('submit', async function (event) {
        event.preventDefault()
        aviso.hidden = true

        const email = document.getElementById('email').value.trim()
        const senha = document.getElementById('senha').value
        const botao = form.querySelector('[type="submit"]')

        botao.disabled = true

        try {
            const data = await window.ControleEstoque.request('/auth/login', {
                method: 'POST',
                body: { email, senha }
            })

            window.ControleEstoque.saveSession(data)
            window.location.assign('dash.html')
        } catch (erro) {
            mostrarErro(erro.message)
        } finally {
            botao.disabled = false
        }
    })
})()