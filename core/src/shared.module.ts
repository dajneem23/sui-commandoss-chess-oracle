import { HttpModule } from '@nestjs/axios';
import { Module, Global } from '@nestjs/common';

import { ConfigService } from './shared/services/config.service';
import { GeneratorService } from './shared/services/generator.service';
import { LoggerService } from './shared/services/logger.service';
import { ValidatorService } from './shared/services/validator.service';
import { RedisModule } from './shared/redis/redis.module';
import { RedisService } from './shared/redis/redis.service';

const providers = [ConfigService, LoggerService, ValidatorService, GeneratorService,RedisService];

@Global()
@Module({
    providers,
    imports: [HttpModule,RedisModule],
    exports: [...providers, HttpModule,RedisModule],
})
export class SharedModule {}
