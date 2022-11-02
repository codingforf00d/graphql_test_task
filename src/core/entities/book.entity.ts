import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  DeleteDateColumn,
} from "typeorm";
import { ObjectType, Field, ID, Int, InputType } from "type-graphql";
import { AuthorEntity } from "./author.entity";
import { CategoryEntity } from "./category.entity";
import { PublisherEntity } from "./publisher.entity";
import { BookType } from "../types/book.types";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class BookFields {
  @Field({
    description: "Имя книги",
  })
  @Column("varchar", {
    comment: "Имя книги",
  })
  name: string;

  @Field(() => Int, {
    description: "Количество страниц",
  })
  @Column("int", {
    unsigned: true,
    comment: "Количество страниц",
  })
  pageCount: number;

  @Field(() => ID, {
    description: "ID автора",
  })
  @Column("int", {
    unsigned: true,
    comment: "ID автора",
  })
  authorId: number;

  @Field(() => ID, {
    description: "ID категории",
  })
  @Column("int", {
    unsigned: true,
    comment: "ID категории",
  })
  categoryId: number;

  @Field(() => BookType, {
    description: "Тип книги",
    nullable: true,
  })
  @Column({
    type: "enum",
    enum: BookType,
    default: BookType.PRINTED,
  })
  type: BookType;

  @Field(() => ID, {
    description: "ID издателя",
  })
  @Column("int", {
    unsigned: true,
    comment: "ID издателя",
  })
  publisherId: number;
}

@Entity({ name: "books" })
@ObjectType({ isAbstract: true })
export class BookEntity extends BookFields {
  @Field(() => ID, {
    description: "Id книги",
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  bookId: number;

  @ManyToOne(() => AuthorEntity)
  @JoinColumn({
    name: "authorId",
  })
  author: AuthorEntity;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({
    name: "categoryId",
  })
  category: CategoryEntity;

  @ManyToMany(() => PublisherEntity)
  @JoinColumn({
    name: "publisherId",
  })
  publisher: PublisherEntity;

  @DeleteDateColumn()
  deletedAt?: Date;
}
