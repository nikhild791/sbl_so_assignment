"use client"
import { useState } from "react";


export default function Home() {
   const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [data,setData] = useState("")

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault();
    if(!url || !question){
      return null;
    }
    const res = await fetch('http://localhost:3001/scrape',{
      method:'POST',
       headers: {
    'Content-Type': 'application/json' // Specify that you're sending JSON data
  },
      body:JSON.stringify({
        url,
        question
      })
    })
    const data = await res.json();
    setData(data.data)

  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
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
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Submit
        </button>
      </form>
     
        <div>
          {data}
          </div>
      
    </div>
  );
}
