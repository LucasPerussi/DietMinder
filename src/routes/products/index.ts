import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()

export const routerProducts = Router()

routerProducts.get('/', (req, res) => res.send('API de Produtos'))

// Search by Room Identifier
routerProducts.post('/new', validateJWT, async (req, res) => {
    const { name, picture, supplier, externalID } = req.body;
    try {

        const alreadyRegistered = await prisma.product.findFirst({
            where: {
                pro_externalId: externalID
            }
        })
        if (alreadyRegistered){
            res.status(505).send("Product already registered")
            return;
            
        }
        const newProduct = await prisma.product.create({
            data: {
                pro_name: name,
                pro_picture: picture,
                pro_supplier: supplier, 
                pro_externalId: externalID,
                pro_company: 9999,
                pro_ar: 0,
            }
        })
        res.status(200).send(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding your product');
    }
});

// List all products
routerProducts.get('/all', validateJWT, async (req, res) => {
    try {
        const products = await prisma.product.findMany({})
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});

