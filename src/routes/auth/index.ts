import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export const routerAuth = Router()

routerAuth.get('/', (req, res) => res.send('API de Autenticação'))

routerAuth.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { usr_email: email },
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.usr_password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Senha incorreta.' });
        }

        const code: string = await sessionGenerator(user.usr_id)
        if (code === "Error") {
            res.status(505).json({ message: 'Erro interno do servidor. Entre em contato com o suporte' });
        }

        const token = jwt.sign({
            user: user.usr_id,
            role: user.usr_role,
            client: 'API'
        }, code, {
            expiresIn: '2h',
        });

        var roleText = ''
        switch (user.usr_role) {
            case 1:
                roleText = 'Member'
                break;
            case 2:
                roleText = 'Nutricionist'
                break;
            default:
                roleText = 'Admin'
                break;
        }

        res.status(200).json({
            token,
            user: {
                id: user.usr_id,
                name: user.usr_name + ' ' + user.usr_last_name,
                email: user.usr_email,
                role: roleText,
                picture: user.usr_picture,
                theme: user.usr_theme,
            }
        });
    } catch (error) {
        console.error('Erro durante o login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});



routerAuth.post('/new', async (req, res) => {
    const { email, password, name, last_name, birthday, sex } = req.body;
    let role = 1;
    let doubleStepper = 1;
    let theme = 1;

        try {
        const userAlreadyExists = await userExists(email);

        if (userAlreadyExists) {
            console.log("Trying to create a new user for an existing account: " + email)
            res.status(400).json({ message: 'This account already exists' })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const username = await generateUsername(name, last_name);
            try {
                await prisma.user.createMany({
                    data: [
                        {
                            usr_doubleStep: doubleStepper,
                            usr_email: email,
                            usr_last_name: last_name,
                            usr_name: name,
                            usr_sex: sex,
                            usr_theme: theme,
                            usr_role: role,
                            usr_password: hashedPassword, 
                            usr_born_date: birthday,
                            usr_username: username
                        }
                    ]
                });
            } catch (error) {
                console.error('Erro durante a criação de usuário:', error);
                return res.status(500).json({ message: 'Erro interno do servidor.' });
            }

            const createdUser = await prisma.user.findUnique({
                where: { usr_email: email },
                select: {
                    usr_id: true,
                    usr_email: true,
                    usr_name: true,
                    usr_last_name: true,
                    usr_role: true,
                    usr_username: true
                }
            });

            if (createdUser) {
                const code: string = await sessionGenerator(createdUser.usr_id)
                if (code === "Error") {
                    res.status(505).json({ message: 'Erro interno do servidor. Entre em contato com o suporte' });
                }
                console.log(code)
        
                const token = jwt.sign({
                    user: createdUser.usr_id,
                    role: createdUser.usr_role,
                    client: 'API'
                }, code, {
                    expiresIn: '2h',
                });

                res.status(200).json({
                    token,
                    createdUser
                });
            }


        }
    } catch (error) {
        console.error('Erro durante a criação de usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

routerAuth.get('/sessions', validateJWT, async (req, res) => {
    try {
        const sessions = await prisma.sessions.findMany();
        res.status(200).json({sessions });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerAuth.get('/sessions/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    try {
        const sessions = await prisma.sessions.findMany({
            where: {
                ses_user: user
            }
        });
        res.status(200).json({sessions });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})


async function generateUsername(name: string, last_name:string) {
    const agora = new Date();
    const ano = agora.getFullYear();
    const dia = agora.getDate(); 
    const mes = agora.getMonth() + 1;
    const minuto = agora.getMinutes();
    const cleanLastName = last_name.replace(/\s/g, '');

    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    const capitalizedSobrenomeLimpo = cleanLastName.charAt(0).toUpperCase() + cleanLastName.slice(1);

    const textoLimpo = capitalizedSobrenomeLimpo.replace(/[^A-Za-z0-9]/g, '');
    const username = capitalizedName + textoLimpo + dia + mes + minuto + ano;

    return username;
}

async function userExists(email: string) {

    const existingUser = await prisma.user.findUnique({
        where: { usr_email: email },
    });

    if (existingUser) {
        return true;
    }

}

async function sessionGenerator(user: number) {
    const randomCode: string = generateRandomCode(8);
    try {
        const deleteSessionsUser = await prisma.sessions.deleteMany({
            where: {
                ses_user: user
            }
        });

        const saveSession = await prisma.sessions.create({
            data: {
                ses_key: randomCode,
                ses_city: 'any',
                ses_country: 'any',
                ses_ip: 'any',
                ses_location: 'any',
                ses_state: 'any',
                ses_timezone: 'any',
                ses_user: user,
            }
        })
        console.log(randomCode)
        return randomCode;
    } catch (error) {
        console.log(error)
        return "Error";
    }
}

function generateRandomCode(length: number) {
    return crypto.randomBytes(length).toString('hex');
}