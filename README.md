# Задача для теста:

1. В query getBook в инпут добавить возможность фильтровки по publishersIds и categoriesIds
2. В query getAuthorsBooks добавить в ответ филдрезолвер booksCount, который выводит количество книг автора, используя dataloader
3. В query getBooksFromCategory добавить филдрезолвер books, который выводит список книг для категории, используя dataloader

# Для запуска требуется докер (на нем вертится база данных) и yarn (для установки зависимостей)

# Далее для запуска проекта:

docker-compose up --build -d (поднятие докера)\
yarn install (установка зависимостей)\
yarn typeorm migration:run (запуск миграций для наполнения БД)\
yarn start (старт бэка)\
\
Сервер запустится на http://localhost:28080\
\
После написания новых entities необходимо запустить генерацию новых миграций (в старые залезать категорически запрещено):\
yarn typeorm migration:generate -n "Название миграции"

# Список уже существующих кверей и мутаций:

```
mutation createCountry {
  saveCountry(input: { name: "USA" }) {
    countryId
  }
}
```

```
mutation createCategory {
  saveCategory(input: {name: "Detective" }) {
    categoryId
  }
}
```

```
mutation createPublisher {
  savePublisher(input: {name: "Rose", countryId: 1, type: PRINTED }) {
    publisherId
  }
}
```

```
mutation createAuthor {
  saveAuthor(input: { firstName: "John", lastName: "Doe", birthDate: "1982-05-10" }) {
    authorId
  }
}
```

```
mutation createBook {
  saveBook(input: { authorId: 1, publisherId: 1, name: "Exodus 2", pageCount: 666, categoryId: 1 }) {
    bookId
  }
}
```

```
fragment bookInfo on GqBook {
  name,
  pageCount,

  category {
    name
  },
  publisher {
    name,
    country {
      name
    }
  },
}

query getBook {
  books(input: { booksIds: [1, 2] }) {
    ...bookInfo,
    author {
      firstName,
      lastName,
      birthDate
    }
  }
}
```

```
query getAuthorsBooks {
  author(input: { authorsIds: [1] }) {
    authorId
    firstName
    lastName
    books {
      name,
      pageCount,
      category {
        name
      },
      publisher {
        name,
        country {
            name
        }
      },
    }
  }
}
```

```
query getPublishersBooks {
  publisher(input: { publishersIds: [11] }) {
    books {
      ...bookInfo,
      author {
        firstName,
        lastName,
        birthDate
      }
    }
  }
}
```

```
fragment bookInfoWithAuthor on GqBook {
  ...bookInfo,
  author {
    firstName,
    lastName,
    birthDate
  }
}

query getBooksFromCategory {
  category(input: { categoriesIds: 1 }) {
    name,
    books {
      ...bookInfoWithAuthor
    }
  }
}
```

```
query getPublishers {
  publisher(input: { publishersIds: [2] }) {
    name,
    country {
      name
    }
  }
}
```

```
mutation deleteBook {
  dropBook(input: {booksIds: [3]}) {
    bookId
  }
}
```

# Библиотеки

Их нужно знать:

- `typeorm` - ORM
  - работа с репозиторием (не active record),
  - работа с "QueryBuilder"
  - работа с миграциями
- `tsyringe` - DI
- `type-graphql` - GraphQl
  - Resolver
  - FieldResolver
  - ObjectType
  - ObjectInput
  - Args
- `dataloader` - fix graphql problem N+1
- `pm2` - runner
- `nodemon` - dev runner
- `config` - configuration (nmp config)
  - default.ts
  - local.ts
- `yarn workspaces` - monorepo

# Соглашения по именованию методов

- add\* - добавить связь (без создания новой сущности)\
  Неправильно: link
- remove\* - удалить связь (без удаления сущности)\
  Неправильно: unlink
- save\* - создать, обновить сущность\
  Неправильно: add, create, update, change.
- drop\* - удалить сущность\
  Неправильно: delete, remove.
- findBy, findGoodBy, findOneGoodBy - поиск любой сущности по любым параметрам\
  Неправильно: findAbcForCdeWithFgh, getValueFromDbAndSaveToBrain
  Если метод бросает ошибку в случае не найденой сущности, назавние должно начинаться с get
- Обозначение списка сущностей.\
  goodId - один айди\
  goodsIds - список айдишников\
  Неправильно: goodIds, goodsId, id, ids.

# Имена файлов

Имена файлов записываются через тире с маленькой буквы. Допускается использовать точки для категорий например `some.entity.ts` \
Кодировка utf-8. \
Не верно: ConsignorsReadme.txt \
Верно: consignors-readme.txt

# Abstract Query Builder

Используется как абстрактный класс для имплементации queryBuilder-a отдельно взятой сущности. Содержит реализацию следующих методов для использования в унаследованных QueryBuilder-ах и упрощения работы с ORM:

```
// Join вида LEFT/INNER с кешированием
// повторный JOIN такого же типа с тем же alias не вызовет генерацию SQL
public joinAndSelect<E extends EntityWithName>(
    field: keyof Entity,
    entity: E,
    alias?: string,
    joinType: JoinType = JoinType.LEFT,
)
```
