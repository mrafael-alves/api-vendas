import { Router } from 'express';
import productsRouter from '@modules/products/routes/products.routes';
import usersRouter from '@modules/users/routes/users.router';
import sessionsRouter from '@modules/users/routes/sessions.router';
import passwordRouter from '@modules/users/routes/password.router';
import profileRouter from '@modules/users/routes/profile.router';


const routes = Router();

routes.use('/products', productsRouter);
routes.use('/users', usersRouter);
routes.use('/sessions', sessionsRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);

export default routes;
