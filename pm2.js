// Arquivo do pm2 para gerenciar os processos do container
module.exports = [
    {
        script: "src/index.js",
        watch: true
    }
]