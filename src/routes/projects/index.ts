import { Router } from 'express';
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';
import { codeGenerator, HashMD5Generator } from '../../middlewares/randomCodeGenerator';
import { PrismaClient } from '@prisma/client'
// import logRegister from '../../middlewares/logger';

const prisma = new PrismaClient()
export const routerProjects = Router()

routerProjects.get('/', (req, res) => {
    const dados = {
        category: "Projects",
        status: "Online",
        requirements: "Valid Token",
        routes: [
            {
                endpoint: "number/{numero}",
                method: "GET",
                description: "Search project by project name",
                requirement: {
                    token_required: true,
                    role: "Admin/Partner or Wetalk Agent",
                    body: false
                }
            },
            {
                endpoint: "company/{numero}",
                method: "GET",
                description: "Search all company projects, by company ID",
                requirement: {
                    token_required: true,
                    role: "Admin/Partner or Wetalk Agent",
                    body: false
                }
            },
            {
                endpoint: "my-company",
                method: "GET",
                description: "Get all projects registered for my session company",
                requirement: {
                    token_required: true,
                    role: "Admin/Partner or Wetalk Agent",
                    body: false
                }
            },
            {
                endpoint: "/sold-products/{projectNumber}",
                method: "GET",
                description: "Get all sold products for an specific project, and device info (such as serial number, waranty and so on)",
                requirement: {
                    token_required: true,
                    role: "Admin/Partner or Wetalk Agent",
                    body: false
                }
            },
            {
                endpoint: "/products/{projectNumber}",
                method: "GET",
                description: "Get all sold products for an specific project and the classes linked to them. (Still doesn't list the classes, available soon)",
                requirement: {
                    token_required: true,
                    role: "Admin/Partner or Wetalk Agent",
                    body: false
                }
            },
            {
                endpoint: "/new",
                method: "POST",
                description: "Checks if there is a contact and a company for the provided CNPJ, and if required, creates both. Once either contact or company exist, creates the project and set it to a waiting for approval state.",
                requirement: {
                    token_required: true,
                    role: "Wetalk Agent",
                    body: {
                        "cnpj": "00.000.000/0001-00 (valid CNPJ as a String)" ,
                        "number": "String",
                        "addressCustomer": "String",
                        "phoneCustomer": "String",
                        "emailCustomer": "String",
                        "nameCustomer": "String",
                        "seller": "String"
                    }
                }
            }
        ]
    }

    res.send(dados)
})

// Search by project by number
routerProjects.get('/number/:number', validateJWT, async (req, res) => {
    try {
        const number = req.params.number;
        const projects = await prisma.projetos.findFirst({
            where: {
                prj_number: number
            }
        });

        const userData = await extractUserDataFromToken(req, res);
        if (!userData || !('usr_company' in userData)) {
            console.log('Invalid session data');
            return res.status(401).json({ message: 'Invalid session data' });
        }

        if (projects) {
            const allow = await checkPermission(projects.prj_number, userData.usr_id, userData.usr_role, userData.usr_company, "Projects - GET - /company/:number");

            if (allow === false) {
                console.log('Permissão negada');
                return res.status(401).json({ message: 'Your user does not have enough permission to run this endpoint' });
            }

            console.log('Permissão concedida, enviando projetos');
            // Envie os projetos apenas quando a permissão for concedida
            return res.send(projects);
        }

        return res.status(500).send('Error looking for your project');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your project');
    }
});

// Search projects by company id
routerProjects.get('/company/:number', validateJWT, async (req, res) => {
    const number = parseInt(req.params.number);

    try {
        const userData = await extractUserDataFromToken(req, res);
        if (!userData || !('usr_company' in userData)) {
            console.log('Invalid session data');
            return res.status(401).json({ message: 'Invalid session data' });
        }
        const projects = await prisma.projetos.findFirst({
            where: {
                prj_company: number
            }
        });

        if (projects) {
            const allow = await checkPermission(projects.prj_number, userData.usr_id, userData.usr_role, userData.usr_company, "Projects - GET - /company/:number");

            if (allow === false) {
                console.log('Permissão negada');
                return res.status(401).json({ message: 'Your user does not have enough permission to run this endpoint' });
            }
            return res.send(projects);
        }
        return res.status(500).send('Error looking for your project');
    } catch (error) {
        // logRegister.error('Erro no bloco catch:', error);
        return res.status(500).send('Error processing your request');
    }
});

