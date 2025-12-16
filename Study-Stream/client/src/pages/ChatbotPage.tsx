// ChatbotPage.tsx (Near the top with other imports)
import { sendMessageStream } from "@/lib/gemini"; // <-- Make sure this path is correct
// ...
import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import studyBuddyAvatar from "@assets/generated_images/cute_minimalist_3d_study_mascot.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI Study Buddy powered by Gemini. Ask me anything about your studies, need help summarizing a topic, or just want to chat!",
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

// ChatbotPage.tsx (The new handleSendMessage function)

const handleSendMessage = async () => {
  if (!inputValue.trim()) return;

  const userMsg: Message = {
    id: Date.now().toString(),
    role: "user",
    content: inputValue,
    timestamp: new Date(),
  };

  // 1. Immediately show the user's message
  setMessages((prev) => [...prev, userMsg]);
  const prompt = inputValue;
  setInputValue("");
  setIsTyping(true); // Show the "..." typing indicator

  try {
    let fullResponse = "";
    let isFirstChunk = true;
    let aiMessageId = (Date.now() + 1).toString(); 

    // 2. Call the real Gemini function!
    const stream = await sendMessageStream(prompt);

    // 3. Read the response chunk by chunk (for the typing effect)
    for await (const chunk of stream) {
      fullResponse += chunk;

      if (isFirstChunk) {
        // Add the initial message slot to the screen
        setMessages((prev) => [
          ...prev,
          { id: aiMessageId, role: "assistant", content: fullResponse, timestamp: new Date() },
        ]);
        isFirstChunk = false;
      } else {
        // Update the message slot with the new chunk of text
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.id === aiMessageId && lastMessage.role === "assistant") {
            lastMessage.content = fullResponse;
          }
          return newMessages;
        });
      }
    }
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    // Fallback message if something goes wrong
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "Oops! I encountered an error and couldn't get a response.",
        timestamp: new Date(),
      },
    ]);
  } finally {
    setIsTyping(false); // Hide the "..." typing indicator
  }
};

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto">
        <header className="mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10">
            <img src={studyBuddyAvatar} alt="Bot" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
              AI Study Buddy <Sparkles className="w-5 h-5 text-yellow-500" />
            </h1>
            <p className="text-muted-foreground">Powered by Gemini AI</p>
          </div>
        </header>

        <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm">
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3 max-w-[85%]",
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    msg.role === "assistant" ? "bg-white overflow-hidden" : "bg-primary text-primary-foreground"
                  )}>
                    {msg.role === "assistant" ? (
                       <img src={studyBuddyAvatar} alt="Bot" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === "assistant" 
                      ? "bg-white text-foreground rounded-tl-none" 
                      : "bg-primary text-primary-foreground rounded-tr-none"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 max-w-[85%]">
                   <div className="w-8 h-8 rounded-full bg-white border overflow-hidden shrink-0">
                      <img src={studyBuddyAvatar} alt="Bot" className="w-full h-full object-cover" />
                   </div>
                   <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                   </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 bg-background/50 border-t backdrop-blur-sm">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
              className="flex gap-2 relative"
            >
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your AI study buddy anything..."
                className="pr-12 py-6 rounded-full border-muted-foreground/20 shadow-sm focus-visible:ring-primary/20 bg-white"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="absolute right-1 top-1 h-10 w-10 rounded-full"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
