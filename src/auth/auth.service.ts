import { ForbiddenException, Injectable, Req } from '@nestjs/common';
import { AuthDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService
    ) {}

  async signup(dto: AuthDto) {

    try {
      const hash = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          pass: hash
        },
      });

      return  {
        msg: 'I am signed up',
        data: user
      }

    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'Credentials taken',
          );
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user =
      await this.prisma.user.findUnique({
        include: {
          roles: {
            include: {
              role:true
            }
          }
        },
        where: {
          email: dto.email,
        },
      });
      console.log('User :>> ', user);
    // if user does not exist throw exception
    if (!user)
      throw new ForbiddenException(
        'Credentials incorrect',
      );

    // compare password
    const pwMatches = await argon.verify(
      user.pass,
      dto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches)
      throw new ForbiddenException(
        'Credentials incorrect',
      );
    return this.signToken(user.id, user.email, user.roles);
  }

  async signToken(
    userId: number,
    email: string,
    roles: any
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      roles: roles,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: '59m',
        secret: secret,
      },
    );

    return {
      access_token: token,
    };
  }

}
