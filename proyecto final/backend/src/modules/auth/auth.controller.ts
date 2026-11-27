import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { authService } from './auth.service';

export class AuthController {
  login = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result,
    });
  });

  register = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result,
    });
  });

  me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const user = await authService.getProfile(req.user!.sub);
    res.status(200).json({
      success: true,
      data: user,
    });
  });
}

export const authController = new AuthController();
