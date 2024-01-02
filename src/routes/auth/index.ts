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

        const code: string = await sessionGenerator(user.usr_id, user.usr_company)
        if (code === "Error") {
            res.status(505).json({ message: 'Erro interno do servidor. Entre em contato com o suporte' });
        }
        console.log(code)

        const token = jwt.sign({
            user: user.usr_id,
            role: user.usr_role,
            client: 'API'
        }, code, {
            expiresIn: '2h',
        });

        const companyUser = await prisma.company.findUnique({
            where: { com_id: user.usr_company },
            select: {
                com_id: true,
                com_name: true,
                com_identifier: true,
                com_dominio1: true,
                com_dominio2: true,
                com_cnpj: true,
                com_picture: true,
                com_color: true
            }
        })

        var roleText = ''

        switch (user.usr_role) {
            case 1:
                roleText = 'Member'
                break;
            case 2:
                if (user.usr_company == 9999) {
                    roleText = 'Master'
                } else {
                    roleText = 'Admin'
                }
                break;
            case 4:
                roleText = 'Agent'
                break;
            case 5:
                roleText = 'Partner'
                break;
            default:
                roleText = 'Deactivated'
                break;
        }

        res.status(200).json({
            token,
            user: {
                id: user.usr_id,
                name: user.usr_name + ' ' + user.usr_last_name,
                email: user.usr_email,
                role: roleText,
                company: companyUser,
                picture: user.usr_picture,
                profileCompleted: user.usr_profile_completed,
                doubleVerify: user.usr_doubleVerify,
                theme: user.usr_theme,
                language: user.usr_language,
                from: user.usr_from
            }
        });
    } catch (error) {
        console.error('Erro durante o login:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

// routerAuth.post('/create', async (req, res) => {
//     const { email, password, name, last_name, birthday } = req.body;
//     let role = 1;
//     try {
//         const userAlreadyExists = await userExists(email);

//         if (userAlreadyExists) {
//             console.log("Trying to create a new user for an existing account: " + email)
//             res.status(400).json({ message: 'This account already exists' })
//         } else {

//             const hashedPassword = await bcrypt.hash(password, 10);
//             const hasCompany = await checkCompany(email);
//             const isAdmin = await checkFirstCompanyUser(hasCompany);
//             const username = await generateUsername(name, last_name);

//             if (isAdmin) {
//                 role = 2;
//             }

//             const companyData =  await prisma.company.findFirst({
//                 where: {com_id : hasCompany},
//                 select: {
//                     com_id: true,
//                     com_identifier: true, 
//                     com_name: true
//                 }
//             })

//             try {
//                 await prisma.user.create({
//                     data: {
//                         usr_email: email,
//                         usr_password: hashedPassword,
//                         usr_name: name,
//                         usr_last_name: last_name,
//                         usr_born_date: new Date(birthday),
//                         usr_company: hasCompany,
//                         usr_companyIdentifier: companyData?.com_identifier,
//                         usr_from: 4,
//                         usr_public_id: username,
//                         usr_role: role,
//                         usr_user: username
//                     }
//                 });
//             } catch (error) {
//                 console.error('Erro durante a criação de usuário:', error);
//                 return res.status(500).json({ message: 'Erro interno do servidor.' });
//             }
//             const createdUser = await prisma.user.findUnique({
//                 where: { usr_email: email },
//                 select: {
//                     usr_id: true,
//                     usr_email: true,
//                     usr_name: true,
//                     usr_last_name: true,
//                     usr_born_date: true,
//                     usr_company: true,
//                     usr_from: true,
//                     usr_public_id: true,
//                     usr_role: true,
//                     usr_user: true
//                 }
//             });

//             if (createdUser) {
//                 const createCard = await prisma.card.create({
//                     data: {
//                         crd_username: createdUser.usr_user,
//                         crd_user: createdUser.usr_id
//                     }
//                 })
//                 res.status(201).json({ user: createdUser, card: createCard });
//             } else {
//                 res.status(500).json({ message: 'Erro ao criar card.' });
//             }
//         }
//     } catch (error) {
//         console.error('Erro durante a criação de usuário:', error);
//         res.status(500).json({ message: 'Erro interno do servidor.' });
//     }
// });

routerAuth.post('/create', async (req, res) => {
    const { email, password, name, last_name, birthday } = req.body;
    let role = 1;
    try {
        const userAlreadyExists = await userExists(email);

        if (userAlreadyExists) {
            console.log("Trying to create a new user for an existing account: " + email)
            res.status(400).json({ message: 'This account already exists' })
        } else {

            const hashedPassword = await bcrypt.hash(password, 10);
            const hasCompany = await checkCompany(email);
            const isAdmin = await checkFirstCompanyUser(hasCompany);
            const username = await generateUsername(name, last_name);

            if (isAdmin) {
                role = 2;
            }

            const companyData =  await prisma.company.findFirst({
                where: {com_id : hasCompany},
                select: {
                    com_id: true,
                    com_identifier: true, 
                    com_name: true
                }
            })

            try {
                await prisma.user.createMany({
                    data: [
                        {
                            usr_email: email,
                            usr_password: hashedPassword,
                            usr_name: name,
                            usr_last_name: last_name,
                            usr_born_date: new Date(birthday),
                            usr_company: hasCompany,
                            usr_companyIdentifier: companyData?.com_identifier,
                            usr_from: 4,
                            usr_public_id: username,
                            usr_role: role,
                            usr_user: username
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
                    usr_born_date: true,
                    usr_company: true,
                    usr_from: true,
                    usr_public_id: true,
                    usr_role: true,
                    usr_user: true
                }
            });

            if (createdUser) {
                const createCard = await prisma.card.create({
                    data: {
                        crd_username: createdUser.usr_user,
                        crd_user: createdUser.usr_id
                    }
                })
                res.status(201).json({ user: createdUser, card: createCard });
            } else {
                res.status(500).json({ message: 'Erro ao criar card.' });
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

async function checkFirstCompanyUser(company: number) {

    const hasUser = await prisma.user.findFirst({
        where: {
            usr_company: company
        }
    });

    if (hasUser) {
        return false;
    } else {
        return true;
    }

}

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

async function checkCompany(email: string) {

    const emailDomain = email.match(/@(.+)$/);

    if (!emailDomain || emailDomain.length < 2) {
        return 9999;
    }

    const domain = emailDomain[1];


    const matchingCompany = await prisma.company.findFirst({
        where: {
            OR: [
                { com_dominio1: domain },
                { com_dominio2: domain },
            ],
        },
        select: {
            com_id: true
        },
    });

    if (matchingCompany) {
        const companyId = matchingCompany.com_id;
        return companyId;
    } else {
        return 9999;
    }


}

async function sessionGenerator(user: number, company: number) {
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
                ses_company: company,
                ses_city: 'any',
                ses_country: 'any',
                ses_ip: 'any',
                ses_location: 'any',
                ses_state: 'any',
                ses_timezone: 'any',
                ses_user: user,
            }
        })
        return randomCode;
    } catch (error) {
        console.log(error)
        return "Error";
    }
}

function generateRandomCode(length: number) {
    return crypto.randomBytes(length).toString('hex');
}