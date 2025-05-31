import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from './src/shared/typeorm/strategies/snake-naming.strategy';

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT!,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    namingStrategy: new SnakeNamingStrategy(),
    entities: ['src/modules/**/*.entity{.ts,.js}', 'apps/**/src/modules/**/*.entity{.ts,.js}'],
    migrations: ['./migrations/*{.ts,.js}'],
} satisfies DataSourceOptions;

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
