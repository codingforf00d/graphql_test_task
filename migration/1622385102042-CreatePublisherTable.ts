import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePublisherTable1622385102042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
	        CREATE TABLE publishers
	        (
		        name        VARCHAR(255)                 NOT NULL COMMENT 'Название издателя',
		        countryId   INT UNSIGNED                 NOT NULL COMMENT 'ID страны',
		        type        SET ('0', '1') DEFAULT '0,1' NOT NULL,
		        publisherId INT UNSIGNED AUTO_INCREMENT
			        PRIMARY KEY
	        );
        `);

    await queryRunner.query(`
            INSERT INTO books.publishers (name, countryId, type) 
            VALUES ('Delta', 1, '0,1'), ('Fox', 2, '0'), ('Apollo', 1, '1')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS publisher;`);
  }
}
