import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuthorTable1622385295450 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
	        CREATE TABLE authors
	        (
		        firstName VARCHAR(255) NOT NULL COMMENT 'Имя автора',
		        lastName  VARCHAR(255) NOT NULL COMMENT 'Фамилия автора',
		        birthDate DATETIME     NOT NULL COMMENT 'Дата рождения автора',
		        authorId  INT UNSIGNED AUTO_INCREMENT
			        PRIMARY KEY
	        );
        `);

    await queryRunner.query(`
            INSERT INTO books.authors (firstName, lastName, birthDate)
			VALUES 
			       ('John', 'Capollo', '2021-05-10 19:56:28'),
				   ('Andrew', 'Smith', '2021-05-12 19:56:28'),
				   ('Tom', 'Moore', '2021-05-12 19:56:28')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS authors;`);
  }
}
