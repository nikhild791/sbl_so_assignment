"use client"
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import {Spinner} from '@repo/ui/spinner';
import LoadingOverlay from '@repo/ui/loading';
import { Step } from "@repo/ui/checkList";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export default function Home() {
   const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [data,setData] = useState("")
  const [loading,setLoading] = useState(false)
  const [taskId, setTaskId] = useState(null)
  const [finalTaskStatus, setFinalTaskStatus] = useState(null)
 
const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    const buildSteps = (progress: number): Step[] => {
      const template = [
        { state: "queued", progress: 10 },
        { state: "scrapped", progress: 50 },
        { state: "ai calling", progress: 70 },
        { state: "completed", progress: 100 },
      ];

      return template.map((t) => {
        let state: string = "waiting";
        if (progress >= t.progress) state = "completed";
        else if (progress > (t.progress - 30) && progress < t.progress) state = "running";
        return { state, progress: t.progress } as Step;
      });
    };

    async function getTaskStatus() {
      if (taskId != null) {
        const res = await fetch(`${API_URL}/task/${taskId}`);
        const taskStatus = await res.json();
        setSteps(buildSteps(taskStatus.progress || 0));
        if (taskStatus.progress === 100) {
          setData(taskStatus.result);
        }
        setFinalTaskStatus(taskStatus.state);
      }
    }

    getTaskStatus();
    let timer: any;
    if (taskId && finalTaskStatus !== "completed") {
      timer = setInterval(() => {
        getTaskStatus();
      }, 1500);
    }

    return () => {
      clearInterval(timer);
    };
  }, [taskId, finalTaskStatus]);


  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!url || !question) {
      setLoading(false);
      return null;
    }
    const res = await fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        question
      })
    });
    const data = await res.json();

    setTaskId(data.taskId);
    // keep local button loading minimal; overlay will handle the job progress
    setLoading(false);
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
        {/* keep a small inline status card for desktop, overlay handles the main UX */}
        <div className="hidden md:block">
          <div className="w-full">
            {/* reuse StatusProgress for the inline card */}
            <div className="w-full max-w-lg border rounded-lg shadow-sm p-4 bg-white">
              <h2 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">Website scrapping job</h2>
              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex flex-col items-center">
                      {step.state === "completed" && (
                        <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center">✓</div>
                      )}
                      {step.state === "running" && (
                        <div className="text-blue-500 animate-spin">●</div>
                      )}
                      {step.state === "waiting" && (
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      )}
                      {index < steps.length - 1 && (
                        <div className="w-px h-8 bg-gray-300 mt-1"></div>
                      )}
                    </div>

                    <div>
                      {step.progress === 10 && <div>queued</div>}
                      {step.progress === 50 && <div>scrapped</div>}
                      {step.progress === 70 && <div>ai calling</div>}
                      {step.progress === 100 && <div>completed</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
            </div>
      <div>
        <ReactMarkdown>{data}</ReactMarkdown>
      </div>

      {/* Loading overlay tracks the whole pipeline and shows progress */}
      <LoadingOverlay visible={!!taskId && finalTaskStatus !== "completed"} steps={steps} />
      
    </div>
  );
}
