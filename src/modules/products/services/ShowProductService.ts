import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import { ProductRepository } from "../typeorm/repositories/ProductRepository"
import { Product } from "../typeorm/entities/Product";

interface IRequest {
  id: string;
}

class ShowProductService {
  public async execute({id}: IRequest): Promise<Product> {

    const productsRepository = getCustomRepository(ProductRepository);
    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    return product;
  }
}

export default ShowProductService;
