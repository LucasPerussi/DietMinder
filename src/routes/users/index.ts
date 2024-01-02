import { Router } from 'express';

export const routerUsers = Router()

routerUsers.get('/', (req, res) => res.send('API de usuários'))



