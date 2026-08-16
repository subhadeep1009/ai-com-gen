import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { RiQuillPenAiLine } from "react-icons/ri";
import { RiCodeSSlashFill } from "react-icons/ri";
import { CgExport } from "react-icons/cg";
import { BsCopy } from "react-icons/bs";
import { MdOutlineOpenInNew } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { DNA } from "react-loader-spinner";
import Editor from "@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "react-toastify";
import { IoMdCloseCircleOutline } from "react-icons/io";

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstarp", label: "HTML + Bootstarp" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
    { value: "html-tailwind-bootstarp", label: "HTML + Tailwind + Bootstarp" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  //To remove the unncessary ``` content
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY
  });

  async function getResponse() {
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `
             You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

            Now, generate a UI component for: ${prompt}  
            Framework to use: ${framework.value}  

            Requirements:  
            The code must be clean, well-structured, and easy to understand.  
            Optimize for SEO where applicable.  
            Focus on creating a modern, animated, and responsive UI design.  
            Include high-quality hover effects, shadows, animations, colors, and typography.  
            Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
            Do NOT include explanations, text, comments, or anything else besides the code.  
            And give the whole code in a single HTML file.
        `,
    });
    console.log(response.text);
    setCode(extractCode(response.text));
    setOutputScreen(true);
    setLoading(false);
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy!");
    }
  };

  const downloadFile=()=>{
    const fileName="code.html";
    const blob=new Blob([code],{type:'text/plain'});
    let url=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=url;
    link.download=fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully!")
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center px-[100] justify-between gap-[20px]">
        <div className="left ml-3 w-[50%] h-[80vh] rounded-xl py-[30px] bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[20px] font-semibold blu-text ">
            AI component generator
          </h3>
          <p className="text-gray-500 mt-2 text-[16px] ">
            Describe your component and let AI code for you
          </p>
          <p className="text-[15px] font-bold mt-4">Framework</p>

          <Select
            onChange={(e) => {
              setFramework(e.value);
            }}
            className="mt-4"
            options={options}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#09090B",
                borderColor: "#27272A",
                color: "#FFFFFF",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#141419",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#27272A" : "#141419",
                color: "#FFFFFF",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#FFFFFF",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#71717A",
              }),
            }}
          />
          <p className="text-[15px] font-semibold mt-5 mb-2">
            Describe your component
          </p>

          <textarea
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            value={prompt}
            className="w-full min-h-[250px] p-2 rounded-xl bg-stone-950"
            placeholder="Enter you prompt"
          ></textarea>
          <button
            onClick={getResponse}
            className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-rose-400 to-purple-600 px-[20px] ml-auto mt-3 transition-all hover:opacity-50 "
          >
            {
                loading === false ?
                <>
                    <i><RiQuillPenAiLine/></i>
                </>: ""
            }
            {loading === true ? (
              <>
                <DNA className="size={14}" />
              </>
            ) : (
              ""
            )}
            Generate
          </button>
        </div>
        <div className="right relative py-[30px] mt-5 w-[50%] rounded-xl h-[80vh] mr-3 bg-[#141319] p-[20px] ">
          {outputScreen === false ? (
            <>
              <div className="skeleton w-full h-full flex items-center flex-col justify-center ">
                <div className="circle  p-[20px] w-[70px] flex items-center justify-center h-[70px] bg-gradient-to-r from-purple-400 to-purple-600 rounded-[50%] ">
                  <RiCodeSSlashFill />
                </div>
                <p>Your code will display here...</p>
              </div>
            </>
          ) : (
            <>
              <div className="top w-full h-[60px] bg-[#17171C] flex items-center gap-[15px] px-20px ">
                <button
                  onClick={() => {
                    setTab(1);
                  }}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? "bg-[#333]" : ""} `}
                >
                  Code
                </button>
                <button
                  onClick={() => {
                    setTab(2);
                  }}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? "bg-[#333]" : ""} `}
                >
                  Preview
                </button>
              </div>
              <div className="top-2 justify-between w-full h-[60px] bg-[#17171C] flex items-center gap-[15px] px-20px ">
                <div className="left">
                  <p className="font-bold">Code Editor</p>
                </div>
                <div className="right flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button
                        onClick={copyCode}
                        className="copy w-[40px] h-[40px] rounded-xl border-1 border-zinc-700 flex justify-center items-center cursor-pointer transition-all hover:bg-[#333] "
                      >
                        <BsCopy />
                      </button>
                      <button onClick={downloadFile} className="export w-[40px] h-[40px] rounded-xl border-1 border-zinc-700 flex justify-center items-center cursor-pointer transition-all hover:bg-[#333] ">
                        <CgExport />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={()=>{setIsNewTabOpen(true)}} className="newtab w-[40px] h-[40px] rounded-xl border-1 border-zinc-700 flex justify-center items-center cursor-pointer transition-all hover:bg-[#333] ">
                        <MdOutlineOpenInNew />
                      </button>
                      <button className="export w-[40px] h-[40px] rounded-xl border-1 border-zinc-700 flex justify-center items-center cursor-pointer transition-all hover:bg-[#333] ">
                        <FiRefreshCw />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="editor h-full  ">
                {tab === 1 ? (
                  <>
                    <Editor
                      value={code}
                      height="100%"
                      theme="vs-dark"
                      language="html"
                    />
                  </>
                ) : (
                  <>
                    <iframe srcDoc={code} className="preview bg-white text-black h-full w-full flex items-center justify-center "></iframe>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {
        isNewTabOpen === true?
        <>
        <div className="container absolute absolute left-0 right-0 top-0 bottom-0 bg-white w-scren min-h-screen overflow-auto">
            <div className="top text-black w-full h-[60px] flex items-center justify-between px-[20px]">
                <div className="left">
                    <p className="font-bold">Preview</p>
                </div>
                <div className="right flex items-center gap-[10px]">
                    <button className="copy w-[40px] rounded-xl border[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={()=>{setIsNewTabOpen(false)}}><IoMdCloseCircleOutline/></button>
                </div>
            </div>
        </div>
            <iframe srcDoc={code} className="w-full h-full "></iframe>
        </> :""
      }
    </>
  );
};

export default Home;
