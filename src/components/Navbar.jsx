import React, { useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { SlSettings } from "react-icons/sl";

const Navbar = ({
  isDark,
  onToggleTheme,
  fontKey,
  onFontKeyChange,
  fontSize,
  onFontSizeChange,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const iconButtonClass = isDark
    ? "border-slate-800 bg-[#11111A] text-white hover:bg-[#22222C]"
    : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100";

  return (
    <nav
      className={`nav relative flex h-[90px] items-center justify-between border-b px-5 transition-colors md:px-20 ${
        isDark
          ? "border-cyan-800 bg-[#09090B] text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="logo">
        <h3 className="sp-text text-[25px]">GenUI</h3>
      </div>

      <div className="icons flex items-center gap-[15px]">
        <button
          type="button"
          onClick={onToggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className={`flex h-[60px] w-[60px] items-center justify-center rounded-xl border text-xl transition-all ${iconButtonClass}`}
        >
          {/* Light mode-e thakle ekhane <LuMoon /> dekhabe. Nijer moon icon dite chaile ei tag-ta replace koro. */}
          {isDark ? <LuSun /> : <LuMoon />}
        </button>

        {/* Account icon intentionally removed. */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsSettingsOpen((open) => !open)}
            title="Settings"
            aria-label="Open settings"
            aria-expanded={isSettingsOpen}
            className={`flex h-[60px] w-[60px] items-center justify-center rounded-xl border text-xl transition-all ${iconButtonClass}`}
          >
            <SlSettings />
          </button>

          {isSettingsOpen && (
            <div
              className={`absolute right-0 top-[72px] z-50 w-72 rounded-2xl border p-4 shadow-2xl ${
                isDark
                  ? "border-slate-700 bg-[#17171C] text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">Appearance</p>
                  <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Personalize your workspace
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${iconButtonClass}`}
                >
                  {isDark ? "Light mode" : "Dark mode"}
                </button>
              </div>

              <label className="mb-2 block text-sm font-medium" htmlFor="font-family">
                Interface font
              </label>
              <select
                id="font-family"
                value={fontKey}
                onChange={(event) => onFontKeyChange(event.target.value)}
                className={`mb-4 w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                  isDark
                    ? "border-slate-700 bg-[#09090B] text-white"
                    : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <option value="system">System UI</option>
                <option value="sans">Modern sans</option>
                <option value="mono">Monospace</option>
              </select>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium" htmlFor="font-size">
                  Editor font size
                </label>
                <span className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {fontSize}px
                </span>
              </div>
              <input
                id="font-size"
                type="range"
                min="12"
                max="22"
                value={fontSize}
                onChange={(event) => onFontSizeChange(Number(event.target.value))}
                className="mt-2 w-full accent-cyan-500"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
