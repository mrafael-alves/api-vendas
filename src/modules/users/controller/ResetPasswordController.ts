import { Request, Response } from "express";
import ResetPasswordController from "../services/ResetPasswordService";


export default class ResetPasswordService{
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;
    const resetForgotPassword = new ResetPasswordController();

    await resetForgotPassword.execute({password, token});

    return response.status(204).json();
  }

}
