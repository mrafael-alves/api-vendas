import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import UserController from '../controller/UsersController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';

const usersRouter = Router();
const usersController = new UserController();

usersRouter.get('/', isAuthenticated, usersController.index);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  }),
  usersController.create
);

usersRouter.delete(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required()
    }
  }),
  usersController.delete
);


export default usersRouter;
