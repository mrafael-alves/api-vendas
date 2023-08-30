import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UserRepository";
import { User } from "../typeorm/entities/User";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import authConfig from '@config/auth';

interface IRequest {
  email: string,
  password: string
}

interface IResponse {
  user: User,
  token: string
}

//interface IResponse {
//  user: User
//}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UserRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, 'Email/password incorrect.');
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError(401, 'Email/password incorrect.');
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn
    });

    return {
      user,
      token
    };
  }
}

export default CreateSessionService;
