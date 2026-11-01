const grid = document.getElementById('container-grid')
const connectionStatus = document.getElementById('connection-status')

function exibeEstado(mensagem, icone = 'fa-circle-exclamation') {
    grid.innerHTML = ''
    const estado = document.createElement('div')
    estado.className = 'empty-state'
    const simbolo = document.createElement('i')
    simbolo.className = `fa-brands ${icone}`
    simbolo.setAttribute('aria-hidden', 'true')
    estado.append(simbolo, document.createTextNode(mensagem))
    grid.appendChild(estado)
}

function criaCard(docker) {
    const card = document.createElement('article')
    card.className = 'card'

    const cabecalho = document.createElement('div')
    cabecalho.className = 'card-head'
    const icone = document.createElement('span')
    icone.className = 'container-icon'
    icone.innerHTML = '<i class="fa-brands fa-docker" aria-hidden="true"></i>'
    const identidade = document.createElement('div')
    identidade.style.minWidth = '0'
    const nome = document.createElement('h3')
    nome.textContent = docker.name || 'Contêiner sem nome'
    const status = document.createElement('span')
    status.className = 'status'
    status.textContent = 'Em execução'
    identidade.append(nome, status)
    cabecalho.append(icone, identidade)

    const cpu = document.createElement('p')
    cpu.className = 'info'
    cpu.append('Processador')
    const cpuValor = document.createElement('span')
    cpuValor.textContent = docker.cpu || '—'
    cpu.appendChild(cpuValor)

    const memoria = document.createElement('p')
    memoria.className = 'info'
    memoria.append('Memória (uso / limite)')
    const memoriaValor = document.createElement('span')
    memoriaValor.textContent = docker.mem || '—'
    memoria.appendChild(memoriaValor)

    card.append(cabecalho, cpu, memoria)
    return card
}

async function buscaDados() {
    try {
        const resposta = await fetch('/api/stats')
        if (!resposta.ok) throw new Error(`Servidor respondeu com status ${resposta.status}`)
        const containeres = await resposta.json()
        if (!Array.isArray(containeres)) throw new Error('Resposta do servidor inválida')

        connectionStatus.textContent = 'Atualizado em tempo real'
        if (containeres.length === 0) {
            exibeEstado('Nenhum contêiner em execução no momento.')
            return
        }

        const fragmento = document.createDocumentFragment()
        containeres.forEach(docker => fragmento.appendChild(criaCard(docker)))
        grid.replaceChildren(fragmento)
    } catch (erro) {
        console.error('Erro ao buscar dados do servidor:', erro)
        connectionStatus.textContent = 'Servidor indisponível'
        exibeEstado('Não foi possível conectar. Verifique se o servidor está rodando em localhost:3000.')
    }
}

buscaDados()
setInterval(buscaDados, 2000)
