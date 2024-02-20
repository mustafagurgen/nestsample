import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { BookService } from './book.service';
import { GetUser } from 'src/auth/decorator';
import { EditBookDto } from './dto';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)

@Controller('book')
export class BookController {

  constructor(private bookService: BookService) {}


  @Get(':id')
  getBookById(@Param('id', ParseIntPipe) bookId: number) {
    return this.bookService.getBook(bookId);
  }

  @Get()
  async getBooks(
    @GetUser() user: User,
    @Body() dto: any,
    @GetUser('id') userId?: number,
  ) {

      const roleCheck = await this.hasRole(['User','Admin'], user['roles']);
      if (!roleCheck) {
        return {
          error: true,
          msg: 'Permission denied'
        }
      }
    return this.bookService.getBooks(dto, userId);
  }

  @Post()
  async createBook(
    @GetUser('id') userId: number,
    @Body() dto: EditBookDto,
    @GetUser() user: User,
    ) {

      const roleCheck = await this.hasRole(['Admin'], user['roles']);
      if (!roleCheck) {
        return {
          error: true,
          msg: 'Permission denied'
        }
      }

    return this.bookService.createBook(userId,dto);
  }

  @Patch(':id')
  editBook(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) bookId: number,
    @Body() dto: EditBookDto,
  ) {
    return this.bookService.editBook(userId, bookId, dto);
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
