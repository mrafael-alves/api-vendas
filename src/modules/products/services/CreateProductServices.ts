import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import { ProductRepository } from "../typeorm/repositories/ProductRepository"
import { Product } from "../typeorm/entities/Product";

interface IRequest {
  name: string,
  price: number,
  quantity:number
}

class CreateProductService {
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {

    const productsRepository = getCustomRepository(ProductRepository);
    const productExists = await productsRepository.findByName(name);

    if (productExists) {
      throw new AppError(400, 'This product already exists');
    }

    const product = productsRepository.create({
      name,
      price,
      quantity
    });

    await productsRepository.save(product);
    return product;
  }
}

export default CreateProductService;
