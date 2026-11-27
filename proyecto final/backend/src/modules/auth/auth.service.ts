import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/environment';
import { ApiError } from '../../shared/exceptions/ApiError';
import { AuthResponseDTO, AuthUserDTO } from './auth.entity';
import { authRepository } from './auth.repository';
import { LoginInput, RegisterInput } from './auth.validation';

function mapUserToDTO(user: {
  id: string;
  email: string;
  fullName: string;
  userRoles: { role: { name: string } }[];
}): AuthUserDTO {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    roles: user.userRoles.map((ur) => ur.role.name),
  };
}

export class AuthService {
  async login(input: LoginInput): Promise<AuthResponseDTO> {
    const user = await authRepository.findUserByEmail(input.email);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Credenciales inválidas');
    }

    const userDto = mapUserToDTO(user);
    const token = jwt.sign(
      { sub: userDto.id, email: userDto.email, roles: userDto.roles },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] },
    );

    return { token, user: userDto };
  }

  async register(input: RegisterInput): Promise<AuthResponseDTO> {
    const existing = await authRepository.findUserByEmail(input.email);
    if (existing) {
      throw ApiError.conflict('El correo electrónico ya está registrado');
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const created = await authRepository.createUserWithRole({
      email: input.email,
      fullName: input.fullName,
      passwordHash,
      roleName: 'BUYER',
    });

    const userDto = mapUserToDTO(created);
    const token = jwt.sign(
      { sub: userDto.id, email: userDto.email, roles: userDto.roles },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] },
    );

    return { token, user: userDto };
  }

  async getProfile(userId: string): Promise<AuthUserDTO> {
    const user = await authRepository.findUserById(userId);
    if (!user || !user.isActive) {
      throw ApiError.notFound('Usuario no encontrado');
    }
    return mapUserToDTO(user);
  }
}

export const authService = new AuthService();
