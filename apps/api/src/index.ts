import express from 'express'
import { taskQueue } from "@repo/queue";
import cors from 'cors'
const port = process.env.PORT || 3001;




const app  = express();
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.status(200).json({msg:"Hello World!"})
})


app.get('/task/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  if (Number.isNaN(taskId)) return res.status(400).json({ msg: "Invalid task id" });
 const job = await taskQueue.getJob(taskId);

  if (!job) return res.status(404).json({ error: "Task not found" });

  const state = await job.getState();  // waiting, active, completed, failed
  const progress = job.progress;      // 0-100
  const result = job.returnvalue;     // answer when complete

  res.json({ state, progress, result });
});

app.post('/task', async (req, res) => {
  const { url, question } = req.body;
  if (!url || !question)
    return res.status(400).json({ msg: "Missing fields" });

  try { new URL(url) } catch { return res.status(400).json({ msg: "Invalid URL" }) }

  const job = await taskQueue.add("scrape-job", {url,question }); 

  res.status(202).json({ taskId: job.id });
});






app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
