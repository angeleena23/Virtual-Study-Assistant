import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Play, Pause, RotateCcw, Settings, MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import studyVideo from "@assets/generated_videos/cute_3d_koala_studying_and_writing_in_cozy_room_lo-fi.mp4"; // We'll use the video now
import studyBuddyAvatar from "@assets/generated_images/cute_minimalist_3d_study_mascot.png";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";

// Types
type TimerMode = "pomodoro" | "shortBreak" | "longBreak" | "custom";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function StudyBuddy() {
  // Timer State
  const [mode, setMode] = useState<TimerMode>("pomodoro");
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Custom Time Edit State
  const [editHours, setEditHours] = useState("00");
  const [editMinutes, setEditMinutes] = useState("25");
  const [editSeconds, setEditSeconds] = useState("00");

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", content: "Hi! I'm here to help you focus. Need any help with your studies?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or notification here
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Helpers
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const setTimerMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    setIsEditing(false);
    switch (newMode) {
      case "pomodoro":
        setTimeLeft(25 * 60);
        setEditMinutes("25");
        setEditSeconds("00");
        setEditHours("00");
        break;
      case "shortBreak":
        setTimeLeft(5 * 60);
        setEditMinutes("05");
        setEditSeconds("00");
        setEditHours("00");
        break;
      case "longBreak":
        setTimeLeft(15 * 60);
        setEditMinutes("15");
        setEditSeconds("00");
        setEditHours("00");
        break;
    }
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimerMode(mode); // This effectively resets it to the current mode's default
  };

  const handleTimeEdit = () => {
    const h = parseInt(editHours) || 0;
    const m = parseInt(editMinutes) || 0;
    const s = parseInt(editSeconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    setTimeLeft(totalSeconds);
    setIsEditing(false);
    setMode("custom");
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: Message = { id: Date.now().toString(), role: "user", content: chatInput };
    setMessages([...messages, newMsg]);
    setChatInput("");
    
    // Mock response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm focusing right now too! Let's get back to work. 🐨"
      }]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="relative h-[calc(100vh-8rem)] w-full rounded-3xl overflow-hidden shadow-2xl border border-border/50 group">
        
        {/* Immersive Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            src={studyVideo} 
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
        </div>

        {/* Floating Timer Widget */}
        <div className="absolute top-8 left-8 z-10 animate-in fade-in slide-in-from-left-4 duration-700">
          <Card className="w-80 bg-slate-900/90 border-slate-700 text-slate-50 backdrop-blur-md shadow-2xl">
            <CardContent className="p-6 space-y-6">
              {/* Header / Mode Selection */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span role="img" aria-label="fire" className="text-orange-500">🔥</span>
                  <span className="text-sm font-medium text-slate-300">1 Streak</span>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-slate-400 hover:text-white"
                    onClick={() => setIsEditing(!isEditing)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              {/* Timer Display */}
              <div className="text-center py-2">
                {isEditing ? (
                  <div className="flex items-center justify-center gap-2 text-3xl font-mono font-bold text-white">
                    <Input 
                      className="w-16 h-12 text-center bg-slate-800 border-slate-700 text-white p-0 text-2xl"
                      value={editHours}
                      onChange={(e) => setEditHours(e.target.value.slice(0, 2))}
                      placeholder="HH"
                    />
                    <span>:</span>
                    <Input 
                      className="w-16 h-12 text-center bg-slate-800 border-slate-700 text-white p-0 text-2xl"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(e.target.value.slice(0, 2))}
                      placeholder="MM"
                    />
                    <span>:</span>
                    <Input 
                      className="w-16 h-12 text-center bg-slate-800 border-slate-700 text-white p-0 text-2xl"
                      value={editSeconds}
                      onChange={(e) => setEditSeconds(e.target.value.slice(0, 2))}
                      placeholder="SS"
                    />
                  </div>
                ) : (
                  <div 
                    className="text-6xl font-mono font-bold tracking-tight text-white cursor-pointer hover:text-slate-200 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    {formatTime(timeLeft)}
                  </div>
                )}
                
                {isEditing && (
                   <Button size="sm" className="mt-4 w-full" onClick={handleTimeEdit}>Save Time</Button>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                   <Button 
                      className={cn(
                        "w-full font-semibold transition-all shadow-lg",
                        isActive 
                          ? "bg-slate-700 hover:bg-slate-600 text-white" 
                          : "bg-white text-slate-900 hover:bg-slate-200"
                      )}
                      size="lg"
                      onClick={toggleTimer}
                   >
                    {isActive ? (
                       <><Pause className="w-4 h-4 mr-2" /> Pause</>
                    ) : (
                       <><Play className="w-4 h-4 mr-2" /> Start</>
                    )}
                   </Button>
                </div>
                <Button variant="secondary" size="icon" className="h-10 w-10 bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700" onClick={resetTimer}>
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Modes */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[
                  { id: "pomodoro", label: "Pomodoro" },
                  { id: "shortBreak", label: "Short Break" },
                  { id: "longBreak", label: "Long Break" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setTimerMode(m.id as TimerMode)}
                    className={cn(
                      "text-xs font-medium py-1.5 rounded-md transition-colors",
                      mode === m.id 
                        ? "bg-slate-700 text-white" 
                        : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
