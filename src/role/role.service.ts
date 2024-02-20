import { Injectable } from '@nestjs/common';
import { EditRoleDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RoleService {

  constructor(private prisma: PrismaService) {}

  async getRoles() {
    return await this.prisma.role.findMany();
  }


  async getRole(
    roleId: number
  ) {
    const role = await this.prisma.role.findFirst({
      where: {
        id: roleId,
      }
    });

    if (!role) {
      return {
        msg: 'Role not found!'
      }
    }

    return role;
  }

  async createRole(
    dto: EditRoleDto,
  ) {
    const role = await this.prisma.role.create({
      data: {
        title:dto.title,
      },
    });

    return role;
  }

  async editRole(
    roleId: number,
    dto: EditRoleDto
  ) {
    const role = await this.prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        title: dto.title
      },
    });


    return role;
  }

}
