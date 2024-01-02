import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()

export const routerNutri = Router()

routerNutri.get('/', (req, res) => res.send('API de Nutricionistas'))

routerNutri.get('/all', validateJWT, async (req, res) => {
    try {
        const products = await prisma.nutritionists.findMany({})
        res.status(200).send(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});


routerNutri.post('/goal/new', validateJWT, async (req, res) => {
    const { name, type, user, value, targetDate  } = req.body;

    try {
        const newGoal = await prisma.goals.create({
            data: {
                gol_name: name,
                gol_target_date: targetDate,
                gol_type: type,
                gol_value: value,
                gol_user: user
            }
        })
        res.status(200).send(newGoal);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});