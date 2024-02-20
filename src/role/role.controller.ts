import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { EditRoleDto } from './dto';

import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('role')
export class RoleController {

  constructor(private roleService: RoleService) {}
  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) roleId: number) {
    return this.roleService.getRole(roleId);
  }

  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @Post()
  createRole(
    @Body() dto: EditRoleDto,
  ) {
    return this.roleService.createRole(dto);
  }

  @Patch(':id')
  editRole(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() dto: EditRoleDto
  ) {
    return this.roleService.editRole(roleId,dto);
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
