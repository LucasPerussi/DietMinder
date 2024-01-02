import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()

export const routerContent = Router()

routerContent.get('/', (req, res) => {
    const dados = {
        category :  "Content",
        status: "Online",
        requirements: "Some endpoints will need a valid token",
        routes: [
        {
            endpoint: "all-public",
            method: "GET",
            description: "List all public contents",
            requirement: {
                token_required: false,
                role: "Public",
                body: false
            }
        },
        {
            endpoint: "/all-company/{id_company}",
            method: "GET",
            description: "Search all content available for the requested company",
            requirement: {
                token_required: true,
                role: "Company member",
                body: false
            }
        },
        {
            endpoint: "/all",
            method: "GET",
            description: "Get all content",
            requirement: {
                token_required: true,
                role: "Wetalk",
                body: false
            }
        },
        {
            endpoint: "/player/{id}",
            method: "GET",
            description: "Get an specific content",
            requirement: {
                token_required: true,
                role: "Wetalk",
                body: false
            }
        }
        ]
    }

    res.send(dados)
})

routerContent.get('/all-public', async (req, res) => {
    try {
        const contentResult = await prisma.content.findMany({
        where: {
            cnt_company: {
            equals: 9999
            }
        }
        });
        res.send(contentResult);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar os conteúdos');
    }
});

routerContent.get('/all-company/:companyId', validateJWT, async (req, res) => {
    try {
        const companyId = parseInt(req.params.companyId);

        if (isNaN(companyId)) {
            return res.status(400).send('CompanyId inválido. Deve ser um número.');
        }

        const contentResult = await prisma.content.findMany({
            where: {
                cnt_company: {
                    equals: companyId
                }
            }
        });
        
        res.send(contentResult);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar os conteúdos');
    }
});

routerContent.get('/player/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).send('CompanyId inválido. Deve ser um número.');
        }

        const contentResult = await prisma.content.findFirst({
            where: {
                cnt_id: {
                    equals: id
                }
            }
        });
        
        res.send(contentResult);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar os conteúdos');
    }
});

routerContent.get('/all', validateJWT, async (req, res) => {
    try {
      const contentResult = await prisma.content.findMany({});
      res.send(contentResult);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar os conteúdos');
    }
  });