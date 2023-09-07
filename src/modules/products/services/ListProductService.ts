import { getCustomRepository } from "typeorm"
import ProductsRepository from "../typeorm/repositories/ProductRepository";
import { Product } from "../typeorm/entities/Product";


class ListProductService {
  public async execute(): Promise<Product[]> {
    const productsRepository = getCustomRepository(ProductsRepository);

    const products = await productsRepository.find();

    return products;
  }
}

export default ListProductService;
