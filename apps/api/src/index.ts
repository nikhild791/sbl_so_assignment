import express from 'express'
import { db } from "@repo/db/index";
import {users} from "@repo/db/schema"
import {scrape} from "@repo/scrapper/index"
import cors from 'cors'
import { getAIAnswer } from './ai/gemini';
const port = process.env.PORT || 3001;

const status = [
  'starting the loading of website',
  'scrapping the website',
  'website scrapped',
  'calling ai for response',
  'got ai call from website'
]

const app  = express();
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.status(200).json({msg:"Hello World!"})
})

app.get('/status',(req,res)=>{

})

app.post('/scrape',async (req,res)=>{
  const {url,question} = req.body;
  if(!url || !question) return;
 try {
    new URL(url);
  } catch (e) {
    return res.status(404).json({msg:"Invalid url"})
  } 
   const data = await scrape(url)
   if(data===undefined){
    return res.status(404).json({msg:"cannot scrape data"})
   }
  //  const aiResponse = await getAIAnswer(data,question)

  res.status(200).json({data,question})
  
})




app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
