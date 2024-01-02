import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()

export const routerRooms = Router()

routerRooms.get('/', (req, res) => res.send('API de Salas'))

// Search by Room Identifier
routerRooms.get('/room/:room', validateJWT, async (req, res) => {
    try {
        const room = req.params.room;

        const roomData = await prisma.rooms.findFirst({
            where: {
                rom_identifier:  room
                
            }
        });
        
        res.send(roomData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your room');
    }
});

// Search by Company Identifier
routerRooms.get('/company/:identifier', validateJWT, async (req, res) => {
    try {
        const identifier = req.params.identifier;

        const roomData = await prisma.rooms.findMany({
            where: {
                rom_companyIdentifier:  identifier
                
            }
        });
        
        res.send(roomData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your company rooms');
    }
});

// Search by Company Identifier
routerRooms.get('/my-company', validateJWT, async (req, res) => {
    
    const userData = await extractUserDataFromToken(req, res);
        
    if (!userData || !('usr_company' in userData)) {
        return res.status(401).json({ message: 'Invalid session data' });
    }

    try {
        const roomData = await prisma.rooms.findMany({
            where: {
                rom_company: userData.usr_company,
            }
        });
        
        res.status(200).send(roomData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your company rooms');
    }
});

