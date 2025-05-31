import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { AppConfig } from '../../app.config';
import { ISwaggerConfigInterface } from '../../interfaces/swagger-config.interface';
import { SnakeNamingStrategy } from '../typeorm/strategies/snake-naming.strategy';
import { MongooseModuleAsyncOptions, MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import * as Bull from 'bullmq';

export class ConfigService {
    constructor() {
        dotenv.config({
            path: '.env',
        });

        // Replace \\n with \n to support multiline strings in AWS
        for (const envName of Object.keys(process.env)) {
            process.env[envName] = process.env[envName]?.replace(/\\n/g, '\n');
        }
        if (this.nodeEnv === 'development') {
            console.info(process.env);
        }
    }

    public get(key: string): string {
        return process.env[key]!;
    }

    public getNumber(key: string): number {
        return Number(this.get(key));
    }

    get nodeEnv(): string {
        return this.get('NODE_ENV') || 'development';
    }

    get swaggerConfig(): ISwaggerConfigInterface {
        return {
            path: this.get('SWAGGER_PATH') || '/api/docs',
            title: this.get('SWAGGER_TITLE') || 'Demo Microservice API',
            description: this.get('SWAGGER_DESCRIPTION'),
            version: this.get('SWAGGER_VERSION') || '0.0.1',
            scheme: this.get('SWAGGER_SCHEME') === 'https' ? 'https' : 'http',
        };
    }
    get bullMqConfig(): Bull.QueueOptions {
        return {
            connection:{
                host: this.get('REDIS_HOST'),
                port: this.getNumber('REDIS_PORT'),
                password: this.get('REDIS_PASSWORD'), // Optional
            }
        } satisfies Bull.QueueOptions
    }
    get typeOrmConfig(): TypeOrmModuleOptions {
        let entities = [__dirname + '/../../modules/**/*.entity{.ts,.js}'];
        let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

        if ((module as any).hot) {
            const entityContext = (require as any).context('./../../modules', true, /\.entity\.ts$/);
            entities = entityContext.keys().map((id) => {
                const entityModule = entityContext(id);
                const [entity] = Object.values(entityModule);
                return entity;
            });
            const migrationContext = (require as any).context('./../../migrations', false, /\.ts$/);
            migrations = migrationContext.keys().map((id) => {
                const migrationModule = migrationContext(id);
                const [migration] = Object.values(migrationModule);
                return migration;
            });
        }
        return {
            entities,
            migrations,
            type: 'postgres',
            host: this.get('POSTGRES_HOST'),
            port: this.getNumber('POSTGRES_PORT'),
            username: this.get('POSTGRES_USERNAME'),
            password: this.get('POSTGRES_PASSWORD'),
            database: this.get('POSTGRES_DATABASE'),
            migrationsRun: true,
            logging: this.nodeEnv === 'development',
            namingStrategy: new SnakeNamingStrategy(),
        };
    }

    get winstonConfig(): winston.LoggerOptions {
        return {
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
                            prettyPrint: true,
                        }),
                    ),
                }),
                new DailyRotateFile({
                    level: 'debug',
                    filename: `./logs/${this.nodeEnv}/debug-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new DailyRotateFile({
                    level: 'error',
                    filename: `./logs/${this.nodeEnv}/error-%DATE%.log`,
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: false,
                    maxSize: '20m',
                    maxFiles: '30d',
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                }),
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({
                            format: 'DD-MM-YYYY HH:mm:ss',
                        }),
                        winston.format.simple(),
                    ),
                }),
                new winston.transports.File({
                    filename: './logs/app_combined.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.ms(),
                        nestWinstonModuleUtilities.format.nestLike(AppConfig.APP_NAME, {
                            prettyPrint: true,
                        }),
                    ),
                }),
            ],
            exitOnError: false,
        };
    }
    get moralisConfig() {
        return {
            apiKey: this.get('MORALIS_API_KEY'),
            apiUrl: 'https://web-proxy.minter.network/moralis',
        };
    }

    get services() {
        return {
            grpcPort: this.getNumber('GRPC_PORT') || 7900,
            natsPort: this.getNumber('NATS_PORT') || 4222,
            jwtSecret: this.get('JWT_SECRET'),
            redisUri: this.get('REDIS_URI'),
        };
    }
}
