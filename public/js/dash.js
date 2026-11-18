(function () {
    const api = window.ControleEstoque
    const session = api.getSession()
    const estoqueSelect = document.getElementById('estoque-select')
    const productTable = document.querySelector('#produtos .tabela')
    const movementTable = document.querySelector('#movimentacoes .tabela')
    const lowStockList = document.querySelector('#alertas .lista')
    const chart = document.getElementById('grafico-movimentacoes')
    const stockForm = document.getElementById('estoque-nome').form
    const productForm = document.getElementById('produto-nome').form
    const movementForm = document.getElementById('mov-qtd').form

    if (!session.token || !session.usuario || !session.usuario.id) {
        api.clearSession()
        window.location.replace('login.html')
        return
    }

    document.getElementById('usuario-nome').textContent = session.usuario.nome
    document.getElementById('usuario-email').textContent = session.usuario.email

    const logoutLink = document.querySelector('.menu-usuario a[href="login.html"]')
    logoutLink.addEventListener('click', function () {
        api.clearSession()
    })

    function showError(error) {
        window.alert(error.message)
    }

    function getStockId() {
        return Number(estoqueSelect.value)
    }

    function setMetric(id, value) {
        document.getElementById(id).textContent = String(value)
    }

    function dateValue(value) {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? null : date
    }

    function dateText(value) {
        const date = dateValue(value)
        return date
            ? new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'short',
                timeStyle: 'short'
            }).format(date)
            : String(value || '')
    }

    function clearRows(table) {
        table.querySelectorAll('.linha:not(.cab)').forEach(function (row) {
            row.remove()
        })
    }

    function addCell(row, value) {
        const cell = document.createElement('span')
        cell.textContent = String(value)
        row.appendChild(cell)
        return cell
    }

    function renderProducts(products, stockId) {
        clearRows(productTable)

        products.forEach(function (product) {
            const row = document.createElement('div')
            row.className = 'linha cols-produtos'
            addCell(row, product.nome)
            addCell(row, product.quantidade_atual)
            addCell(row, product.quantidade_minima)

            const statusCell = addCell(row, '')
            const low = Number(product.quantidade_atual) <= Number(product.quantidade_minima)
            const badge = document.createElement('span')
            badge.className = `selo ${low ? 'baixo' : 'entrada'}`
            badge.textContent = low ? 'Baixo' : 'OK'
            statusCell.appendChild(badge)

            const actionCell = addCell(row, '')
            const editLink = document.createElement('a')
            editLink.href = '#'
            editLink.textContent = 'Editar'
            editLink.addEventListener('click', async function (event) {
                event.preventDefault()

                const nome = window.prompt('Nome do produto:', product.nome)
                if (nome === null) {
                    return
                }

                const quantidadeMinima = window.prompt(
                    'Quantidade mínima:',
                    String(product.quantidade_minima)
                )
                if (quantidadeMinima === null) {
                    return
                }

                const minimo = Number(quantidadeMinima)
                if (
                    !nome.trim() ||
                    !Number.isInteger(minimo) ||
                    minimo < 0 ||
                    minimo > 4294967295
                ) {
                    window.alert('Informe um nome e uma quantidade mínima válidos.')
                    return
                }

                try {
                    await api.request(
                        `/estoques/${encodeURIComponent(stockId)}/produtos/${encodeURIComponent(product.id)}`,
                        {
                            method: 'PUT',
                            auth: true,
                            body: { nome: nome.trim(), quantidade_minima: minimo }
                        }
                    )

                    await loadDashboard()
                } catch (error) {
                    showError(error)
                }
            })
            actionCell.appendChild(editLink)
            productTable.appendChild(row)
        })

        document.getElementById('produtos-total').textContent =
            `produtos: ${products.length}`

        const lowProducts = products.filter(function (product) {
            return Number(product.quantidade_atual) <= Number(product.quantidade_minima)
        })
        lowStockList.replaceChildren()

        lowProducts.forEach(function (product) {
            const item = document.createElement('div')
            item.className = 'dado'
            item.textContent =
                `${product.nome} — atual: ${product.quantidade_atual} / mínima: ${product.quantidade_minima}`
            lowStockList.appendChild(item)
        })

        if (lowProducts.length === 0) {
            const item = document.createElement('div')
            item.className = 'dado'
            item.textContent = 'Nenhum produto precisa de reposição.'
            lowStockList.appendChild(item)
        }

        setMetric('kpi-produtos', products.length)
        setMetric('kpi-baixo', lowProducts.length)

        const productSelect = document.getElementById('mov-produto')
        const placeholder = document.createElement('option')
        placeholder.value = ''
        placeholder.textContent = products.length
            ? 'Selecione um produto'
            : 'Cadastre um produto primeiro'
        productSelect.replaceChildren(placeholder)

        products.forEach(function (product) {
            const option = document.createElement('option')
            option.value = String(product.id)
            option.textContent = product.nome
            productSelect.appendChild(option)
        })
    }

    function renderMovements(movements) {
        clearRows(movementTable)

        movements.forEach(function (movement) {
            const row = document.createElement('div')
            row.className = 'linha cols-movs'
            addCell(row, movement.produto_nome)

            const typeCell = addCell(row, '')
            const badge = document.createElement('span')
            badge.className = `selo ${movement.tipo === 'entrada' ? 'entrada' : 'baixo'}`
            badge.textContent = movement.tipo === 'entrada' ? 'Entrada' : 'Saída'
            typeCell.appendChild(badge)

            addCell(row, movement.quantidade)
            addCell(row, dateText(movement.criado_em))
            movementTable.appendChild(row)
        })
    }

    function renderMetricsAndChart(movements) {
        const now = Date.now()
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
        const recent = movements.filter(function (movement) {
            const date = dateValue(movement.criado_em)
            return date && date.getTime() >= sevenDaysAgo && date.getTime() <= now
        })

        const totals = recent.reduce(function (result, movement) {
            const amount = Number(movement.quantidade)
            if (movement.tipo === 'entrada') {
                result.entradas += amount
            } else if (movement.tipo === 'saida') {
                result.saidas += amount
            }
            return result
        }, { entradas: 0, saidas: 0 })

        setMetric('kpi-entradas', totals.entradas)
        setMetric('kpi-saidas', totals.saidas)

        const grouped = new Map()
        const formatter = new Intl.DateTimeFormat('pt-BR')

        for (let offset = 6; offset >= 0; offset -= 1) {
            const day = new Date()
            day.setHours(0, 0, 0, 0)
            day.setDate(day.getDate() - offset)
            grouped.set(formatter.format(day), { entradas: 0, saidas: 0 })
        }

        recent.forEach(function (movement) {
            const date = dateValue(movement.criado_em)
            const values = grouped.get(formatter.format(date))
            if (!values) {
                return
            }

            if (movement.tipo === 'entrada') {
                values.entradas += Number(movement.quantidade)
            } else if (movement.tipo === 'saida') {
                values.saidas += Number(movement.quantidade)
            }
        })

        const chartLines = Array.from(grouped.entries()).map(function (entry) {
            return `${entry[0]}: entradas ${entry[1].entradas} / saídas ${entry[1].saidas}`
        })
        chart.textContent = recent.length
            ? chartLines.join(' · ')
            : 'Sem movimentações nos últimos 7 dias.'
    }

    async function loadDashboard() {
        const stockId = getStockId()

        if (!stockId) {
            renderProducts([], null)
            renderMovements([])
            renderMetricsAndChart([])
            return
        }

        const base = `/estoques/${encodeURIComponent(stockId)}`
        const results = await Promise.all([
            api.request(`${base}/produtos`, { auth: true }),
            api.request(`${base}/movimentacoes`, { auth: true })
        ])

        renderProducts(results[0], stockId)
        renderMovements(results[1])
        renderMetricsAndChart(results[1])
    }

    async function loadStocks(preferredId) {
        const stocks = await api.request('/estoques', { auth: true })
        const savedId = localStorage.getItem('controleEstoqueEstoqueId')
        const requestedId = preferredId || savedId || estoqueSelect.value
        const placeholder = document.createElement('option')
        placeholder.value = ''
        placeholder.textContent = 'Selecione um estoque'
        estoqueSelect.replaceChildren(placeholder)

        stocks.forEach(function (stock) {
            const option = document.createElement('option')
            option.value = String(stock.id)
            option.textContent = stock.nome
            estoqueSelect.appendChild(option)
        })

        const hasRequestedStock = stocks.some(function (stock) {
            return String(stock.id) === String(requestedId)
        })
        estoqueSelect.value = hasRequestedStock
            ? String(requestedId)
            : stocks.length
                ? String(stocks[0].id)
                : ''

        if (estoqueSelect.value) {
            localStorage.setItem('controleEstoqueEstoqueId', estoqueSelect.value)
        } else {
            localStorage.removeItem('controleEstoqueEstoqueId')
        }

        await loadDashboard()
    }

    estoqueSelect.addEventListener('change', function () {
        if (estoqueSelect.value) {
            localStorage.setItem('controleEstoqueEstoqueId', estoqueSelect.value)
        } else {
            localStorage.removeItem('controleEstoqueEstoqueId')
        }

        loadDashboard().catch(showError)
    })

    stockForm.addEventListener('submit', async function (event) {
        event.preventDefault()
        const nome = document.getElementById('estoque-nome').value.trim()
        const botao = stockForm.querySelector('[type="submit"]')

        if (nome.length < 2 || nome.length > 100) {
            window.alert('O nome do estoque deve possuir entre 2 e 100 caracteres.')
            return
        }

        botao.disabled = true

        try {
            const stock = await api.request('/estoques', {
                method: 'POST',
                auth: true,
                body: { nome }
            })
            stockForm.reset()
            await loadStocks(stock.id)
        } catch (error) {
            showError(error)
        } finally {
            botao.disabled = false
        }
    })

    productForm.addEventListener('submit', async function (event) {
        event.preventDefault()
        const stockId = getStockId()
        const nome = document.getElementById('produto-nome').value.trim()
        const quantidadeAtual = Number(document.getElementById('produto-atual').value)
        const quantidadeMinima = Number(document.getElementById('produto-minima').value)
        const botao = productForm.querySelector('[type="submit"]')

        if (!stockId) {
            window.alert('Selecione ou crie um estoque antes de cadastrar produtos.')
            return
        }

        if (
            nome.length < 2 ||
            nome.length > 100 ||
            !Number.isInteger(quantidadeAtual) ||
            quantidadeAtual < 0 ||
            quantidadeAtual > 4294967295 ||
            !Number.isInteger(quantidadeMinima) ||
            quantidadeMinima < 0 ||
            quantidadeMinima > 4294967295
        ) {
            window.alert('Informe valores válidos para o produto e suas quantidades.')
            return
        }

        botao.disabled = true

        try {
            const base = `/estoques/${encodeURIComponent(stockId)}/produtos`
            const product = await api.request(base, {
                method: 'POST',
                auth: true,
                body: { nome, quantidade_minima: quantidadeMinima }
            })
            productForm.reset()

            let openingBalanceError = null
            if (quantidadeAtual > 0) {
                try {
                    await api.request(`/estoques/${encodeURIComponent(stockId)}/movimentacoes`, {
                        method: 'POST',
                        auth: true,
                        body: {
                            produto_id: product.id,
                            tipo: 'entrada',
                            quantidade: quantidadeAtual
                        }
                    })
                } catch (error) {
                    openingBalanceError = error
                }
            }

            await loadDashboard()

            if (openingBalanceError) {
                window.alert(
                    `Produto criado, mas o saldo inicial não foi registrado: ${openingBalanceError.message}`
                )
            }
        } catch (error) {
            showError(error)
        } finally {
            botao.disabled = false
        }
    })

    movementForm.addEventListener('submit', async function (event) {
        event.preventDefault()
        const stockId = getStockId()
        const productId = Number(document.getElementById('mov-produto').value)
        const tipo = document.getElementById('mov-tipo').value
        const quantidade = Number(document.getElementById('mov-qtd').value)
        const botao = movementForm.querySelector('[type="submit"]')

        if (!stockId || !Number.isSafeInteger(productId) || productId <= 0) {
            window.alert('Selecione um estoque e um produto.')
            return
        }

        if (
            !Number.isInteger(quantidade) ||
            quantidade < 1 ||
            quantidade > 4294967295
        ) {
            window.alert('Informe uma quantidade inteira maior que zero.')
            return
        }

        botao.disabled = true

        try {
            await api.request(
                `/estoques/${encodeURIComponent(stockId)}/movimentacoes`,
                {
                    method: 'POST',
                    auth: true,
                    body: { produto_id: productId, tipo, quantidade }
                }
            )

            movementForm.reset()
            await loadDashboard()
        } catch (error) {
            showError(error)
        } finally {
            botao.disabled = false
        }
    })

    loadStocks().catch(showError)
})()