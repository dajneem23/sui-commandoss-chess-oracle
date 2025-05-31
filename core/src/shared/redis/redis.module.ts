// redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global() // makes RedisService available app-wide without importing the module everywhere
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
