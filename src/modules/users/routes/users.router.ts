import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';
import UserController from '../controller/UsersController';
import UserAvatarController from '../controller/UserAvatarController';
import isAuthenticated from '@shared/http/middlewares/isAuthenticated';
import uploadConfig from '@config/upload';

const usersRouter = Router();
const usersController = new UserController();
const usersAvatarController = new UserAvatarController();

//middleware de upload
const upload = multer(uploadConfig);

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

usersRouter.patch(
  '/avatar',
  isAuthenticated,
  upload.single('avatar'),
  usersAvatarController.update

);


export default usersRouter;
