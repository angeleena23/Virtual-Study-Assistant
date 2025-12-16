import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import mentalHealthAvatar from "@assets/generated_images/minimalist_3d_snoopy-style_mascot_writing.png"; // Placeholder for Snoopy
import mentalHealthUser from "@assets/generated_images/minimalist_3d_snoopy-style_mascot_standing.png"; // Placeholder for User icon

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function MentalHealthCheckIn() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello there. I'm here to listen. How stressed do you feel today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Mock response
    setTimeout(() => {
      const responses = [
        "It's completely okay to feel that way. Remember to take deep breaths.",
        "I understand. Sometimes things can get overwhelming. Have you taken a break recently?",
        "Thank you for sharing that with me. Writing it down is a great first step.",
        "You're doing great, even if it feels tough right now. One step at a time.",
        "Is there anything specific that's on your mind?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-heading font-bold">Mental Health Check-in</h1>
          <p className="text-muted-foreground">A safe space to share your feelings.</p>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Background color similar to the reference image */}
            <div className="absolute inset-0 bg-[#A0A0A0] rounded-3xl -z-10" />

            <ScrollArea className="flex-1 p-4 md:p-8">
            <div className="space-y-12">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-center gap-4 max-w-[90%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 shadow-lg border-2 border-white/20">
                     <img 
                        src={msg.role === "assistant" ? mentalHealthAvatar : mentalHealthUser} 
                        alt="Avatar" 
                        className="w-full h-full object-cover" 
                     />
                  </div>
                  
                  <div className={cn(
                    "px-6 py-4 rounded-full text-sm font-medium shadow-md text-center min-w-[200px]",
                    "bg-[#FF6B6B] text-white" // Coral/Red color from reference
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-center gap-4 max-w-[90%]">
                   <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 shadow-lg border-2 border-white/20">
                      <img src={mentalHealthAvatar} alt="Avatar" className="w-full h-full object-cover" />
                   </div>
                   <div className="px-6 py-4 rounded-full bg-[#FF6B6B] text-white shadow-md flex items-center gap-1">
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                   </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-6">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-2 relative max-w-2xl mx-auto"
            >
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your feelings here..."
                className="pr-12 py-6 rounded-full border-none shadow-xl bg-white/90 focus-visible:ring-0 text-center placeholder:text-center"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 rounded-full bg-[#FF6B6B] hover:bg-[#FF5252]"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
