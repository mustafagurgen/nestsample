import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { NewUserDto } from './dto/new-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch()
  editUser(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }


  @Post('assign')
  assignUser(
    @GetUser('id') userId: number,
    @Body('roleId', ParseIntPipe) roleId: number
  ) {
    return this.userService.assignRole(userId, roleId);
  }

  @Delete('revoke')
  revokeUser(
    @GetUser('id') userId: number,
    @Body('roleId', ParseIntPipe) roleId: number
  ) {
    return this.userService.revokeRole(userId, roleId);
  }

  @Post('new')
  async createUser(
    @Body() dto: NewUserDto,
    @Body('roleId', ParseIntPipe) roleId: number,
    @GetUser() user: User,
  ) {

    const roleCheck = await this.hasRole(['Admin'], user['roles']);
    if (!roleCheck) {
      return {
        error: true,
        msg: 'Permission denied'
      }
    }

    return this.userService.createUser(dto, roleId);
  }

  async hasRole(role, roles) {
    let roleCheck = false;
    for(let i = 0; i < roles.length; i++) {

      if (role.indexOf(roles[i].role.title) > -1 ) {
        roleCheck = true;
        break;
      }
    }
    return roleCheck;
  }

}
