# Whalewatch

Painel web para acompanhar o consumo de CPU e memória dos contêineres Docker em execução. O projeto combina uma interface leve com uma API Node.js que consulta o Docker Engine.

## Recursos

- Lista os contêineres em execução.
- Exibe o uso de CPU e memória de cada contêiner.
- Atualiza os dados automaticamente a cada 2 segundos.
- Apresenta estados de carregamento, ausência de contêineres e falha de conexão.

## Requisitos

- Node.js e npm.
- Docker instalado e em execução.
- Permissão para executar o comando `docker stats` no terminal do servidor.

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie a API:

   ```bash
   node server.js
   ```

   O servidor ficará disponível na porta `3000`.

3. Abra `index.html` no navegador.

O endereço da API usado pela interface está definido em `public/js/script.js` como `http://192.168.2.110:3000/api/stats`. Ajuste o endereço para o IP ou nome do computador onde o servidor está rodando. Se a interface e a API estiverem no mesmo computador, use `http://localhost:3000/api/stats`.

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
├── server.js                  # API Express e consulta ao Docker
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
# Whalewatch
