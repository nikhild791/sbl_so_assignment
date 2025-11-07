import express from 'express'
import { db } from "@repo/db/index";
import {users} from "@repo/db/schema"
import {scrape} from "@repo/scrapper/index"
import cors from 'cors'
const port = process.env.PORT || 3001;

const app  = express();
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.status(200).json({msg:"Hello World!"})
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
  res.status(200).json({data,question})
  
})

// async function  main (){
// await db.insert(users).values({ name: "John Doe",email:"john@doe.com" });

//   // Select
//   const result = await db.select().from(users);
//   console.log(result);
// }

// main()


app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
