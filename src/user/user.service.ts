import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { NewUserDto } from './dto/new-user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}


  async editUser(
    userId: number,
    dto: EditUserDto,
  ) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.pass;

    return user;
  }

  async assignRole(
    userId: number,
    roleId: number
  ) {
    const assign = await this.prisma.userRole.create({
      data: {
        userId: userId,
        roleId: roleId,
      },
    });

    return assign;
  }

  async revokeRole(
    userId: number,
    roleId: number
  ) {
    const revoked = await this.prisma.userRole.deleteMany({
      where: {
        userId: userId,
        roleId: roleId,
      },
    });

    return revoked;
  }

  async createUser(
    dto: NewUserDto,
    roleId?: number
  ) {

    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          pass: hash,
          firstname: dto.firstname,
          lastname: dto.lastname,
          },
      });

      if (user && roleId) {
        await this.prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: roleId,
          },
        });
      }

      return  {
        error:false,
        msg: 'User created..',
        data: user
      }

    } catch (error) {
      // console.log('Error:', error )
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'User credentials taken!',
          );
        }
      }
      throw error?.meta;
    }

  }

}
