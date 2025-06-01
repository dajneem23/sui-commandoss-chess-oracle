
import { Processor, OnQueueEvent, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue, BulkJobOptions } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import fs from 'fs';
import path from 'path';
import { chunk } from 'lodash'; // Ensure lodash is installed
import { RedisService } from 'src/shared/redis/redis.service';
import { GamesService } from '../services/game.service';
import { parsePGNtoGames } from '../utils/parsePGN';
import { finished, pipeline } from "stream/promises";
import * as readline from 'readline';
import { LoggerService } from 'src/shared/services/logger.service';

const PGN_DELIMITER = ''; // blank line indicates end of game block

@Processor('game',
    {
        concurrency: 10, // Set concurrency to 1 to process one job at a time,
        autorun: false, // Automatically start processing jobs
        // limiter:{
        //     max:1,
        //     duration: 1000 // Limit to 1 job per second
        // }
    }
)
@Injectable()
export class GameConsumer extends WorkerHost {
    constructor(
        @InjectQueue('game') // Inject the game queue
        private readonly gameQueue: Queue, // Replace 'any' with the actual type if needed
        private readonly redisService: RedisService,
        private readonly gameService: GamesService,
        private readonly logger: LoggerService,

    ) {
        super();
        this.initJobs()
    }
    private async initJobs() {
        // You can add jobs to the queue here if needed
        // await this.gameQueue.add('jobName', { data: 'value' });
        this.logger.log('GameConsumer jobs initialized');
        // const gameIds = fs.readFileSync("../../../data/gameIds.txt", "utf-8")
        //     .split('\n')
        //     .filter(line => line.trim() !== ''); // Filter out empty lines
        //get from set game_ids
        // const raw = fs.readFileSync(path.resolve(__dirname, '../../../../data/games.json'), "utf-8");
        const stream = fs.createReadStream(path.resolve(__dirname, '../../../../data/lichess_db_standard_rated_2015-08.pgn'), { encoding: 'utf8' });
        const rl = readline.createInterface({ input: stream });

        const games: any[] = [];
        let gameBuffer: string[] = [];
        let collecting = false;
        await pipeline(
            rl,
            async function* (source) {
                for await (const line of source) {
                    if (line.startsWith('[')) {
                        collecting = true;
                        gameBuffer.push(line);
                    } else if (collecting && line.trim() === '') {
                        // empty line between headers and moves — keep going
                        continue;
                    } else if (collecting && /^[1-9]+\.\s/.test(line)) {
                        // Line starts with a move number: 1. e4 e5 ...
                        gameBuffer.push(line);
                        yield gameBuffer.join('\n');
                        gameBuffer = [];
                        collecting = false;
                    }
                }
            },
            async (source) => {
                for await (const game of source) {
                    // TODO: parse this block into a TypeORM entity if needed
                    const [ _game ] = parsePGNtoGames(game)
                    const job = {
                        name: 'game',
                        data: {
                            game: _game,
                            action: 'processGame', // Example action
                        },
                        opts: {
                            jobId: _game.id,
                            attempts: 3, // Number of retry attempts
                            backoff: {
                                type: 'exponential', // Exponential backoff
                                delay: 1000, // Initial delay in milliseconds
                            },
                            removeOnComplete: {
                                age: 3600, // Remove job after 1 hour if completed

                            }, // Remove job after completion
                            removeOnFail: {
                                age: 3600, // Remove job after 1 hour if failed
                            }, // Remove job after failure
                        },
                    }
                    await this.gameQueue.add(
                        job.name,
                        job.data,
                        job.opts
                    )
                }
            }
        );
    }

    @OnQueueEvent("active")
    onQueueActive(job: Job) {
        this.logger.log(
            `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }

    @OnWorkerEvent('active')
    onWorkerActive(job: Job) {
        this.logger.log(
            `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
        );
    }
    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(
            `Processing job ${job.id} of type ${job.name} with data ${JSON.stringify(job.data)}...`,
        )
        const { game, action } = job.data;
        const { id, ...rest } = game;
        const r = await this.gameService.createGame({
            liChessId: game.id,
            ...rest
        })
        return r;
    }
}
