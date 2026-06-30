"use client";

import React, { useState, useEffect } from "react";
import { Plus, Printer, RotateCcw, Settings, X, Upload, Download, LayoutTemplate, HelpCircle } from "lucide-react";
import { format, getDaysInMonth } from "date-fns";
import html2canvas from "html2canvas";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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
  const [dateTextColor, setDateTextColor] = useState<string>("#9ca3af");
  const [paperSize, setPaperSize] = useState<string>("A4");
  const [cellShape, setCellShape] = useState<string>("square");
  const [cellTextColor, setCellTextColor] = useState<string>("#ffffff");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const today = new Date();
    setStartDate(format(today, "yyyy-MM-dd"));
    
    const savedBg = localStorage.getItem("tracky_bg");
    if (savedBg) setBgImage(savedBg);

    const savedOpacity = localStorage.getItem("tracky_opacity");
    if (savedOpacity) setBgOpacity(parseInt(savedOpacity, 10));

    const savedTextColor = localStorage.getItem("tracky_textcolor");
    if (savedTextColor) setTextColor(savedTextColor);
    
    const savedDateTextColor = localStorage.getItem("tracky_date_text_color");
    if (savedDateTextColor) setDateTextColor(savedDateTextColor);
    
    const savedPaper = localStorage.getItem("tracky_paper");
    if (savedPaper) setPaperSize(savedPaper);
    
    const savedCellShape = localStorage.getItem("tracky_cell_shape");
    if (savedCellShape) setCellShape(savedCellShape);

    const savedCellTextColor = localStorage.getItem("tracky_cell_text_color");
    if (savedCellTextColor) setCellTextColor(savedCellTextColor);
    
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
    
    setIsMounted(true);
  }, []);

  // Driver.js Onboarding Tour
  useEffect(() => {
    if (!isMounted) return;

    if (!isGenerated) {
      const seenSetup = localStorage.getItem("tracky_tour_setup");
      if (!seenSetup) {
        const d = driver({
          showProgress: true,
          steps: [
            { element: '#setup-start-date', popover: { title: '1. Timeframe', description: 'Pick when you want your habit tracking to begin.', side: "top" } },
            { element: '#setup-goal', popover: { title: '2. Your Mission', description: 'What habit are you building? Keep it simple.', side: "top" } },
            { element: '#setup-generate', popover: { title: '3. Generate', description: 'Click here to mathematically construct your printable canvas!', side: "top" } }
          ]
        });
        setTimeout(() => d.drive(), 500);
        localStorage.setItem("tracky_tour_setup", "true");
      }
    } else {
      const seenCanvas = localStorage.getItem("tracky_tour_canvas");
      if (!seenCanvas) {
        const d = driver({
          showProgress: true,
          steps: [
            { element: '#tracker-title-edit', popover: { title: 'Editable Metadata', description: 'Click directly on the text to personalize your tracker in real-time.', side: "bottom" } },
            { element: '#tracker-grid', popover: { title: 'The Grid', description: 'Click any day to mark it as complete. The UI automatically handles the math.', side: "top" } },
            { element: '#layout-settings-btn', popover: { title: 'Customization Engine', description: 'Change grid shapes, add background wallpapers, and fine-tune your colors.', side: "bottom" } },
            { element: '#export-hd-btn', popover: { title: 'Export & Print', description: 'Ready for the wall? Export a high-resolution image designed strictly for perfect printer alignment.', side: "bottom" } }
          ]
        });
        setTimeout(() => d.drive(), 500);
        localStorage.setItem("tracky_tour_canvas", "true");
      }
    }
  }, [isGenerated, isMounted]);

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

  const getAspectRatio = (size: string) => {
    switch(size) {
      case 'US Letter': return '11 / 8.5';
      case 'US Legal': return '14 / 8.5';
      default: return '297 / 210'; // A4 and A3 have the same ratio
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const years = getYearsToRender();
      for (const year of years) {
        const element = document.getElementById(`tracker-sheet-${year}`);
        if (!element) continue;
        
        const canvas = await html2canvas(element, {
          scale: 4, // 4x resolution for High-Definition 300+ DPI printing
          useCORS: true,
          backgroundColor: '#ffffff'
        });
        
        const image = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement('a');
        link.download = `Tracky_${paperSize.replace(' ', '_')}_${year}.png`;
        link.href = image;
        link.click();
      }
    } catch (e) {
      alert("Failed to export high-definition image. Please try again.");
    } finally {
      setIsExporting(false);
    }
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

    let dotClass = `w-full aspect-square border transition-all duration-150 flex items-center justify-center text-[8px] md:text-[10px] font-medium select-none ${cellShape === 'circle' ? 'rounded-full' : ''} `;
    
    if (!inRange) {
      dotClass += "opacity-10 border-[var(--t-border)] bg-transparent";
    } else {
      dotClass += "cursor-pointer hover:border-[var(--t-base)] ";
      if (isChecked) {
        dotClass += "bg-[var(--t-base)] border-[var(--t-base)]";
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
        <span style={{ color: isChecked ? cellTextColor : dateTextColor }}>{inRange ? dayNum : ""}</span>
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
        id={`tracker-sheet-${year}`}
        className="relative overflow-hidden bg-white border border-gray-200 rounded-lg p-8 md:p-12 mb-8 shadow-sm print:border-none print:shadow-none print:p-8"
        style={{ ...sheetStyle, aspectRatio: getAspectRatio(paperSize) }}
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
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 pb-6 border-b border-[var(--t-border)] print:border-[var(--t-border)] gap-6" id="tracker-title-edit">
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
          <div className="flex flex-col gap-1.5 md:gap-2" id="tracker-grid">
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

          {/* Footer Stats - Hidden during export */}
          <div data-html2canvas-ignore="true" className="mt-12 pt-6 border-t border-[var(--t-border)] flex flex-wrap justify-between items-center gap-6">
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
              {/* Paper Dimensions */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Paper Dimensions</label>
                <select
                  value={paperSize}
                  onChange={(e) => {
                    setPaperSize(e.target.value);
                    localStorage.setItem("tracky_paper", e.target.value);
                  }}
                  className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold text-gray-700 outline-none hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <option value="A4">A4 (297 × 210 mm)</option>
                  <option value="A3">A3 (420 × 297 mm)</option>
                  <option value="US Letter">US Letter (11 × 8.5 in)</option>
                  <option value="US Legal">US Legal (14 × 8.5 in)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2 font-medium">Layout ratio adjusts automatically for perfect printing.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Main Text & Grid Color</label>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 pl-4 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                  <span className="text-gray-400 font-bold">#</span>
                  <input 
                    type="text" 
                    value={textColor.replace('#', '')}
                    onChange={(e) => {
                      const hex = `#${e.target.value.replace('#', '')}`;
                      setTextColor(hex);
                      if (hex.match(/^#[0-9A-Fa-f]{6}$/)) localStorage.setItem("tracky_textcolor", hex);
                    }}
                    className="text-sm font-mono text-gray-700 font-bold flex-1 uppercase tracking-widest bg-transparent outline-none w-full"
                    maxLength={6}
                  />
                  <input 
                    type="color" 
                    value={textColor}
                    onChange={(e) => {
                      setTextColor(e.target.value);
                      localStorage.setItem("tracky_textcolor", e.target.value);
                    }}
                    className="w-8 h-8 p-0 border-0 cursor-pointer bg-transparent rounded shadow-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Dates Text Color (Unfilled)</label>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 pl-4 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                  <span className="text-gray-400 font-bold">#</span>
                  <input 
                    type="text" 
                    value={dateTextColor.replace('#', '')}
                    onChange={(e) => {
                      const hex = `#${e.target.value.replace('#', '')}`;
                      setDateTextColor(hex);
                      if (hex.match(/^#[0-9A-Fa-f]{6}$/)) localStorage.setItem("tracky_date_text_color", hex);
                    }}
                    className="text-sm font-mono text-gray-700 font-bold flex-1 uppercase tracking-widest bg-transparent outline-none w-full"
                    maxLength={6}
                  />
                  <input 
                    type="color" 
                    value={dateTextColor}
                    onChange={(e) => {
                      setDateTextColor(e.target.value);
                      localStorage.setItem("tracky_date_text_color", e.target.value);
                    }}
                    className="w-8 h-8 p-0 border-0 cursor-pointer bg-transparent rounded shadow-sm"
                  />
                </div>
              </div>

              {/* Cell Shape */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Date Shape</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCellShape("square");
                      localStorage.setItem("tracky_cell_shape", "square");
                    }}
                    className={`flex-1 py-2 text-sm font-bold border ${cellShape === 'square' ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Square
                  </button>
                  <button 
                    onClick={() => {
                      setCellShape("circle");
                      localStorage.setItem("tracky_cell_shape", "circle");
                    }}
                    className={`flex-1 py-2 text-sm font-bold border rounded-full ${cellShape === 'circle' ? 'border-black bg-black text-white' : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                  >
                    Circle
                  </button>
                </div>
              </div>

              {/* Cell Text Color */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Filled Text Color</label>
                <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 p-2 pl-4 rounded-lg focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                  <span className="text-gray-400 font-bold">#</span>
                  <input 
                    type="text" 
                    value={cellTextColor.replace('#', '')}
                    onChange={(e) => {
                      const hex = `#${e.target.value.replace('#', '')}`;
                      setCellTextColor(hex);
                      if (hex.match(/^#[0-9A-Fa-f]{6}$/)) localStorage.setItem("tracky_cell_text_color", hex);
                    }}
                    className="text-sm font-mono text-gray-700 font-bold flex-1 uppercase tracking-widest bg-transparent outline-none w-full"
                    maxLength={6}
                  />
                  <input 
                    type="color" 
                    value={cellTextColor}
                    onChange={(e) => {
                      setCellTextColor(e.target.value);
                      localStorage.setItem("tracky_cell_text_color", e.target.value);
                    }}
                    className="w-8 h-8 p-0 border-0 cursor-pointer bg-transparent rounded shadow-sm"
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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                localStorage.removeItem("tracky_tour_setup");
                localStorage.removeItem("tracky_tour_canvas");
                window.location.reload();
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-black transition-colors"
              title="Restart Tutorial"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tour</span>
            </button>
            <a 
              href="https://github.com/Sameer-Bagul/tracky" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold text-gray-600 hover:text-black transition-colors"
              title="Star on GitHub"
            >
              <GithubIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </header>

        {/* Setup Panel */}
        {!isGenerated && (
          <div className="max-w-4xl mx-auto w-full print:hidden mt-8 md:mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white border border-gray-200 shadow-2xl shadow-black/5 rounded-3xl p-8 md:p-16 overflow-hidden relative">
              
              {/* Decorative top gradient */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-300" />
              
              <div className="mb-12 text-center">
                <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <LayoutTemplate className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-3">Design Your Tracker</h2>
                <p className="text-base text-gray-500 font-medium max-w-lg mx-auto">Configure your mission timeline to generate a high-definition, mathematically perfect A4 tracking canvas.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="flex flex-col gap-3" id="setup-start-date">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 ml-1">Start Date</label>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-5 text-black font-bold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm w-full"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 ml-1">Goal Date <span className="text-gray-400 font-normal lowercase tracking-normal">(optional)</span></label>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-5 text-black font-bold focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm w-full"
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-3" id="setup-goal">
                  <label className="text-xs font-bold tracking-widest uppercase text-gray-500 ml-1">Theme / Mission</label>
                  <input 
                    type="text" 
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    placeholder="e.g., 75 Hard, Read 20 Pages Daily, Gym Consistency..."
                    className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-5 text-black font-bold placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm w-full"
                  />
                </div>
              </div>

              <button 
                id="setup-generate"
                onClick={handleGenerate}
                className="h-16 w-full bg-black hover:bg-gray-900 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/20 hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 text-lg"
              >
                <Plus className="w-6 h-6" />
                Generate Tracking Canvas
              </button>
            </div>
          </div>
        )}

        {/* Tracker View */}
        {isGenerated && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden px-4 md:px-0">
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  id="export-hd-btn"
                  onClick={handleExport} 
                  disabled={isExporting}
                  className="flex items-center gap-2 bg-black text-white hover:bg-gray-900 px-6 py-3 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:hover:translate-y-0 hover:-translate-y-0.5"
                >
                  {isExporting ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isExporting ? "Rendering HD Image..." : "Export HD Image"}
                </button>
                <button 
                  id="layout-settings-btn"
                  onClick={() => setIsSettingsOpen(true)}
                  className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 px-6 py-3 rounded-lg text-sm font-bold text-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                  <Settings className="w-4 h-4" />
                  Layout Settings
                </button>
                <button onClick={handleReset} className="flex items-center gap-2 bg-transparent text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-3 rounded-lg text-sm font-bold transition-all ml-2">
                  <RotateCcw className="w-4 h-4" />
                  Start Over
                </button>
              </div>

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
