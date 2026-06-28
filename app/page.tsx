"use client";

import React, { useState, useEffect } from "react";
import { Plus, Printer, RotateCcw, Settings, X, Upload } from "lucide-react";
import { format, getDaysInMonth } from "date-fns";
import { GithubIcon } from "./components/GithubIcon";
import { InteractiveBackground } from "./components/InteractiveBackground";

const SHORT_M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Tracker() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [trackerTitle, setTrackerTitle] = useState<string>("Consistency Tracker");
  const [trackerQuote, setTrackerQuote] = useState<string>("Small daily improvements lead to stunning results.");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isGenerated, setIsGenerated] = useState(false);
  
  // Customization State
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [bgOpacity, setBgOpacity] = useState<number>(10);
  const [textColor, setTextColor] = useState<string>("#000000");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    setStartDate(format(today, "yyyy-MM-dd"));
    
    const savedBg = localStorage.getItem("tracky_bg");
    if (savedBg) setBgImage(savedBg);

    const savedOpacity = localStorage.getItem("tracky_opacity");
    if (savedOpacity) setBgOpacity(parseInt(savedOpacity, 10));

    const savedTextColor = localStorage.getItem("tracky_textcolor");
    if (savedTextColor) setTextColor(savedTextColor);
    
    const savedState = localStorage.getItem("tracky_state");
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.isGenerated) {
          setStartDate(parsed.startDate);
          setEndDate(parsed.endDate);
          setGoal(parsed.goal);
          if (parsed.trackerTitle) setTrackerTitle(parsed.trackerTitle);
          if (parsed.trackerQuote) setTrackerQuote(parsed.trackerQuote);
          setChecked(parsed.checked || {});
          setIsGenerated(true);
        }
      } catch (e) {}
    }
  }, []);

  const saveState = (newState: any) => {
    localStorage.setItem("tracky_state", JSON.stringify(newState));
  };

  const handleGenerate = () => {
    if (!startDate) {
      alert("Please set a start date.");
      return;
    }
    if (endDate && new Date(endDate) <= new Date(startDate)) {
      alert("Goal date must be after the start date.");
      return;
    }
    setIsGenerated(true);
    saveState({ startDate, endDate, goal, trackerTitle, trackerQuote, checked, isGenerated: true });
  };

  const handleReset = () => {
    if (!confirm("Reset all progress and clear the tracker?")) return;
    setChecked({});
    setIsGenerated(false);
    saveState({ startDate, endDate, goal, trackerTitle, trackerQuote, checked: {}, isGenerated: false });
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          try {
            localStorage.setItem("tracky_bg", dataUrl);
            setBgImage(dataUrl);
          } catch (error) {
            alert("Image is still too large. Try uploading a smaller image.");
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setBgOpacity(val);
    localStorage.setItem("tracky_opacity", val.toString());
  };

  const toggleDay = (dateStr: string) => {
    setChecked(prev => {
      const next = { ...prev };
      if (next[dateStr]) delete next[dateStr];
      else next[dateStr] = true;
      saveState({ startDate, endDate, goal, trackerTitle, trackerQuote, checked: next, isGenerated });
      return next;
    });
  };

  const isInRange = (dateObj: Date) => {
    const s = new Date(startDate + 'T00:00:00');
    const e = endDate ? new Date(endDate + 'T00:00:00') : null;
    dateObj.setHours(0,0,0,0);
    s.setHours(0,0,0,0);
    if (e) e.setHours(0,0,0,0);

    if (dateObj < s) return false;
    if (e && dateObj > e) return false;
    if (!e) {
      const limit = new Date(s);
      limit.setDate(s.getDate() + 364);
      if (dateObj > limit) return false;
    }
    return true;
  };

  const renderDot = (year: number, m: number, d: number) => {
    const dayNum = d + 1;
    const daysInMonth = getDaysInMonth(new Date(year, m));
    
    if (dayNum > daysInMonth) {
      return <div key={`${m}-${d}`} className="w-full aspect-square invisible" />;
    }
    
    const dateObj = new Date(year, m, dayNum);
    const dateStr = format(dateObj, "yyyy-MM-dd");
    const inRange = isInRange(dateObj);
    const isChecked = checked[dateStr] || false;
    const isToday = dateStr === format(new Date(), "yyyy-MM-dd");

    let dotClass = "w-full aspect-square border transition-all duration-150 flex items-center justify-center text-[8px] md:text-[10px] font-medium select-none ";
    
    if (!inRange) {
      dotClass += "opacity-10 border-[var(--t-border)] bg-transparent";
    } else {
      dotClass += "cursor-pointer hover:border-[var(--t-base)] ";
      if (isChecked) {
        dotClass += "bg-[var(--t-base)] border-[var(--t-base)] text-white";
      } else {
        dotClass += "bg-white border-[var(--t-border)]";
      }
      
      if (isToday) {
        if (!isChecked) {
          dotClass += " border-[var(--t-base)] border-[1.5px] bg-[var(--t-hover)]";
        }
      }
    }

    return (
      <div 
        key={`${m}-${d}`} 
        title={inRange ? `${dayNum} ${SHORT_M[m]}` : undefined}
        className={dotClass}
        onClick={() => inRange && toggleDay(dateStr)}
      >
        <span className={isChecked ? "text-white" : "text-[var(--t-muted)]"}>{inRange ? dayNum : ""}</span>
      </div>
    );
  };

  const renderSheet = (year: number) => {
    const s = new Date(startDate + 'T00:00:00');
    const e = endDate ? new Date(endDate + 'T00:00:00') : null;
    const maxDays = 31;
    
    let yearChecked = 0;
    let yearTotal = 0;

    for (let m = 0; m < 12; m++) {
      const daysInMonth = getDaysInMonth(new Date(year, m));
      for (let d = 0; d < daysInMonth; d++) {
        const dateObj = new Date(year, m, d + 1);
        if (isInRange(dateObj)) {
          yearTotal++;
          if (checked[format(dateObj, "yyyy-MM-dd")]) yearChecked++;
        }
      }
    }

    const pct = yearTotal > 0 ? Math.round((yearChecked / yearTotal) * 100) : 0;
    
    const sheetStyle = {
      '--t-base': textColor,
      '--t-muted': `${textColor}99`, 
      '--t-border': `${textColor}33`, 
      '--t-hover': `${textColor}0D` 
    } as React.CSSProperties;

    return (
      <div 
        key={year} 
        className="relative overflow-hidden bg-white border border-gray-200 rounded-lg p-8 md:p-12 mb-8 shadow-sm print:border-none print:shadow-none print:p-8 aspect-[297/210]"
        style={sheetStyle}
      >
        {/* Tracker Background Image Layer */}
        {bgImage && (
          <img 
            src={bgImage}
            alt="Tracker Background"
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
            style={{ opacity: bgOpacity / 100 }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 text-[var(--t-base)]">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 pb-6 border-b border-[var(--t-border)] print:border-[var(--t-border)] gap-6">
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <input 
                  type="text"
                  value={trackerTitle}
                  onChange={(e) => {
                    setTrackerTitle(e.target.value);
                    saveState({ startDate, endDate, goal, trackerTitle: e.target.value, trackerQuote, checked, isGenerated });
                  }}
                  className="text-3xl md:text-4xl font-bold font-serif tracking-tight text-[var(--t-base)] bg-transparent border-none outline-none hover:bg-[var(--t-hover)] focus:bg-[var(--t-hover)] px-1 -ml-1 rounded transition-colors w-full print:p-0"
                />
                <span className="text-xl text-[var(--t-muted)] font-serif self-end pb-1 shrink-0">{year}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-[var(--t-muted)] font-medium px-1">
                <span>Start: <strong className="text-[var(--t-base)]">{format(s, "dd MMM yyyy")}</strong></span>
                {e && <span>Goal Date: <strong className="text-[var(--t-base)]">{format(e, "dd MMM yyyy")}</strong></span>}
              </div>
            </div>
            
            <div className="w-full md:w-[280px] shrink-0 md:text-right">
              <textarea 
                value={trackerQuote}
                onChange={(e) => {
                  setTrackerQuote(e.target.value);
                  saveState({ startDate, endDate, goal, trackerTitle, trackerQuote: e.target.value, checked, isGenerated });
                }}
                rows={2}
                className="text-sm md:text-sm text-[var(--t-muted)] font-medium italic bg-transparent border-none outline-none w-full md:text-right resize-none hover:bg-[var(--t-hover)] focus:bg-[var(--t-hover)] p-1 -mr-1 rounded transition-colors print:p-0"
              />
            </div>
          </div>

          {goal && (
            <div className="border-l-2 border-[var(--t-base)] pl-4 py-1 text-sm text-[var(--t-muted)] mb-10 italic">
              "<strong className="text-[var(--t-base)] font-semibold text-base not-italic">{goal}</strong>"
            </div>
          )}

          {/* HORIZONTAL LAYOUT (Rows = Months, Cols = Days) */}
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="flex gap-1.5 md:gap-2 ml-[45px] md:ml-[55px]">
              {Array.from({ length: maxDays }).map((_, d) => (
                <div key={`num-col-${d}`} className="flex-1 aspect-square flex items-center justify-center text-[9px] md:text-[11px] font-bold text-[var(--t-muted)]">
                  {d + 1}
                </div>
              ))}
            </div>
            
            {Array.from({ length: 12 }).map((_, m) => (
              <div key={`row-${m}`} className="flex items-center gap-1.5 md:gap-2 w-full">
                <div className="w-[45px] md:w-[55px] text-[10px] md:text-[12px] font-bold tracking-widest uppercase text-[var(--t-base)] text-right pr-3 border-r border-[var(--t-border)]">
                  {SHORT_M[m]}
                </div>
                {Array.from({ length: maxDays }).map((_, d) => (
                  <div key={`col-${d}`} className="flex-1 max-w-[35px] md:max-w-[45px]">
                    {renderDot(year, m, d)}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap justify-between items-center gap-6">
            <div className="flex flex-wrap gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black" />Completed</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 border-[1.5px] border-gray-600 bg-gray-50" />Today</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 border border-gray-300 bg-white" />Upcoming</div>
            </div>
            
            <div className="min-w-[200px]">
              <div className="text-xs text-gray-600 font-bold mb-2 text-right">{yearChecked} / {yearTotal} Days ({pct}%)</div>
              <div className="h-1.5 w-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-black transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getYearsToRender = () => {
    const sYear = new Date(startDate).getFullYear();
    const eYear = endDate ? new Date(endDate).getFullYear() : new Date(startDate).getFullYear() + (new Date(startDate).getMonth() > 0 ? 1 : 0);
    const years = [];
    for (let y = sYear; y <= eYear; y++) years.push(y);
    return years;
  };

  const renderStats = () => {
    const s = new Date(startDate + 'T00:00:00');
    const e = endDate ? new Date(endDate + 'T00:00:00') : null;
    let totalDays = 365;
    if (e) {
      totalDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }
    const completed = Object.keys(checked).length;
    const remaining = Math.max(0, totalDays - completed);
    const pct = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;

    return (
      <div className="flex flex-wrap gap-2 mt-4 print:hidden">
        <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium">{completed} completed</span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium">{remaining} remaining</span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-medium">{totalDays} total</span>
        {completed > 0 && <span className="bg-black text-white px-3 py-1 text-sm font-bold">{pct}% done</span>}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-y-auto pb-16 font-sans">
      <InteractiveBackground />
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative bg-white border border-gray-200 p-8 w-full max-w-md shadow-2xl">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 text-black flex items-center gap-2">
              <Settings className="w-5 h-5" /> 
              Print Layout Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Text & Grid Color</label>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 pl-4">
                  <span className="text-sm font-mono text-gray-500 font-bold flex-1 uppercase tracking-widest">{textColor}</span>
                  <input 
                    type="color" 
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      localStorage.setItem("tracky_textcolor", e.target.value);
                    }}
                    className="w-10 h-10 p-0 border-0 cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              {/* Wallpaper Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Background Image</label>
                <label className="flex items-center justify-center gap-2 cursor-pointer bg-gray-50 hover:bg-gray-100 py-3 border border-dashed border-gray-300 transition-all text-sm font-bold text-gray-600 w-full">
                  <Upload className="w-4 h-4" />
                  {bgImage ? "Change Image" : "Upload Image"}
                  <input type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                </label>
                {bgImage && (
                  <button 
                    onClick={() => { setBgImage(null); localStorage.removeItem("tracky_bg"); }}
                    className="mt-2 text-xs font-medium text-red-500 hover:text-red-700 w-full text-center"
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {/* Opacity Slider */}
              <div>
                <label className="flex justify-between text-sm font-bold text-gray-700 mb-3">
                  <span>Image Opacity</span>
                  <span>{bgOpacity}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={bgOpacity}
                  onChange={handleOpacityChange}
                  className="w-full accent-black bg-gray-200 h-1 appearance-none outline-none"
                />
                <p className="text-xs text-gray-500 mt-2 font-medium">Lower opacity makes grid lines pop for printing.</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="mt-8 w-full bg-black hover:bg-gray-900 py-3 text-white font-bold transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-8 print:p-0">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white border border-gray-200 px-6 py-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-white stroke-[2.5]"><circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-5"/></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-black">Tracky Printables</h1>
            </div>
          </div>
          
          <a 
            href="https://github.com/Sameer-Bagul/tracky" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
            title="Star on GitHub"
          >
            <GithubIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Star on GitHub</span>
          </a>
        </header>

        {/* Setup Panel */}
        {!isGenerated && (
          <div className="bg-white border border-gray-200 p-8 shadow-sm max-w-4xl mx-auto w-full print:hidden">
            <h2 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-6">Create New Tracker</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black">START DATE</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={e => setStartDate(e.target.value)}
                  className="h-12 bg-gray-50 border border-gray-200 px-4 text-black focus:outline-none focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-black">GOAL DATE <span className="text-gray-400 font-normal">(optional)</span></label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="h-12 bg-gray-50 border border-gray-200 px-4 text-black focus:outline-none focus:border-black transition-all"
                />
              </div>
              <div className="flex flex-col justify-end">
                <button 
                  onClick={handleGenerate}
                  className="h-12 w-full bg-black hover:bg-gray-900 text-white font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Generate
                </button>
              </div>
              <div className="md:col-span-3 flex flex-col gap-2">
                <label className="text-xs font-bold text-black">THEME / HABIT</label>
                <input 
                  type="text" 
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="e.g. 75 Hard, Daily Reading, Gym Consistency..."
                  className="h-12 bg-gray-50 border border-gray-200 px-4 text-black focus:outline-none focus:border-black transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tracker View */}
        {isGenerated && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            {/* Actions Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-black text-white hover:bg-gray-900 px-5 py-2.5 text-sm font-bold transition-all">
                  <Printer className="w-4 h-4" />
                  Print Tracker
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Layout Settings
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 bg-transparent text-gray-500 hover:text-black px-3 py-2.5 text-sm font-bold transition-all ml-2">
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>
              <div className="text-xs font-medium text-gray-400">Perfect for A4 landscape or portrait printing.</div>
            </div>
            
            {renderStats()}

            {/* Render Sheets */}
            <div className="flex flex-col gap-8 w-full mt-4">
              {getYearsToRender().map(year => renderSheet(year))}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
