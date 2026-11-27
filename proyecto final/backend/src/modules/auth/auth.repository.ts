import { prisma } from '../../config/database';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async createUserWithRole(data: {
    email: string;
    fullName: string;
    passwordHash: string;
    roleName: string;
  }) {
    const role = await prisma.role.upsert({
      where: { name: data.roleName },
      update: {},
      create: { name: data.roleName, description: `Rol ${data.roleName}` },
    });

    return prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        userRoles: {
          create: {
            roleId: role.id,
          },
        },
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
  }
}

export const authRepository = new AuthRepository();
