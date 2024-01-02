import { Router } from 'express';
import { PrismaClient } from '@prisma/client'
import { validateJWT, extractUserDataFromToken } from '../../middlewares/JWTVerifier';

const prisma = new PrismaClient()


export const routerUsers = Router()

routerUsers.get('/', (req, res) => res.send('API de usuários'))

routerUsers.patch('/complete', validateJWT, async (req, res) => {
    const { height, weight, picture, phone, city } = req.body;

    const userData = await extractUserDataFromToken(req, res);
    if (!userData || !('usr_id' in userData)) {
        console.log('Invalid session data');
        return res.status(401).json({ message: 'Invalid session data' });
    }
    const getUser = await prisma.user.findFirst({
        where: {
            usr_id: userData.usr_id
        }
    })

    let pictureValue = "https://i.imgur.com/N9c1ah6.png";
    let phoneValue = "unset";
    let cityValue = "unset";
    if (picture != "keep"){pictureValue = picture;};
    if (phone != ""){phoneValue = phone;};
    if (picture != ""){cityValue = city;};

    const updateUser = await prisma.user.update({
        where: {
            usr_id: userData.usr_id
        },
        data: {
            usr_phone: phoneValue,
            usr_city: cityValue,
            usr_height: height,
            usr_weight: weight,
            usr_picture: pictureValue,
        }
    })

    res.status(200).send(updateUser)
    
});


// NUTRI SIDE

