import { createWorker } from "@repo/queue";
import { db } from "@repo/db/index";
import {tasks} from "@repo/db/schema"
import { getAIAnswer } from "@repo/ai/index"; 
import { scrape } from "@repo/scrapper/index";


export default createWorker(async job => {
  const { url, question } = job.data;
 
 
  await job.updateProgress(10); // Update status: starting scrape

  const scrapedText = await scrape(url);
  if(!scrapedText){
    return false
  }
  await job.updateProgress(50); 
  const answer = await getAIAnswer(scrapedText, question);
  await job.updateProgress(70); 
  await db.insert(tasks).values({
    url,
    question,
    status: "completed",
    aiResponse:answer
  })
  

  await job.updateProgress(100); 

  return answer;
});
