import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";

@InputType({ isAbstract: true })
@ObjectType({ isAbstract: true })
export class CountryFields {
  @Field({
    description: "Название страны",
  })
  @Column("varchar", {
    comment: "Название страны",
  })
  name: string;
}

@Entity({ name: "country" })
@ObjectType({ isAbstract: true })
export class CountryEntity extends CountryFields {
  @Field(() => ID, {
    description: "Id страны",
  })
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  countryId: number;
}
