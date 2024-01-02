import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';
import { numberGenerator, codeGenerator } from '../../middlewares/randomCodeGenerator';

const prisma = new PrismaClient()

export const routerTickets = Router()

routerTickets.get('/', (req, res) => res.send('API de Tickets'))

// Search by ticket Identifier
routerTickets.get('/comments/:ticket', validateJWT, async (req, res) => {
    try {
        const ticket = req.params.ticket;

        const commentsData = await prisma.comentarios.findMany({
            where: {
                cmt_ticketIdentifier:  ticket
                
            }
        });
        
        res.send(commentsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your room');
    }
});

// Search by ticket Identifier
routerTickets.post('/new-comment/:ticket', validateJWT, async (req, res) => {
    try {
        console.log(req.params)
        const ticket = req.params.ticket;
        const userData = await extractUserDataFromToken(req, res);
        const { text} = req.body;

        if (text == ''){
            return res.status(505).json({ message: 'Comments cannot be empty' });
        }

        if (!userData || !('usr_company' in userData)) {
            return res.status(401).json({ message: 'Invalid session data' });
        }

        const commentsData = await prisma.comentarios.create({
            data: {
                cmt_authorName: userData.usr_name + ' ' + userData.usr_last_name,
                cmt_authorPicture: userData.usr_picture,
                cmt_company: userData.usr_company,
                cmt_picture: '',
                cmt_ticketIdentifier:ticket,
                cmt_user: userData.usr_id,
                cmt_txt: text,
            }
        });
        
        res.send(commentsData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving your comment');
    }
});

routerTickets.get('/ticket/:ticket', validateJWT, async (req, res) => {
    try {
        const ticket = req.params.ticket;

        const ticketData = await prisma.tickets.findFirst({
            where: {
                tkt_identifier:  ticket

            }
        });
        
        res.send(ticketData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your room');
    }
});

// routerTickets.get('/new', validateJWT, async (req, res) => {
//     try {
//         const userData = await extractUserDataFromToken(req, res);
//         const { description, title} = req.body;

//         if (!userData || !('usr_company' in userData)) {
//             return res.status(401).json({ message: 'Invalid session data' });
//         }

//         const identifier = codeGenerator(20);
//         const number = numberGenerator(6);
        
//         const newTicket = await prisma.tickets.create({
//             data: {
//                 tkt_company: userData.usr_company,
//                 tkt_email: userData.usr_email,
//                 tkt_identifier: identifier,
//                 tkt_number: number,
//                 tkt_description: description,
//                 tkt_title: title,
//                 tkt_status: 1,
//             }
//         })
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error looking for your room');
//     }
// });

// Search by session user company
routerTickets.get('/my-tickets', validateJWT, async (req, res) => {
    const userData = await extractUserDataFromToken(req, res);

    if (!userData || !('usr_company' in userData)) {
        return res.status(401).json({ message: 'Invalid session data' });
    }

    try {
        const projectData = await prisma.tickets.findMany({
            where: {
                tkt_author: userData.usr_id,
            }
        });
       
            res.status(200).send(projectData);
       
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your company projects');
    }
});

// Search by session user company
routerTickets.get('/my-tickets-open', validateJWT, async (req, res) => {
    const userData = await extractUserDataFromToken(req, res);

    if (!userData || !('usr_company' in userData)) {
        return res.status(401).json({ message: 'Invalid session data' });
    }

    try {
        const projectData = await prisma.tickets.findMany({
            where: {
                tkt_author: userData.usr_id,
                tkt_status: 1
            }
        });
       
            res.status(200).send(projectData);
       
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your company projects');
    }
});
