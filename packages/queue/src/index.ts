import { Queue, Worker, QueueEvents } from "bullmq";
import IORedis from "ioredis";
import {env} from "@repo/config/index"
export const connection = new IORedis(env.REDIS_URL,{maxRetriesPerRequest: null,   
});

export const taskQueue = new Queue("scrape-job-queue", { connection });

export function createWorker(handler: any) {
  const worker = new Worker("scrape-job-queue", handler, { connection });
  const events = new QueueEvents("scrape-job-queue", { connection });
  events.on("completed", ({ jobId }) => console.log(`✅ Job completed: ${jobId}`));
  events.on("failed", ({ jobId, failedReason }) => console.log(`❌ Job failed: ${jobId}`, failedReason));
  return worker;
}
