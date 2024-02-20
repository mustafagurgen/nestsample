import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditBookDto } from './dto';

@Injectable()
export class BookService {

  constructor(private prisma: PrismaService) {}

  async getBooks(dto:any, userId?: number) {
    // const storeRel = await this.prisma.storeBookRelation.findMany({
    //   where: {
    //     storeId: storeId
    //   }
    // });

    // if (!storeRel) {
    //   return {
    //     msg: 'No store related record found!'
    //   }
    // }

    if (userId) {
      return await this.prisma.book.findMany({
        where: {
          userId: userId,
          // id: {
          //   in: storeRel.map(b => b.bookId)
          // },
        }
      });
    }
    return await this.prisma.book.findMany({});
  }

  async getBook(
    bookId: number
  ) {
    const book = await this.prisma.book.findFirst({
      where: {
        id: bookId,
      }
    });

    if (!book) {
      return {
        msg: 'Book not found!'
      }
    }

    return book;
  }

  async createBook(
    userId: number,
    dto: EditBookDto,
  ) {
    const book = await this.prisma.book.create({
      data: {
        bookTitle:dto.bookTitle,
        bookDescription:dto.bookDescription,
        bookAuthor:dto.bookAuthor,
        bookPublisher:dto.bookPublisher,
        userId:userId,
      },
    });

    return book;
  }

  async editBook(
    userId: number,
    bookId: number,
    dto: EditBookDto
  ) {
    try {
      const book = await this.prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          bookTitle:dto.bookTitle,
          bookDescription:dto.bookDescription,
          bookAuthor:dto.bookAuthor,
          bookPublisher:dto.bookPublisher,
        },
      });

      return book;

    } catch (error) {
      return error?.meta
    }
  }


}
