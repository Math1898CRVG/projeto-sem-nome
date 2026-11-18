(function () {
    const API_BASE_URL = (window.API_BASE_URL || 'http://localhost:3000')
        .replace(/\/+$/, '')
    const TOKEN_KEY = 'controleEstoqueToken'
    const USER_KEY = 'controleEstoqueUsuario'

    function clearSession() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }

    function getSession() {
        const token = localStorage.getItem(TOKEN_KEY)
        let usuario = null

        try {
            usuario = JSON.parse(localStorage.getItem(USER_KEY) || 'null')
        } catch (error) {
            clearSession()
        }

        return { token, usuario }
    }

    function saveSession(data) {
        if (!data || !data.token || !data.usuario || !data.usuario.id) {
            throw new Error('A resposta de autenticação está incompleta.')
        }

        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.usuario))
    }

    async function request(path, options) {
        options = options || {}
        const method = options.method || 'GET'
        const headers = { Accept: 'application/json' }

        if (options.body !== undefined) {
            headers['Content-Type'] = 'application/json'
        }

        if (options.auth) {
            const token = localStorage.getItem(TOKEN_KEY)

            if (!token) {
                clearSession()
                window.location.replace('login.html')
                throw new Error('Sua sessão expirou. Entre novamente.')
            }

            headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: options.body === undefined
                ? undefined
                : JSON.stringify(options.body)
        })

        const responseText = await response.text()
        let data = null

        if (responseText) {
            try {
                data = JSON.parse(responseText)
            } catch (error) {
                data = responseText
            }
        }

        if (!response.ok) {
            if (options.auth && response.status === 401) {
                clearSession()
                window.location.replace('login.html')
            }

            const mensagem = data && typeof data === 'object'
                ? data.erro || data.mensagem || data.message
                : data
            const erro = new Error(mensagem || `Falha na requisição (${response.status}).`)
            erro.status = response.status
            throw erro
        }

        return data
    }

    window.ControleEstoque = {
        request,
        getSession,
        saveSession,
        clearSession
    }
})()