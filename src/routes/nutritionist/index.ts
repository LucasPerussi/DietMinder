import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()

export const routerNutri = Router()

routerNutri.get('/', (req, res) => res.send('API de Nutricionistas'))


// List all products
routerNutri.get('/all', validateJWT, async (req, res) => {
    try {
        const products = await prisma.nutritionists.findMany({})
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});

