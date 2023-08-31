import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import ForgotPasswordController from '../controller/ForgotPasswordController';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();

/** http://localhost:3333/password/forgot */
passwordRouter.post(
  '/forgot',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().required()
    }
  }),
  forgotPasswordController.create
);

/** http://localhost:3333/password/resset */


export default passwordRouter;
