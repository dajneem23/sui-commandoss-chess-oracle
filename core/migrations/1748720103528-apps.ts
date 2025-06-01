import { MigrationInterface, QueryRunner } from "typeorm";

export class Apps1748720103528 implements MigrationInterface {
    name = 'Apps1748720103528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9d6f8ce5c728fe47c53737a4df" ON "player" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d72b87d3994458eb2a1f5bbc2" ON "player" ("updated_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_c12e279c5a1841ead22925a40b" ON "game" ("created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad6a76db375612c1ed082b8e18" ON "game" ("updated_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ad6a76db375612c1ed082b8e18"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c12e279c5a1841ead22925a40b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d72b87d3994458eb2a1f5bbc2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d6f8ce5c728fe47c53737a4df"`);
    }

}
