import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => { // MODIFIED: Made function asynchronous to support API call
    if (!text.trim()) return;

    // Retrieve the API Base URL from the client's environment variables
    // This assumes you have VITE_API_BASE_URL="http://localhost:8080" in your client/.env.local
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const endpoint = `${API_BASE_URL}/api/summarize`;

    setSummary(""); // Clear previous summary
    setIsLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // Send the input text to the server
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Assuming the server returns the summary in a 'summary' field
      setSummary(data.summary || "Error: Received empty summary from server.");
      
    } catch (error) {
      console.error("Summarization failed:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the summarization service. Check if server (port 8080) is running.",
        variant: "destructive",
      });
      setSummary("Error: Could not retrieve a summary. Check your server status and the VITE_API_BASE_URL in client/.env.local.");
    } finally {
      setIsLoading(false);
    }
  }; // END OF MODIFIED FUNCTION

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Summary copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-heading font-bold">AI Text Summarizer</h1>
          <p className="text-muted-foreground">Condense long articles into key bullet points.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
          <Card className="flex flex-col border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Input Text</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <Textarea 
                placeholder="Paste your text here (up to 5000 characters)..." 
                className="flex-1 resize-none border-muted p-4 leading-relaxed focus:ring-primary/20"
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={5000}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{text.length}/5000 characters</span>
                <Button onClick={handleSummarize} disabled={!text.trim() || isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Summarizing...
                    </>
                  ) : (
                    "Summarize Text"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col border-none shadow-md bg-secondary/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">Summary</CardTitle>
              {summary && (
                <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-6">
              {summary ? (
                <div className="prose prose-sm max-w-none text-foreground leading-loose whitespace-pre-line animate-in fade-in duration-500">
                  {summary}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground/50 text-center p-8 border-2 border-dashed border-muted-foreground/10 rounded-lg">
                  <FileText className="w-12 h-12 mb-3 opacity-20" />
                  <p>Your summary will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}