import { registerEnumType } from "type-graphql";

export enum BookType {
  ELECTRONIC,
  PRINTED,
}

registerEnumType(BookType, {
  name: "GqBookType",
  description: "Тип книги",
});
