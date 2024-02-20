import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { EditStoreDto } from './dto';
import { GetUser } from '../auth/decorator';
import { StoreService } from './store.service';
import { JwtGuard } from 'src/auth/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('store')
export class StoreController {

  constructor(private storeService: StoreService) {}

  @Get('books')
  async getBooks(
    @GetUser() user: User,
    @Body('storeId', ParseIntPipe) storeId: number,
    @Body('take', ParseIntPipe) take: number,
    @Body('page', ParseIntPipe) page: number,
    @Body('q')  q?: string,
    ) {

      const roleCheck = await this.hasRole(['Admin','Store Manager','User'], user['roles']);
      if (!roleCheck) {
        return {
          error: true,
          msg: 'Permission denied'
        }
      }

    return this.storeService.getBooks(storeId,take,((page - 1) * take),q);
  }


  @Get(':id')
  getStoreById(@Param('id', ParseIntPipe) storeId: number) {
    return this.storeService.getStore(storeId);
  }

  @Get()
  getStores(@GetUser('id') userId: number) {
    return this.storeService.getStores(userId);
  }

  @Post()
  async createStore(
    @GetUser('id') userId: number,
    @Body() dto: EditStoreDto,
    @GetUser() user: User,
    ) {

      const roleCheck = await this.hasRole(['Admin'], user['roles']);
      if (!roleCheck) {
        return {
          error: true,
          msg: 'Permission denied'
        }
      }

    return this.storeService.createStore(userId,dto);
  }

  @Patch(':id')
  editStore(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) storeId: number,
    @Body() dto: EditStoreDto,
  ) {
    return this.storeService.editStore(userId, storeId, dto);
  }

  @Post('new-book')
  async addBook(
    @Body('storeId', ParseIntPipe) storeId: number,
    @Body('bookId', ParseIntPipe) bookId: number,
    @Body('quantity', ParseIntPipe) quantity: number,
    @GetUser() user: User,
    ) {

      const roleCheck = await this.hasRole(['Admin','Store Manager','User'], user['roles']);
      if (!roleCheck) {
        return {
          error: true,
          msg: 'Permission denied'
        }
      }

    return this.storeService.addBook(storeId,bookId,quantity);
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
