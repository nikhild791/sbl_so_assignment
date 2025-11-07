import express from 'express'
import { db } from "@repo/db/index";
import {users} from "@repo/db/schema"

const port = process.env.PORT || 3000;

const app  = express();

app.get('/',(req,res)=>{
    res.status(200).json({msg:"Hello World!"})
})

app.get('/create',async(req,res)=>{

  res.status(200).send("created jhon baba")
})

async function  main (){
await db.insert(users).values({ name: "John Doe",email:"john@doe.com" });

  // Select
  const result = await db.select().from(users);
  console.log(result);
}

main()


app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})
