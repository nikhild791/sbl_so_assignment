"use client"
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import {Spinner} from '@repo/ui/spinner';
import { StatusProgress, Step } from "@repo/ui/checkList";


export default function Home() {
   const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [data,setData] = useState("")
  const [loading,setLoading] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [finalTaskStatus, setFinalTaskStatus] = useState(null)
 
const [steps, setSteps] = useState<Step[]>([]);

  useEffect(()=>{
   
    async function getTaskStatus(){
        if(taskId!=null){
         const res = await fetch(`http://localhost:3001/task/${taskId}`)
        const taskStatus = await res.json()
        setSteps(prev => [
  ...prev,
  { state: taskStatus.state, progress: taskStatus.progress }
]);
if(taskStatus.progress===100){
  setData(taskStatus.result)
}
        setFinalTaskStatus(taskStatus.state)
        }

    }
    getTaskStatus()
    let timer ;
    if(taskId && finalTaskStatus !== "completed" ){
 timer = setInterval(()=>{
            getTaskStatus()
        },1500)
    }

    return ()=>{
        clearInterval(timer)
    }
  },[taskId,finalTaskStatus])


  const handleSubmit =async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    if(!url || !question){
      return null;
    }
    const res = await fetch('http://localhost:3001/task',{
      method:'POST',
       headers: {
    'Content-Type': 'application/json' 
  },
      body:JSON.stringify({
        url,
        question
      })
    })
    const data = await res.json();

    setTaskId(data.taskId)
    setLoading(false)
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-row gap-8">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm space-y-4"
        >
        <h1 className="text-xl font-semibold text-center">Ask a Website</h1>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Website URL
          </label>
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Your Question
          </label>
          <textarea
            placeholder="What is this site about?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 h-24 resize-none focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black flex flex-col items-center justify-center text-white py-2 rounded-lg hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? <Spinner/>  :"Submit"}
        </button>
      </form>
      <div className="w-full">
      <StatusProgress title="Website scrapping job" steps={steps} />
      </div>
            </div>

        <div>
          <ReactMarkdown>{data}</ReactMarkdown>
          </div>
      
    </div>
  );
}
