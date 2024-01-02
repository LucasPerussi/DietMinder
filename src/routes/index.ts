import { Router } from 'express';

export const router = Router()

const welcome = [
    { 
        mensagem: "Seja bem-vindo (a) à API da Wetalk.it", 
        contato: "suporte@wetalkit.com.br", 
        status: "API Online"
    },
]

router.get('/', (req, res) => res.send(JSON.stringify(welcome)))