routerUsers.post('/nutritionist/new', validateJWT, async (req, res) => {
    const { user, crn, address, logo, stamp } = req.body;
    
    const alreadyNutri = await checkIfAlreadyNutri(parseInt(user));

    if (alreadyNutri){
        return res.status(500).send("User already is a nutritionist!")
    }

    const getUser = await prisma.user.findFirst({
        where: {
            usr_id: user
        }
    })

    let stampValue = "https://static.wixstatic.com/media/ac5909_c61e54399a8b493c8d2039998c356f96~mv2.png/v1/fill/w_321,h_233,al_c/ac5909_c61e54399a8b493c8d2039998c356f96~mv2.png";
    let logoValue = "unset";
    if (stamp != ""){stampValue = stamp;};
    if (logo != ""){logoValue = logo;};

    try {
        const newNutri = await prisma.nutritionists.create({
            data: {
                ntr_address: address,
                ntr_crn: crn,
                ntr_logo: logoValue,
                ntr_stamp: stampValue,
                ntr_user: user
            }
        });
    
        if (newNutri) {
            // Assuming 'prisma.user.update' returns the updated user
            const updateUserNutriRole = await prisma.user.update({
                where: {
                    usr_id: user
                },
                data: {
                    usr_role: 2,
                }
            });
    
            // Assuming 'prisma.user.findUnique' returns the user based on the 'user' ID
            const getUser = await prisma.user.findUnique({
                where: {
                    usr_id: user
                }
            });
    
            res.status(200).json([{
                id: newNutri.ntr_id,
                address: newNutri.ntr_address,
                crn: newNutri.ntr_crn,
                logo: newNutri.ntr_logo,
                stamp: newNutri.ntr_stamp,
                user: getUser,
                created: newNutri.ntr_date
            }]);
        } else {
            res.status(500).json({ error: "Failed to create a new nutritionist." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
    
});

routerUsers.get('/nutri/user/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    try {
        const nutri = await prisma.nutritionists.findFirst({
            where: {
                ntr_user: user
            }
        });
        const loadUser = await prisma.user.findFirst({
            where: {
                usr_id: nutri?.ntr_user
            }
        })

        res.status(200).json({
            id: nutri?.ntr_id,
            crn: nutri?.ntr_crn,
            address: nutri?.ntr_address,
            logo: nutri?.ntr_logo,
            stamp: nutri?.ntr_stamp,
            user: loadUser,
            created: nutri?.ntr_date,
         });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/nutri/:nutriId', validateJWT, async (req, res) => {
    const nutriId = parseInt(req.params.nutriId);

    try {
        const nutri = await prisma.nutritionists.findFirst({
            where: {
                ntr_id: nutriId
            }
        });

        const loadUser = await prisma.user.findFirst({
            where: {
                usr_id: nutri?.ntr_user
            }
        })

        res.status(200).json({
            id: nutri?.ntr_id,
            crn: nutri?.ntr_crn,
            address: nutri?.ntr_address,
            logo: nutri?.ntr_logo,
            stamp: nutri?.ntr_stamp,
            user: loadUser,
            created: nutri?.ntr_date,
         });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/all-nutritionists', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);
    try {
        const users = await prisma.user.findMany({
            where: {
                usr_role: 2
            }
        });
        res.status(200).json({users });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})



// PATIENTS SIDE 
routerUsers.post('/patient/new', validateJWT, async (req, res) => {
    const { user,  nutritionist, athlete } = req.body;
    
    const alreadyPatient = await checkIfAlreadyPatient(parseInt(user));

    if (alreadyPatient){
        return res.status(500).send("User already is a patient!")
    }

    const getUser = await prisma.user.findFirst({
        where: {
            usr_id: user
        }
    })


    try {
        const newPatient = await prisma.patients.create({
            data: {
                pac_athlete: athlete,
                pac_nutri: nutritionist,
                pac_user: user
            }
        });
    
        if (newPatient) {
            // Assuming 'prisma.user.update' returns the updated user
    
            // Assuming 'prisma.user.findUnique' returns the user based on the 'user' ID
            const getUser = await prisma.user.findUnique({
                where: {
                    usr_id: user
                }
            });
    
            res.status(200).json([{
                id: newPatient.pac_id,
                athlete: newPatient.pac_athlete,
                nutritionist: newPatient.pac_nutri,
                getUser,
                created: newPatient.pac_linking_date
                }]);
        } else {
            res.status(500).json({ error: "Failed to create a new nutritionist." });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
    
});

routerUsers.get('/patient/:id', validateJWT, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const patient = await prisma.patients.findFirst({
            where: {
                pac_id: id
            }
        });
        if (patient){
            const loadUser = await prisma.user.findFirst({
                where: {
                    usr_id: patient?.pac_user
                }
            })
    
            return res.status(200).json({
                id: patient?.pac_id,
                athlete: patient?.pac_athlete,
                nutritionist: patient?.pac_nutri,
                user: loadUser,
                linkingDate: patient?.pac_linking_date
            });
        }
        return res.status(404).send("Patient doesn't exist!")


    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/patient/user/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    try {
        const patient = await prisma.patients.findFirst({
            where: {
                pac_user: user
            }
        });
        if (patient){
            const loadUser = await prisma.user.findFirst({
                where: {
                    usr_id: patient?.pac_user
                }
            })
    
            return res.status(200).json({
                id: patient?.pac_id,
                athlete: patient?.pac_athlete,
                nutritionist: patient?.pac_nutri,
                user: loadUser,
                linkingDate: patient?.pac_linking_date
            });
        }
        return res.status(404).send("Patient doesn't exist!")


    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/all-patients', validateJWT, async (req, res) => {
    try {
        const patients = await prisma.patients.findMany();
        res.status(200).json({patients });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})









// LISTS

routerUsers.get('/get/:user', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);

    try {
        const users = await prisma.user.findFirst({
            where: {
                usr_id: user
            }
        });
        res.status(200).json({users });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/all-members', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);
    try {
        const users = await prisma.user.findMany({
            where: {
                usr_role: 1
            }
        });
        res.status(200).json({users });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/all-admins', validateJWT, async (req, res) => {
    const user = parseInt(req.params.user);
    try {
        const users = await prisma.user.findMany({
            where: {
                usr_role: 9
            }
        });
        res.status(200).json({users });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})

routerUsers.get('/all', validateJWT, async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json({users });
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'We had an internal error looking for your data.'})
    }
})


async function checkIfAlreadyPatient(user:number){
    const verifyNutri = await prisma.patients.findFirst({
        where: {
            pac_user: user
        }
    })

    if(verifyNutri){
        return true;
    } 
    return false;
}

async function checkIfAlreadyNutri(user:number){
    const verifyNutri = await prisma.nutritionists.findFirst({
        where: {
            ntr_user: user
        }
    })

    if(verifyNutri){
        return true;
    } 
    return false;
}