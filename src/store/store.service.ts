import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditStoreDto } from './dto';

@Injectable()
export class StoreService {

  constructor(private prisma: PrismaService) {}

  async getStores(userId?: number) {
    if (userId) {
      return await this.prisma.store.findMany({
        where: {
          userId: userId
        }
      });
    }
    return await this.prisma.store.findMany();
  }

  async getStore(
    storeId: number
  ) {
    const store = await this.prisma.store.findFirst({
      where: {
        id: storeId,
      }
    });

    if (!store) {
      return {
        msg: 'Store not found!'
      }
    }

    return store;
  }

  async createStore(
    userId: number,
    dto: EditStoreDto,
  ) {
    const store = await this.prisma.store.create({
      data: {
        storeTitle:dto.storeTitle,
        storeDescription:dto.storeDescription,
        storeLink:dto.storeLink,
        userId:userId,
      },
    });

    return store;
  }
  async editStore(
    userId: number,
    storeId: number,
    dto: EditStoreDto
  ) {
    const store = await this.prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        storeTitle:dto.storeTitle,
        storeDescription:dto.storeDescription,
        storeLink:dto.storeLink,

      },
    });

    return store;
  }

  async addBook(
    storeId:number,
    bookId: number,
    quantity: number
   ) {
    const store = await this.prisma.storeBookRelation.create({
      data: {
        bookId: bookId,
        storeId: storeId,
        quantity: quantity
      }
    });

    return store;
  }

  async getBooks(
    storeId: number,
    take: number,
    page: number,
    q?: string
   ) {

    const books = await this.prisma.book.findMany({
      take: take,
      skip: page,
      orderBy: {id: 'desc'},
      where: {
        NOT:{
          bookRel: undefined
        },
        ...(q) ? {bookTitle: {contains: q}} : undefined,
      },
      select: {
        id: true,
        bookTitle: true,
        bookDescription: true,
        bookAuthor: true,
        bookPublisher: true,
        bookRel: {
          where: {
            storeId: storeId,
          }
        }
      }

    });

    return books;
  }


}
