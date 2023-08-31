import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { hash } from "bcryptjs";
import { isAfter, addHours } from 'date-fns';
import UserTokensRepository from "../typeorm/repositories/UserTokensRepository";
import { UserRepository } from "../typeorm/repositories/UserRepository";

interface IRequest {
  token: string;
  password: string;
}

class RessetPasswordService {
  public async execute({token, password}: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UserRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);
    if (!userToken) {
      throw new AppError(400, 'User Token does not exists.');
    }

    const user = await usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError(400, 'User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);
    if (isAfter(Date.now(), compareDate)) {
      throw new AppError(400, 'Token expired.');
    }

    user.password = await hash(password, 8);


  }
}

export default RessetPasswordService;
