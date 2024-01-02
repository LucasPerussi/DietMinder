import express from 'express';
import cors from 'cors';
import logger from 'morgan';
// import logRegister from './middlewares/logger';



import { router } from './routes/index'
import { routerUsers } from './routes/users/index'
import { routerAuth } from './routes/auth/index'
import { routerProducts } from './routes/products/index'
import { routerFitTools } from './routes/fitTools/index'
import { routerNutri } from './routes/nutritionist/index'
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
app.use('/auth', routerAuth)
app.use('/products', routerProducts)
app.use('/fitTools', routerFitTools)
app.use('/nutri', routerNutri)
