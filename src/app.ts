import express from 'express';
import cors from 'cors';
import logger from 'morgan';
// import logRegister from './middlewares/logger';



import { router } from './routes/index'
import { routerUsers } from './routes/users/index'
import { routerProjects } from './routes/projects/index'
import { routerContent } from './routes/content/index'
import { routerAuth } from './routes/auth/index'
import { routerRooms } from './routes/rooms/index'
import { routerTickets } from './routes/tickets/index'
import { routerProducts } from './routes/products/index'
// import { JWTVerifier } from './middlewares/JWTVerifier.ts'

// cria o app
export const app = express();

// ***** configuracao dos middlewares
app.use(express.json());
app.use(cors());
app.use(logger('dev'));

// Integra o endpoint na aplicacao 
app.use('/', router)
app.use('/users', routerUsers)
app.use('/projects', routerProjects)
app.use('/contents', routerContent)
app.use('/auth', routerAuth)
app.use('/rooms', routerRooms)
app.use('/tickets', routerTickets)
app.use('/products', routerProducts)
