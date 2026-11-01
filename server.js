const path = require("path")

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")))
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")))

app.get("/api/stats", (req, res) => {
    const comando = `docker stats --no-stream --format "{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}"`;

    exec(comando, (error, stdout) => {
        if (error) {
            console.error(error.message);
            return res.status(500).json({ error: "Erro ao ler o Docker" });
        }

        const dados = stdout
            .trim()
            .split("\n")
            .filter(linha => linha.trim() !== "")
            .map(linha => {
                const [name, cpu, mem] = linha.split("|");
                return { name, cpu, mem };
            });

        res.json(dados);
    });
});

app.listen(8765, () => {
    console.log("Servidor de monitoramento rodando em http://localhost:8765");
});