
import { Processor, OnQueueEvent, OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job,Queue,BulkJobOptions } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import fs from 'fs';
import { chunk } from 'lodash'; // Ensure lodash is installed
import { RedisService } from 'src/shared/redis/redis.service';
import { PlayersService } from '../services/players.service';
import { LoggerService } from 'src/shared/services/logger.service';

@Processor('player',
    {
    concurrency: 10, // Set concurrency to 1 to process one job at a time,
    autorun: true, // Automatically start processing jobs
    // limiter:{
    //     max:1,
    //     duration: 1000 // Limit to 1 job per second
    // }
}
)
@Injectable()
export class PlayerConsumer extends WorkerHost {
    constructor(
        @InjectQueue('player') // Inject the player queue
        private readonly playerQueue: Queue, // Replace 'any' with the actual type if needed
        private readonly redisService: RedisService,
        private readonly playerService: PlayersService,
        private readonly logger: LoggerService,
    ) {
        super();
        // this.initJobs()
    }
    private async initJobs() {
        // You can add jobs to the queue here if needed
        // await this.playerQueue.add('jobName', { data: 'value' });
        this.logger.log('PlayerConsumer jobs initialized');
        // const playerIds = fs.readFileSync("../../../data/playerIds.txt", "utf-8")
        //     .split('\n')
        //     .filter(line => line.trim() !== ''); // Filter out empty lines
        //get from set player_ids
        const playerIds =await this.redisService.getClient().smembers('player_ids')
        if (!playerIds || playerIds.length === 0) {
            console.error('No player IDs found in the set "player_ids".');
        }
        this.logger.log(`Found ${playerIds.length} player IDs in the set "player_ids".`);
        const jobs:{
            name: string;
            data: any; // Replace 'any' with the actual type if needed
            opts: BulkJobOptions
        }[] = []
        for (const playerId of playerIds) {
            const jobData = {
                playerId: playerId.trim(), // Trim whitespace
                action: 'processPlayer', // Example action
            };
            const job = {
                name: 'player',
                data: jobData,
                opts: {
                    jobId: playerId, // Use playerId as the job ID
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
            };
            jobs.push(job);
            this.logger.log(`Job added for playerId: ${playerId}`);
        }
        const chunks = chunk(jobs, 1000); // Split jobs into chunks of 1000
        for (const chunkJobs of chunks) {
            this.logger.log(`Adding ${chunkJobs.length} jobs to the queue...`);
            await this.playerQueue.addBulk(chunkJobs);
        }

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
        const { playerId, action } = job.data;
        const player = await (await fetch(`https://lichess.org/api/fide/player/${playerId}`)).json()
        const {id, ...rest} = player;
        const r =await this.playerService.createPlayer({
            liChessId: id,
            ...rest
        })
        return r;
    }
}
