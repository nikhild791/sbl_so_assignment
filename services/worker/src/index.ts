
import { createWorker } from "@repo/queue";
import { db } from "@repo/db/index";
import {tasks} from "@repo/db/schema"
import { getAIAnswer } from "@repo/ai/index"; 
import { scrape } from "@repo/scrapper/index";
import { eq } from 'drizzle-orm';

export default createWorker(async job => {
  const { taskId } = job.data;

  // 1. Update status → scraping
  if(!taskId){
    return false;
  }
  await db.update(tasks).set({ status: "scraping" }).where(eq(tasks.id,taskId));

  const scrapedText = await scrape(job.data.url);
  if(!scrapedText){
    return false
  }
  await db.update(tasks).set({ status: "ai_processing" }).where(eq(tasks.id,taskId));

  const answer = await getAIAnswer(scrapedText, job.data.question);

  await db.update(tasks).set({
    status: "completed",
    aiResponse: answer
  }).where(eq(tasks.id,taskId));

  return true;
});
