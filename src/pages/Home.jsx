import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Select from "react-select";
import { RiQuillPenAiLine, RiCodeSSlashFill } from "react-icons/ri";
import { CgExport } from "react-icons/cg";
import { BsCopy } from "react-icons/bs";
import { MdOutlineOpenInNew } from "react-icons/md";
import { FiRefreshCw } from "react-icons/fi";
import { DNA } from "react-loader-spinner";
import Editor from "@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { toast } from "react-toastify";

const FONT_FAMILIES = {
  system: "Inter, ui-sans-serif, system-ui, sans-serif",
  sans: "Poppins, Inter, ui-sans-serif, sans-serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

const Home = () => {
  const options = useMemo(
    () => [
      { value: "html-css", label: "HTML + CSS" },
      { value: "html-tailwind", label: "HTML + Tailwind CSS" },
      { value: "html-bootstarp", label: "HTML + Bootstarp" },
      { value: "html-css-js", label: "HTML + CSS + JS" },
      { value: "html-tailwind-bootstarp", label: "HTML + Tailwind + Bootstarp" },
    ],
    []
  );

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framework, setFramework] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("genui-theme") !== "light");
  const [fontKey, setFontKey] = useState(() => localStorage.getItem("genui-font") || "system");
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("genui-font-size")) || 15);

  useEffect(() => localStorage.setItem("genui-theme", isDark ? "dark" : "light"), [isDark]);
  useEffect(() => localStorage.setItem("genui-font", fontKey), [fontKey]);
  useEffect(() => localStorage.setItem("genui-font-size", String(fontSize)), [fontSize]);

  // To remove the unnecessary Markdown ``` wrapper from the AI response.
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  function createPreviewDocument(markup) {
    if (/<!doctype|<html[\s>]/i.test(markup)) return markup;

    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GenUI Preview</title>
  </head>
  <body>${markup}</body>
</html>`;
  }

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY,
  });

  async function getResponse() {
    if (!prompt.trim()) {
      toast.error("Please describe the component first.");
      return;
    }

    setLoading(true);
    try {
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
          Return ONLY the code, formatted properly in Markdown fenced code blocks.
          Do NOT include explanations, text, comments, or anything else besides the code.
          Give the whole result in a single HTML file.
        `,
      });

      const generatedCode = extractCode(response.text || "");
      if (!generatedCode) throw new Error("No code was returned by the AI.");

      setCode(generatedCode);
      setOutputScreen(true);
      setTab(1);
    } catch (error) {
      console.error(error);
      toast.error("Could not generate code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy!");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([createPreviewDocument(code)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "code.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded successfully!");
  };

  const openPreviewInNewTab = () => {
    if (!code.trim()) {
      toast.error("Generate code before opening a preview.");
      return;
    }

    // The new page receives the complete HTML document, not the dashboard overlay.
    const previewTab = window.open("", "_blank");
    if (!previewTab) {
      toast.error("Your browser blocked the new tab. Please allow pop-ups and try again.");
      return;
    }

    previewTab.opener = null;
    previewTab.document.open();
    previewTab.document.write(createPreviewDocument(code));
    previewTab.document.close();
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? "#09090B" : "#FFFFFF",
      borderColor: isDark ? "#27272A" : "#CBD5E1",
      color: isDark ? "#FFFFFF" : "#0F172A",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: isDark ? "#141419" : "#FFFFFF",
      zIndex: 20,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? (isDark ? "#27272A" : "#E2E8F0") : isDark ? "#141419" : "#FFFFFF",
      color: isDark ? "#FFFFFF" : "#0F172A",
    }),
    singleValue: (base) => ({ ...base, color: isDark ? "#FFFFFF" : "#0F172A" }),
    placeholder: (base) => ({ ...base, color: isDark ? "#71717A" : "#64748B" }),
    input: (base) => ({ ...base, color: isDark ? "#FFFFFF" : "#0F172A" }),
  };

  const panelClass = isDark ? "bg-[#141319]" : "border border-slate-200 bg-white shadow-sm";
  const subTextClass = isDark ? "text-gray-500" : "text-slate-500";
  const inputClass = isDark
    ? "bg-stone-950 text-white placeholder:text-slate-500"
    : "border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400";
  const headerClass = isDark ? "bg-[#17171C]" : "border-b border-slate-200 bg-slate-50";
  const inactiveTabClass = isDark ? "hover:bg-[#292930]" : "hover:bg-slate-200";
  const actionButtonClass = isDark
    ? "border-zinc-700 hover:bg-[#333]"
    : "border-slate-300 text-slate-700 hover:bg-slate-100";

  return (
    <div
      className={`min-h-screen transition-colors ${isDark ? "bg-[#09090B] text-white" : "bg-[#F7F8FC] text-slate-900"}`}
      style={{ fontFamily: FONT_FAMILIES[fontKey] || FONT_FAMILIES.system }}
    >
      <Navbar
        isDark={isDark}
        onToggleTheme={() => setIsDark((currentTheme) => !currentTheme)}
        fontKey={fontKey}
        onFontKeyChange={setFontKey}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <div className="flex flex-col items-stretch justify-between gap-5 px-3 pb-5 pt-5 lg:flex-row lg:px-5">
        <div className={`left h-[80vh] w-full rounded-xl p-5 lg:w-1/2 ${panelClass}`}>
          <h3 className="blu-text text-[20px] font-semibold">AI component generator</h3>
          <p className={`mt-2 text-[16px] ${subTextClass}`}>Describe your component and let AI code for you</p>
          <p className="mt-4 text-[15px] font-bold">Framework</p>

          <Select
            value={framework}
            onChange={setFramework}
            className="mt-4"
            options={options}
            styles={selectStyles}
          />

          <p className="mb-2 mt-5 text-[15px] font-semibold">Describe your component</p>
          <textarea
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
            className={`min-h-[250px] w-full rounded-xl p-2 outline-none focus:ring-2 focus:ring-cyan-500 ${inputClass}`}
            placeholder="Enter your prompt"
          />

          <button
            type="button"
            onClick={getResponse}
            disabled={loading}
            className="generate ml-auto mt-3 flex min-h-[48px] items-center gap-2 rounded-lg border-0 bg-gradient-to-r from-rose-400 to-purple-600 px-5 transition-all hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <DNA height="18" width="18" ariaLabel="Generating code" />
            ) : (
              <RiQuillPenAiLine />
            )}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className={`right flex h-[80vh] w-full flex-col overflow-hidden rounded-xl p-5 lg:w-1/2 ${panelClass}`}>
          {!outputScreen ? (
            <div className="skeleton flex h-full w-full flex-col items-center justify-center">
              <div className="circle flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-purple-600 p-5">
                <RiCodeSSlashFill />
              </div>
              <p className="mt-2">Your code will display here...</p>
            </div>
          ) : (
            <>
              <div className={`top flex h-[60px] w-full items-center gap-[15px] px-3 ${headerClass}`}>
                <button
                  type="button"
                  onClick={() => setTab(1)}
                  className={`btn w-1/2 cursor-pointer rounded-xl p-[10px] transition-all ${tab === 1 ? "bg-[#333] text-white" : inactiveTabClass}`}
                >
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => setTab(2)}
                  className={`btn w-1/2 cursor-pointer rounded-xl p-[10px] transition-all ${tab === 2 ? "bg-[#333] text-white" : inactiveTabClass}`}
                >
                  Preview
                </button>
              </div>

              <div className={`top-2 flex h-[60px] w-full items-center justify-between gap-[15px] px-3 ${headerClass}`}>
                <p className="font-bold">{tab === 1 ? "Code Editor" : "Live Preview"}</p>
                <div className="flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button type="button" onClick={copyCode} title="Copy code" className={`copy flex h-[40px] w-[40px] items-center justify-center rounded-xl border transition-all ${actionButtonClass}`}>
                        <BsCopy />
                      </button>
                      <button type="button" onClick={downloadFile} title="Download HTML" className={`export flex h-[40px] w-[40px] items-center justify-center rounded-xl border transition-all ${actionButtonClass}`}>
                        <CgExport />
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={openPreviewInNewTab} title="Open in new tab" className={`newtab flex h-[40px] w-[40px] items-center justify-center rounded-xl border transition-all ${actionButtonClass}`}>
                        <MdOutlineOpenInNew />
                      </button>
                      <button type="button" onClick={() => setPreviewKey((currentKey) => currentKey + 1)} title="Refresh preview" className={`export flex h-[40px] w-[40px] items-center justify-center rounded-xl border transition-all ${actionButtonClass}`}>
                        <FiRefreshCw />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="editor min-h-0 flex-1">
                {tab === 1 ? (
                  <Editor
                    value={code}
                    height="100%"
                    theme={isDark ? "vs-dark" : "light"}
                    language="html"
                    options={{ fontSize, minimap: { enabled: false } }}
                  />
                ) : (
                  <iframe
                    key={previewKey}
                    srcDoc={createPreviewDocument(code)}
                    title="Generated component preview"
                    className="preview h-full w-full bg-white text-black"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
