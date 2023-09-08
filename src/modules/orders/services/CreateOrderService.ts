import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Order from "../typeorm/entities/Order";
import OrdersRepository from "../typeorm/repositories/OrdersRepository";
import { CustomersRepository } from "@modules/customers/typeorm/repositories/CustomerRepository";
import ProductsRepository from "@modules/products/typeorm/repositories/ProductRepository";


interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {

    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productsRepository = getCustomRepository(ProductsRepository);

    //Busca cliente
    const customerExists = await customersRepository.findById(customer_id);

    console.log(customerExists);
    if (!customerExists) {
      throw new AppError(400, 'Could not find any customer with the given id.');
    }

    //Busca produtos
    const existsProducts = await productsRepository.findAllByIds(products);
    if (!existsProducts.length) {
      throw new AppError(400, 'Could not find any products with the given ids.');
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id)
    );
    if (checkInexistentProducts.length) {
      throw new AppError(400, `Could not find product ${checkInexistentProducts[0].id}`);
    }

    //Busca quantidade do produto no estoque
    const quantityAvailable = products.filter(
      product => existsProducts.filter(
        p => p.id === product.id)[0].quantity < product.quantity
    );
    if (quantityAvailable.length) {
      throw new AppError(400,
        `The quantity ${quantityAvailable[0].quantity}
        is not available for ${quantityAvailable[0].id}.`);
    }

    //Monta pedido
    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price
    }));


    //console.log(customerExists);
    //console.log(serializedProducts);
    const order = await ordersRepository.createOrder({
      customer: customerExists,
      products: serializedProducts
    });
    //console.log(order);

    //Atualiza estoque no banco de dados
    const { order_products } = order;
    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        existsProducts.filter(p => p.id === product.product_id)[0].quantity - product.quantity
    }));

    await productsRepository.save(updatedProductQuantity);

    return order;
  }

}

export default CreateOrderService;
