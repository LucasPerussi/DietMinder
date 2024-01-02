import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()

export const routerProducts = Router()

routerProducts.get('/', (req, res) => res.send('API de Produtos'))


// List all products
routerProducts.get('/all', validateJWT, async (req, res) => {
    try {
        const products = await prisma.products.findMany({})
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});

