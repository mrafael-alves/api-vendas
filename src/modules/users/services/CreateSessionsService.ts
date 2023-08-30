import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UserRepository";
import { User } from "../typeorm/entities/User";
import { compare, hash } from "bcryptjs";

interface IRequest {
  email: string,
  password: string
}

//interface IResponse {
//  user: User
//}

class CreateSessionService {
  public async execute({ email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UserRepository);
    const user = await usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError(401, 'Email/password incorrect.');
    }

    const passwordConfirmed = await compare(password, user.password);

    if (!passwordConfirmed) {
      throw new AppError(401, 'Email/password incorrect.');
    }

    return user;
  }
}

export default CreateSessionService;
