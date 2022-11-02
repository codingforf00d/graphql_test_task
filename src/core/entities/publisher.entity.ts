import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { CountryEntity } from "./country.entity";
import { BookType } from "../types/book.types";
import { BookEntity } from "./book.entity";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class PublisherFields {
  @Field({
    description: "Название издателя",
  })
  @Column("varchar", {
    comment: "Название издателя",
  })
  name: string;

  @Field(() => ID, {
    description: "ID страны",
  })
  @Column("int", {
    unsigned: true,
    comment: "ID страны",
  })
  countryId: number;

  @Field(() => BookType, {
    description: "Тип издаваемых книг",
    nullable: true,
  })
  @Column({
    type: "set",
    enum: BookType,
    default: [BookType.ELECTRONIC, BookType.PRINTED],
  })
  type: BookType[];
}

@Entity({ name: "publishers" })
@ObjectType({ isAbstract: true })
export class PublisherEntity extends PublisherFields {
  @Field(() => ID, {
    description: "Id издателя",
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  publisherId: number;

  @ManyToMany(() => CountryEntity)
  @JoinColumn({
    name: "countryId",
  })
  country: CountryEntity;

  @OneToMany(() => BookEntity, (books) => books.publisher)
  books?: BookEntity[];
}