// Search by session user company
routerProjects.get('/my-company', validateJWT, async (req, res) => {
    const userData = await extractUserDataFromToken(req, res);

    if (!userData || !('usr_company' in userData)) {
        return res.status(401).json({ message: 'Invalid session data' });
    }

    try {
        const projectData = await prisma.projetos.findMany({
            where: {
                prj_company: userData.usr_company,
            }
        });
        if (userData.usr_role === 2) {
            res.status(200).send(projectData);
        } else {
            res.status(400).send("You need to be an admin to access these info.")
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error looking for your company projects');
    }
});

routerProjects.get('/sold-products/:projectNumber', validateJWT, async (req, res) => {
    const projectNumber = parseInt(req.params.projectNumber)
    const projectNumberString = req.params.projectNumber

    try {


        const userData = await extractUserDataFromToken(req, res);
        if (!userData || !('usr_company' in userData)) {
            console.log('Invalid session data');
            return res.status(401).json({ message: 'Invalid session data' });
        }
        const projects = await prisma.projetos.findFirst({
            where: {
                prj_number: projectNumberString
            }
        });

        const soldProducts = await prisma.produtos_vendidos.findMany({
            where: { sol_pro_project: projectNumber }
        })

        if (projects) {
            const allow = await checkPermission(projects.prj_number, userData.usr_id, userData.usr_role, userData.usr_company, "Projects - GET - /company/:number");
            if (allow === false) {
                console.log('Permissão negada');
                return res.status(401).json({ message: 'Your user does not have enough permission to run this endpoint' });
            }
            res.status(200).send(soldProducts)
            return
        }
        return res.status(500).send('Error looking for your project');
    } catch (error) {
        console.log(error)
        res.status(500).send("We had an internal error, and couldn't process your request.")
        return;
    }
})

routerProjects.get('/products/:projectNumber', validateJWT, async (req, res) => {
    const projectNumber = req.params.projectNumber
    try {
        const userData = await extractUserDataFromToken(req, res);
        if (!userData || !('usr_company' in userData)) {
            console.log('Invalid session data');
            return res.status(401).json({ message: 'Invalid session data' });
        }
        const projects = await prisma.projetos.findFirst({
            where: {
                prj_number: projectNumber
            }
        });
        const soldProducts = await prisma.produtos_projeto.findMany({
            where: { proprj_project: projectNumber }
        })
        if (projects) {
            const allow = await checkPermission(projects.prj_number, userData.usr_id, userData.usr_role, userData.usr_company, "Projects - GET - /company/:number");
            if (allow === false) {
                console.log('Permissão negada');
                return res.status(401).json({ message: 'Your user does not have enough permission to run this endpoint' });
            }
            res.status(200).send(soldProducts)
            return
        }
        return res.status(500).send('Error looking for your project');
    } catch (error) {
        console.log(error)
        res.status(500).send("We had an internal error, and couldn't process your request.")
        return;
    }
})

// NEW PROJECT ENDPOINT
routerProjects.post('/new', validateJWT, async (req, res) => {
    const { cnpj, number, addressCustomer, phoneCustomer, emailCustomer, nameCustomer, seller } = req.body;

    const company = await prisma.company.findFirst({
        where: { com_cnpj: cnpj }
    })
    const contact = await prisma.contatos.findFirst({
        where: { con_cnpj: cnpj }
    })

    const userData = await extractUserDataFromToken(req, res);
    if (!userData || !('usr_company' in userData)) {
        console.log('Invalid session data');
        return res.status(401).json({ message: 'Invalid session data' });
    }

    const allow = await checkPermission(number, userData.usr_id, userData.usr_role, userData.usr_company, "Projects - POST - /new'");
    if (allow === false) {
        console.log('Permissão negada');
        return res.status(401).json({ message: 'Your user does not have enough permission to run this endpoint' });
    }


    if (company?.com_id != null) {
        const newProject = await prisma.projetos.create({
            data:{
                prj_cnpj: cnpj,
                prj_company: company.com_id,
                prj_contactId: contact?.con_id ? contact?.con_id : 9999,
                prj_number: number, 
                prj_costumerPhone: phoneCustomer,
                prj_costumerName: nameCustomer,
                prj_stage: 98, 
                prj_costumerEmail: emailCustomer,
                prj_seller: seller,
                prj_installationAddress: addressCustomer,
                prj_inboundtype: 1,
                prj_feedbackUrl: ''    
            }
        })
        console.log('empresa já existe')
        res.status(200).send(newProject)
        return
    } else {
        const cnpjNumbers = cnpj.replace(/\D/g, '');
        const newCompanyId = await autoCreateCompanyByContact(cnpjNumbers)
        if (newCompanyId?.company){
            const newProject = await prisma.projetos.create({
                data:{
                    prj_cnpj: cnpj,
                    prj_company: newCompanyId.company,
                    prj_contactId: newCompanyId.contact ? newCompanyId.contact : 9999,
                    prj_number: number, 
                    prj_costumerPhone: phoneCustomer,
                    prj_costumerName: nameCustomer,
                    prj_stage: 100, 
                    prj_costumerEmail: emailCustomer,
                    prj_seller: seller,
                    prj_installationAddress: addressCustomer,
                    prj_inboundtype: 1,
                    prj_feedbackUrl: ''    
                }
            })
            if (newProject.prj_id != null){
                res.status(200).send(newProject)
                return
            } 
            res.status(500).send('We had a problem creating your project, please, contact our support team.')
            return
        }else {
            res.status(500).send('We had a problem creating your project, please, contact our support team.')
            return
        }
    }
})

// NEW PRODUCT TO ENDPOINT
routerProjects.post('/add-product/:projectNumber', validateJWT, async (req, res) => {
    const projectNumber = req.params.projectNumber;
    const { product, quantity } = req.body;
    try {
        const userData = await extractUserDataFromToken(req, res);
        if (!userData || !('usr_company' in userData)) {
            console.log('Invalid session data');
            return res.status(401).json({ message: 'Invalid session data' });
        }
    
        const addProductProject = await prisma.produtos_projeto.create({
            data: {
                proprj_product: product,
                proprj_quantity: quantity,
                proprj_project: projectNumber,
                proprj_registeredBy: userData.usr_id
            }
        })
        res.status(200).send(addProductProject);
    } catch (error) {
        console.log(error);
        res.status(500).send('We have got a problem with your request.')
    }
})

// NEW PRODUCT TO ENDPOINT
routerProjects.post('/add-product-inventory/:projectNumber', validateJWT, async (req, res) => {
    const projectNumberString = req.params.projectNumber;
    const { product, quantity } = req.body;
    const projectNumber = parseInt(req.params.projectNumber);
    const projectData = await prisma.projetos.findFirst({
        where: {
            prj_number: projectNumberString
        }
    })
    const company =  projectData?.prj_company;
    try {
       for (let index = 0; index < quantity; index++) {
         await prisma.produtos_vendidos.createMany({
            data:{
                sol_pro_product: product,
                sol_pro_project: projectNumber,
                sol_pro_company: projectData?.prj_company ? projectData?.prj_company : 9999
            }
        })
       }
        res.status(200).send({
            product,
            quantity,
            projectNumberString,
            company
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('We have got a problem with your request.')
    }
})



async function autoCreateCompanyByContact(cnpj: string) {
    const contact = await prisma.contatos.findFirst({
        where: { con_cnpj: cnpj }
    })

    const password = codeGenerator(20)
    const passwordHashed = HashMD5Generator(password)

    if (contact?.con_cnpj == cnpj) {
        console.log('achou o contato')

        const newCompany = await prisma.company.create({
            data: {
                com_identifier: codeGenerator(20),
                com_name: contact.con_nomeFantasia ? contact.con_nomeFantasia : 'Pendente',
                com_email: contact.con_email ? contact.con_email : 'Pendente',
                com_password: password,
                com_passwordCrypted: passwordHashed,
                com_logo: 'https://wetalkit.com.br/suporte/src/img/logo-preto.svg',
                com_color: '#3aafc8',
                com_platform: 1,
                com_cnpj: contact.con_cnpj,
                com_address: contact.con_endereco,
                com_phone: contact.con_telefone,
                com_about: 'Self-generated company due to a project.',
                com_sla: 1
            }
        })
        return {
            company: newCompany.com_id, 
            contact: contact.con_id
        }
    } else {
        // se não possui contato ainda pega os dados da receita
        console.log('contato ainda nao existe')

        const companyDataMP = await getCompanyDataFromReceita(cnpj);

        if ((companyDataMP) && (companyDataMP.email != 'unknown')) {
            const newCompany = await prisma.company.create({
                data: {
                    com_identifier: codeGenerator(20),
                    com_name: companyDataMP.name,
                    com_email: companyDataMP.email,
                    com_password: password,
                    com_passwordCrypted: passwordHashed,
                    com_logo: 'https://wetalkit.com.br/suporte/src/img/logo-preto.svg',
                    com_color: '#3aafc8',
                    com_platform: 1,
                    com_cnpj: companyDataMP.cnpj,
                    com_address: companyDataMP.logradouro + ' - ' + companyDataMP.municipio + ' / ' + companyDataMP.uf + '. CEP: ' + companyDataMP.cep,
                    com_phone: companyDataMP.telefone,
                    com_about: 'Self-generated company due to a project using brazilian costumes information.',
                    com_sla: 1
                }
            })
            if (!newCompany) {
                console.error('Tivemos um problema ao criar a empresa')
                return null
            }
            const newContact = await prisma.contatos.create({
                data: {
                    con_cnpj: companyDataMP.cnpj,
                    con_nomeSocial: companyDataMP.name,
                    con_capitalSocial: Number(companyDataMP.capitalSocial),
                    con_email: companyDataMP.email,
                    con_cidade: companyDataMP.municipio,
                    con_endereco: companyDataMP.logradouro + ' - ' + companyDataMP.municipio + ' / ' + companyDataMP.uf + '. CEP: ' + companyDataMP.cep,
                    con_estado: companyDataMP.uf,
                    con_situacao: companyDataMP.situacao,
                    con_telefone: companyDataMP.telefone,
                    con_nomeFantasia: companyDataMP.fantasia,
                    con_company: newCompany.com_id.toString()
                }
            })
          
            if (!newContact) {
                console.error('Tivemos um problema ao criar o contato')
                return { 
                    company: newCompany.com_id, 
                    contact: null
                }
            }
            return { 
                company: newCompany.com_id, 
                contact: newContact.con_id
            }
        }
    }
}

async function getCompanyDataFromReceita(cnpj: string) {
    console.log('caiu na busca da receita')
    const axios = require('axios');
    const apiUrl = 'https://receitaws.com.br/v1/cnpj/' + cnpj;
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        const arrayDeDados = {
            name: data.nome ? data.nome : null,
            fantasia: data.fantasia ? data.fantasia : null,
            cnpj: data.cnpj ? data.cnpj : null,
            municipio: data.municipio ? data.municipio : null,
            uf: data.uf ? data.uf : null,
            logradouro: data.logradouro ? data.logradouro : null,
            cep: data.cep ? data.cep : null,
            capitalSocial: data.capital_social ? data.capital_social : null,
            situacao: data.situacao ? data.situacao : null,
            dataSituacao: data.data_situacao ? data.situacao : null,
            telefone: data.telefone ? data.telefone : null,
            tipo: data.tipo ? data.tipo : null,
            email: data.email ? data.email : 'unknown'
        };
        // console.log('Array de dados:', arrayDeDados);
        return arrayDeDados
    } catch (erro) {
        console.error('Erro ao fazer a requisição:', erro);
        return null
    }
}

async function checkPermission(projectNumber: string, sessionUser: number, sessionUserRole: number, sessionUserCompany: number, endpoint: string) {
    const projectData = await prisma.projetos.findFirst({
        where: { prj_number: projectNumber }
    })
    // WARNING: REVER PARCEIROS VENDO PROJETOS
    if (((sessionUserCompany === 9999) && (sessionUserRole === 2)) || (sessionUserRole === 4) || (sessionUserRole === 5)) {
        // logRegister.info("Permission Granted for user: " + sessionUser + " for endpoint " + endpoint + ". User role: " + sessionUserRole + " company: " + sessionUserCompany + " project: " + projectNumber)
        return true;
    }
    if ((sessionUserCompany === projectData?.prj_company) && (sessionUserRole === 2)) {
        // logRegister.info("Permission Granted for user: " + sessionUser + " for endpoint " + endpoint + ". User role: " + sessionUserRole + " company: " + sessionUserCompany + " project: " + projectNumber)
        return true;
    }
    // logRegister.error("Permission DENIED for user: " + sessionUser + " for endpoint " + endpoint + ". User role: " + sessionUserRole + " company: " + sessionUserCompany + " project: " + projectNumber)
    return false;
}