import dotenv from "dotenv";

import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
dotenv.config()
export const connection = new IORedis({host:"localhost", port:6379 ,maxRetriesPerRequest: null,   
});

export const taskQueue = new Queue("scrape-job-queue", { connection });

export function createWorker(handler: any) {
  const worker = new Worker("scrape-job-queue", handler, { connection });
  const events = new QueueEvents("scrape-job-queue", { connection });
  events.on("completed", ({ jobId }) => console.log(`✅ Job completed: ${jobId}`));
  events.on("failed", ({ jobId, failedReason }) => console.log(`❌ Job failed: ${jobId}`, failedReason));
  return worker;
}
