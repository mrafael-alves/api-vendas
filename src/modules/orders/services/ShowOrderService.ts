import AppError from "@shared/errors/AppError";
import { getCustomRepository } from "typeorm";
import Order from "../typeorm/entities/Order";
import { OrdersRepository } from "../typeorm/repositories/OrdersRepository";

interface IRequest {
  id: string;
}

class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order> {

    const ordersRepository = getCustomRepository(OrdersRepository);

    //Busca pedido
    const order = await ordersRepository.findById(id);
    if (!order) {
      throw new AppError(400, 'Order not found.');
    }

    return order;
  }
}

export default ShowOrderService;
