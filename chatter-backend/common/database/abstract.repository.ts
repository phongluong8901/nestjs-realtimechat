import { Logger, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { AbstractEntity } from './abstract.entity';

type FilterQuery<T> = {
  [P in keyof T]?: any;
} & { [key: string]: any };

type UpdateQuery<T> = {
  $set?: Partial<T>;
  $push?: any;
  $pull?: any;
} & { [key: string]: any };

export abstract class AbstractRepository<T extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<T>) {}

  async create(document: Omit<T, '_id'>): Promise<T> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as unknown as T;
  }

  async findOne(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model.findOne(filterQuery as any).lean<T>(true);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document as T;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T> {
    const document = (await this.model.findOneAndUpdate(
      filterQuery as any,
      update as any,
      {
        new: true,
        lean: true,
      },
    )) as T;

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  async find(filterQuery: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filterQuery as any).lean<T[]>(true);
  }

  async findOneAndDelete(filterQuery: FilterQuery<T>): Promise<T> {
    const document = await this.model
      .findOneAndDelete(filterQuery as any)
      .lean<T>(true);

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found');
    }
    return document as T;
  }
}
