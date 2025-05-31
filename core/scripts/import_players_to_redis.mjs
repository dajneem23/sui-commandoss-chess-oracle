
//  #!/usr/bin/env zx

import Redis from 'ioredis';
import { readFile,writeFile } from 'fs/promises';
import dotenv from 'dotenv';
import { chunk } from 'lodash-es';
dotenv.config({
    path: '../.env', // Adjust the path to your .env file if necessary
}); // Load environment variables from .env file
console.log('Starting player import to Redis...',


);
const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost', // Use environment variable or default to localhost
    port: process.env.REDIS_PORT || 6379, // Use environment variable or default to 6379
    password: process.env.REDIS_PASSWORD || undefined, // Use environment variable or no password
}); // default: localhost:6379

const file = await readFile('../data/players_list_foa.txt', 'utf8'); // Replace with your file path

// // Split lines and filter valid lines
const lines = file
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && /^\d/.test(line)); // Lines starting with an ID number
await writeFile('../data/playerIds.txt',lines.map(line => line.split(/\s+/)[0]).filter(id => id).join("\n"), 'utf8'); // Save to JSON file
// const chunks = chunk(lines, 1000); // Chunk lines into groups of 1000 for batch processing
// for (const chunk of chunks) {
//   const pipeline = redis.pipeline(); // Create a pipeline for batch processing
//   for (const line of chunk) {
//     const id = line.split(/\s+/)[0]; // First column
//     if (id) {
//       pipeline.sadd('player_ids', id); // Add ID to Redis set
//       console.log(`Imported ID: ${id}`); // Log imported ID
//     }
//   }
//   await pipeline.exec(); // Execute the batch operation
// }

await redis.quit();
