import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import path from 'path';
import UserTokensRepository from "../typeorm/repositories/UserTokensRepository";
import { UserRepository } from "../typeorm/repositories/UserRepository";
import EtherealMail from "@config/mail/EtherealMail";

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  public async execute({email}: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UserRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const user = await usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError(400, 'User does not exists.');
    }

    const token = await userTokensRepository.generate(user.id);
    console.log(token);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    await EtherealMail.sendMail({
      to: {
        name: user.name,
        email:  user.email
      },
      subject: '[API Vendas] Password Recovery',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `http://localhost:3000/reset_password?token=${token.token}`
        }
      }
    });
  }
}

export default SendForgotPasswordEmailService;
