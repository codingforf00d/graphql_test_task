import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountryTable1622384469893 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
	        CREATE TABLE country
	        (
		        name      VARCHAR(255) NOT NULL COMMENT 'Название страны',
		        countryId INT UNSIGNED AUTO_INCREMENT
			        PRIMARY KEY
	        );
        `);

    await queryRunner.query(
      `INSERT INTO books.country (name) VALUES ('Russia'), ('USA'), ('Italy')`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS country;`);
  }
}
