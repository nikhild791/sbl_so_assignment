import express from 'express'
import { db } from "@repo/db/index";
import {users ,tasks} from "@repo/db/schema"
import { taskQueue } from "@repo/queue";
import cors from 'cors'
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

app.get('/task/:taskId', async (req, res) => {
  const taskId = Number(req.params.taskId);
  if (Number.isNaN(taskId)) return res.status(400).json({ msg: "Invalid task id" });

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  if (!task) return res.status(404).json({ msg: "Not found" });

  res.json(task);
});

app.post('/task', async (req, res) => {
  const { url, question, userId } = req.body;
  if (!url || !question || !userId)
    return res.status(400).json({ msg: "Missing fields" });

  try { new URL(url) } catch { return res.status(400).json({ msg: "Invalid URL" }) }

  const [task] = await db.insert(tasks).values({
    url,
    question,
    userId,
    status: "queued"
  }).returning({ id: tasks.id });
  if(!task){
    return res.status(404).json({msg:"Something went wrong"})
  }
  await taskQueue.add("scrape-job", { taskId: task.id }); // Queue it ✅

  res.status(202).json({ taskId: task.id });
});






app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
