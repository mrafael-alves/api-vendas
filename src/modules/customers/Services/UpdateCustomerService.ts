import AppError from "../../../shared/errors/AppError";
import { compare, hash } from "bcryptjs";
import { getCustomRepository } from "typeorm";
import Customer from "../typeorm/entities/Customer";
import { CustomersRepository } from "../typeorm/repositories/CustomerRepository";

interface IRequest {
  id: string,
  name: string,
  email: string
}

class UpdateCustomerService {
  public async execute({
    id,
    name,
    email
  }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);

    const customer = await customersRepository.findById(id);
    if (!customer) {
      throw new AppError(400, 'Customer not found.');
    }

    const customerExists = await customersRepository.findByEmail(email);

    //verifica a existência do novo email no bd
    //e se esse email é diferente do email do customer que solicita update
    if (customerExists && email !== customer.email) {
      throw new AppError(400, 'The email is already being used.');
    }

    customer.name = name;
    customer.email = email;

    await customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
