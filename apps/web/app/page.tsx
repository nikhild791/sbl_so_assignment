"use client"
import { useEffect, useState } from "react";
import {Spinner} from '@repo/ui/spinner';
import { useRouter } from "next/navigation";


export default function Home() {
    const router = useRouter()
   const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading,setLoading] = useState(false)
    useEffect(()=>{
        if(localStorage.getItem('token')){
            router.push("dashboard")
        }
    },[])




  const handleSubmit =async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    if(!name || !email){
      return null;
    }
    const res = await fetch('http://localhost:3001/user',{
      method:'POST',
       headers: {
    'Content-Type': 'application/json' // Specify that you're sending JSON data
  },
      body:JSON.stringify({
        name,
        email
      })
    })
    const data =  await res.json();
    localStorage.setItem('token',data.user[0].insertedId)
    router.push('/dashboard')
    setLoading(false)
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="flex flex-row gap-8">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm space-y-4"
        >
        <h1 className="text-xl font-semibold text-center">Register</h1>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            USERNAME
          </label>
          <input
            type="text"
            placeholder="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-black outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email 
          </label>
          <textarea
            placeholder="abc@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
     
            </div>

        
      
    </div>
  );
}
