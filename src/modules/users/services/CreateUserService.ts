import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UserRepository";
import { User } from "../typeorm/entities/User";

interface IRequest {
  name: string,
  email: string,
  password: string
}

class CreateUserService {
  public async execute({ name, email, password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UserRepository);
    const emailExists = await usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError(400, 'Email address alreary used.');
    }

    const user = usersRepository.create({
      name,
      email,
      password
    });

    await usersRepository.save(user);
    return user;
  }
}

export default CreateUserService;
