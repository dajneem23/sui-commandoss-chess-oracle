import { MigrationInterface, QueryRunner } from "typeorm";

export class Apps1748672189734 implements MigrationInterface {
    name = 'Apps1748672189734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "federation" character varying NOT NULL, "year" integer NOT NULL, "title" character varying, "standard" integer NOT NULL, "rapid" integer, "blitz" integer, "inactive" boolean NOT NULL DEFAULT false, "sui_objectid" character varying, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "player"`);
    }

}
