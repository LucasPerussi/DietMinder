import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';
const prisma = new PrismaClient()

export const routerFitTools = Router()

routerFitTools.get('/', (req, res) => res.send('API de recursos Fitness'))

// REGISTERS

routerFitTools.get('/registers', validateJWT, async (req, res) => {
        const newRegister = await prisma.registers.findMany()
        res.status(200).send(newRegister);
});

routerFitTools.get('/registers/id/:id', validateJWT, async (req, res) => {
        const id = parseInt(req.params.id);

        const newRegister = await prisma.registers.findFirst({
            where: {
                reg_id: id
            }
        })
        res.status(200).send(newRegister);
});

routerFitTools.get('/registers/user/:user/:type', validateJWT, async (req, res) => {
        const user = parseInt(req.params.user);
        const type = parseInt(req.params.type);

        const newRegister = await prisma.registers.findMany({
            where: {
                reg_user: user,
                reg_type: type
            }
        })
        res.status(200).send(newRegister);
});

routerFitTools.get('/registers/type/:type', validateJWT, async (req, res) => {
        const type = parseInt(req.params.type);

        const newRegister = await prisma.registers.findMany({
            where: {
                reg_type: type
            }
        })
        res.status(200).send(newRegister);
});

routerFitTools.post('/register/new', validateJWT, async (req, res) => {
    const { type, value, user } = req.body;

    try {
        const newRegister = await prisma.registers.create({
            data: {
                reg_type: type,
                reg_value: value,
                reg_user: user
            }
        })
        res.status(200).send(newRegister);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});

routerFitTools.get('/registers/user/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    const newRegister = await prisma.registers.findMany({
        where: {
            reg_user: user
        }
    })
    res.status(200).send(newRegister);
});


// GOALS

routerFitTools.post('/goal/new', validateJWT, async (req, res) => {
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

routerFitTools.get('/goals', validateJWT, async (req, res) => {
    const newRegister = await prisma.goals.findMany()
    res.status(200).send(newRegister);
});

routerFitTools.get('/goals/id/:id', validateJWT, async (req, res) => {
    const id = parseInt(req.params.id);

    const newRegister = await prisma.goals.findFirst({
        where: {
            gol_id: id
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/goals/user/:user/:type', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);
    const type = parseInt(req.params.type);

    const newRegister = await prisma.goals.findMany({
        where: {
            gol_user: user,
            gol_type: type
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/goals/type/:type', validateJWT, async (req, res) => {
    const type = parseInt(req.params.type);

    const newRegister = await prisma.goals.findMany({
        where: {
            gol_type: type
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/goals/type/:type', validateJWT, async (req, res) => {
    const type = parseInt(req.params.type);

    const newRegister = await prisma.goals.findMany({
        where: {
            gol_type: type
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/goals/user/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    const newRegister = await prisma.goals.findMany({
        where: {
            gol_user: user
        }
    })
    res.status(200).send(newRegister);
});


// BADGES

routerFitTools.post('/badge/new', validateJWT, async (req, res) => {
    const { type, user, goal  } = req.body;
    try {
        const newGoal = await prisma.badges.create({
            data: {
                bdg_type: type,
                bdg_goal: goal,
                bdg_user: user
            }
        })
        res.status(200).send(newGoal);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching your products');
    }
});

routerFitTools.get('/badges', validateJWT, async (req, res) => {
    const newRegister = await prisma.badges.findMany()
    res.status(200).send(newRegister);
});

routerFitTools.get('/badge/id/:id', validateJWT, async (req, res) => {
    const id = parseInt(req.params.id);

    const newRegister = await prisma.badges.findFirst({
        where: {
            bdg_id: id
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/badge/user/:user/:type', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);
    const type = parseInt(req.params.type);

    const newRegister = await prisma.badges.findMany({
        where: {
            bdg_user: user,
            bdg_type: type
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/badge/type/:type', validateJWT, async (req, res) => {
    const type = parseInt(req.params.type);

    const newRegister = await prisma.badges.findMany({
        where: {
            bdg_type: type
        }
    })
    res.status(200).send(newRegister);
});

routerFitTools.get('/badge/user/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    const newRegister = await prisma.badges.findMany({
        where: {
            bdg_user: user
        }
    })
    res.status(200).send(newRegister);
});