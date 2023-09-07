import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm"
import ProductsRepository from "../typeorm/repositories/ProductRepository";
import { Product } from "../typeorm/entities/Product";



interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({id, name, price, quantity}: IRequest): Promise<Product> {

    const productsRepository = getCustomRepository(ProductsRepository);
    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError(404, 'Product not found.');
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && name !== product.name) {
      throw new AppError(400, 'This product already exists');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product)

    return product;
  }
}

export default UpdateProductService;
