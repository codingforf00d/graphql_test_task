import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { BookEntity } from "./book.entity";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class CategoryFields {
  @Field({
    description: "Название категории",
  })
  @Column("varchar", {
    comment: "Название категории",
  })
  name: string;
}

@Entity({ name: "category" })
@ObjectType({ isAbstract: true })
export class CategoryEntity extends CategoryFields {
  @Field(() => ID, {
    description: "Id категории",
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  categoryId: number;

  @OneToMany(() => BookEntity, (books) => books.category)
  books?: BookEntity[];
}
