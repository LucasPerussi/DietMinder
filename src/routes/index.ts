import { Router } from 'express';

export const router = Router()

const welcome = [
    { 
        mensagem: "Seja bem-vindo(a) à API da DietMinder 🏋️🌿", 
        contato: "perussilucas@hotmail.com", 
        status: "API Online"
    }
]

router.get('/', (req, res) => res.send(welcome))