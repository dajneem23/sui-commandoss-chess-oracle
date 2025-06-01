import { MigrationInterface, QueryRunner } from "typeorm";

export class Apps1748719627808 implements MigrationInterface {
    name = 'Apps1748719627808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "li_chess_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "UQ_54ce56b718508405dace6a64b19" UNIQUE ("li_chess_id")`);
        await queryRunner.query(`CREATE INDEX "idx_game_lichess_id" ON "game" ("li_chess_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."idx_game_lichess_id"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "UQ_54ce56b718508405dace6a64b19"`);
        await queryRunner.query(`ALTER TABLE "game" ALTER COLUMN "li_chess_id" DROP NOT NULL`);
    }

}
