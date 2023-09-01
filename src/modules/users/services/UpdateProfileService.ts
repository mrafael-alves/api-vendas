import AppError from "../../../shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { getCustomRepository } from "typeorm";
import { UserRepository } from "../typeorm/repositories/UserRepository";
import { User } from "../typeorm/entities/User";

interface IRequest {
  user_id: string,
  name: string,
  email: string,
  password?: string,
  old_password?:  string
}

class UpdateProfileService {
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UserRepository);

    const user = await usersRepository.findById(user_id);
    if (!user) {
      throw new AppError(400, 'User not found.');
    }

    const userUpdateEmail = await usersRepository.findByEmail(email);

    //verifica a existência do email atualizado no bd
    //e se o id desse email é diferente do id do usuário que solicita update
    if (userUpdateEmail && userUpdateEmail.id !== user_id) {
      throw new AppError(400, 'The email is already being used.');
    }

    //verifica foi informado senha nova e uma antiga
    if (password && !old_password) {
      throw new AppError(400, 'Old password is required.');
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if (!checkOldPassword) {
        throw new AppError(400, 'Old password does not match.');
      }

      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;

    await usersRepository.save(user);

    return user;
  }
}

export default UpdateProfileService;
