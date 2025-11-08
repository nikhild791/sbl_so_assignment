import express from 'express'
import { db } from "@repo/db/index";
import {users ,tasks} from "@repo/db/schema"
import {scrape} from "@repo/scrapper/index"
import cors from 'cors'
import { getAIAnswer } from './ai/gemini';
import { eq } from 'drizzle-orm';
const port = process.env.PORT || 3001;

const status = [
  'queued',
  'scraping',
  'scraped',
  'calling_ai',
  'completed',
  'failed'
]



const app  = express();
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.status(200).json({msg:"Hello World!"})
})

app.post('/user',async(req,res)=>{
  const {email ,name} = req.body;
  if(!email || !name ){
    return res.status(404).json({msg:"email or password is missing"})
  }
  const user =  await db.insert(users).values({
    name,
    email
  }).returning({ insertedId: users.id });
  return res.status(201).json({msg:"User logged in",user})
})

app.get('/task/:taskId', async (req,res) => {
  const taskIdParam = req.params.taskId
  if(!taskIdParam){
    return res.status(404).json({msg:"missing task id"})
  }
  const taskId = Number(taskIdParam)
  if(Number.isNaN(taskId)){
    return res.status(400).json({msg:"invalid task id"})
  }
  const taskStatus = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1)
  return res.send(taskStatus)
})

app.post('/task',async(req,res)=>{
  const {url,question,userId} = req.body;
  if(!url || !question || !userId) return;
 try {
    new URL(url);
  } catch (e) {
    return res.status(404).json({msg:"Invalid url"})
  } 
 const taskIdResponse =  await db.insert(tasks).values({
    url,
    question,
    userId
  }).returning({insertedId:tasks.id})
  return res.status(201).json({msg:"Task is created",taskIdResponse})
})

app.get('/scrape/:taskId',async (req,res)=>{
  const taskIdParam = req.params.taskId;
 if(!taskIdParam){
    return res.status(404).json({msg:"missing task id"})
  }
  const taskId = Number(taskIdParam)
  if(Number.isNaN(taskId)){
    return res.status(400).json({msg:"invalid task id"})
  }
 
  const task = await db.select().from(tasks).where(eq(tasks.id,taskId)).limit(1)
  if(task[0]===undefined ){
    return res.status(404).json({msg:"no task found"})
  }
   const data = await scrape(task[0]?.url)
   await db.update(tasks).set({status:'scraped'}).where(eq(tasks.id , taskId))
   if(data===undefined){
    return res.status(404).json({msg:"cannot scrape data"})
   }
   
    const aiResponse = await getAIAnswer(data,task[0]?.question)
    await db.update(tasks).set({
        aiResponse,
      status:'completed'
      })
      res.status(200).json({data:aiResponse})
      await db.update(tasks).set({status:'completed'})
  
})




app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
