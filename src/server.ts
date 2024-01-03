// startar o servidor
import { app } from './app'

console.log("iniciando....")
const porta = process.env.PORT || 3000
const server = app.listen(porta, () => console.log(`App ouvindo na porta ${porta}`))
console.log(`App ouvindo na porta ${porta}`)

process.on('SIGINT', () => {
    server.close()
    console.log('App finalizado')
})