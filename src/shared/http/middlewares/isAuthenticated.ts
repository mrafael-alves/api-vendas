import AppError from "@shared/errors/AppError";
import { verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import authConfig from '@config/auth';

interface ITokenPayload {
  iat: number,
  exp: number,
  sub: string
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError(400, 'JWT Token is missing.');
  }

  //formato do authHeader: "Bearer asdiuashdiuashdiuahsdsudih"
  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);
    //onsole.log(decodedToken);

    const { sub } = decodedToken as ITokenPayload;

    request.user = {
      id: sub,

    }


    return next();
  } catch {
    throw new AppError(400, 'Invalid JWT Token.');
  }
}
