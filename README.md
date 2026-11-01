# Whalewatch

Painel web para acompanhar o consumo de CPU e memória dos contêineres Docker em execução. O projeto combina uma interface leve com uma API Node.js que consulta o Docker Engine. O próprio servidor entrega a interface e a API pela mesma porta, então basta acessar um único endereço.

## Recursos

- Lista os contêineres em execução.
- Exibe o uso de CPU e memória de cada contêiner.
- Atualiza os dados automaticamente a cada 2 segundos.
- Apresenta estados de carregamento, ausência de contêineres e falha de conexão.
- Pode ser acessado de qualquer aparelho da mesma rede (celular, notebook etc.).

## Requisitos

- Node.js e npm.
- Docker instalado e em execução.
- Permissão para executar o comando `docker stats` no terminal do servidor. No Linux, adicione o usuário ao grupo `docker`:

  ```bash
  sudo usermod -aG docker $USER
  ```

  Depois saia e entre na sessão novamente.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor:

   ```bash
   node server.js
   ```

   O servidor ficará disponível na porta `8765`. Para trocar a porta, altere o número em `app.listen` no arquivo `server.js`.

3. Abra o endereço no navegador:

   ```text
   http://localhost:8765
   ```

> Não abra o `index.html` diretamente pelo navegador nem por extensões como o Live Server. A interface busca os dados em `/api/stats`, que só existe quando o acesso é feito pelo servidor Node.

## Acesso pela rede

Para abrir o painel em outro aparelho da mesma rede, use o IP do computador onde o servidor está rodando:

```text
http://IP-DO-SERVIDOR:8765
```

Para descobrir o IP no Linux, rode `hostname -I`. Se o aparelho não conseguir conectar, libere a porta no firewall:

```bash
sudo ufw allow 8765/tcp
```

Recomenda-se reservar o IP do servidor no roteador (reserva de DHCP), para que o endereço não mude.

## Deploy com pm2

Para manter o painel rodando em segundo plano e iniciando junto com o sistema:

```bash
npm install -g pm2
pm2 start server.js --name docker-monitor
pm2 save
pm2 startup
```

O comando `pm2 startup` exibe uma linha começando com `sudo env PATH=...`. Copie e execute essa linha para criar o serviço de inicialização automática.

Comandos úteis:

| Comando | Função |
|---|---|
| `pm2 status` | Mostra se o painel está rodando |
| `pm2 logs docker-monitor` | Exibe mensagens e erros |
| `pm2 restart docker-monitor` | Aplica mudanças feitas no `server.js` |
| `pm2 stop docker-monitor` | Para o painel |

Alterações apenas em HTML, CSS ou `script.js` não exigem reinício: basta recarregar a página com `Ctrl + Shift + R`.

## API

### `GET /api/stats`

Retorna um JSON com nome, uso de CPU e uso/limite de memória dos contêineres:

```json
[
  {
    "name": "meu-container",
    "cpu": "0.25%",
    "mem": "12.4MiB / 1GiB"
  }
]
```

Se não houver contêineres em execução, a resposta será uma lista vazia. Em caso de erro ao consultar o Docker, a API retorna HTTP `500`.

## Estrutura do projeto

```text
.
├── index.html                 # Interface do painel
├── server.js                  # API Express, consulta ao Docker e entrega do front
├── package.json               # Dependências do servidor
└── public/
    ├── css/style.css          # Estilos
    ├── js/script.js           # Atualização e renderização dos dados
    └── img/                   # Imagens da interface
```

## Tecnologias

- Node.js e Express
- Docker CLI (`docker stats`)
- HTML, CSS e JavaScript
- pm2 (deploy)

## Segurança

O painel não possui autenticação e exibe informações dos seus contêineres para qualquer pessoa que consiga acessar o endereço. Use apenas em redes confiáveis e **não exponha a porta na internet** (por exemplo, com redirecionamento de porta no roteador).

## Observações

- A pasta `node_modules/` não deve ser versionada. Mantenha-a no `.gitignore`.