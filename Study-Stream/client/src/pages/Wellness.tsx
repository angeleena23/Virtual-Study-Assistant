import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { TrendingUp, Award, Calendar, Heart } from "lucide-react";

const MOODS = [
  { emoji: "😖", label: "Stressed", color: "bg-red-100 hover:bg-red-200" },
  { emoji: "😕", label: "Anxious", color: "bg-orange-100 hover:bg-orange-200" },
  { emoji: "😐", label: "Okay", color: "bg-yellow-100 hover:bg-yellow-200" },
  { emoji: "🙂", label: "Good", color: "bg-green-100 hover:bg-green-200" },
  { emoji: "🤩", label: "Great", color: "bg-blue-100 hover:bg-blue-200" },
];

export default function Wellness() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-2xl font-heading font-bold">Wellness & Progress</h1>
          <p className="text-muted-foreground">Track your study habits and mental health.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Study Streak Card */}
          <Card className="border-none shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Calendar className="w-5 h-5" />
                 </div>
                 <CardTitle>Study Streak</CardTitle>
              </div>
              <CardDescription>Consistency is key to success!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-4 mb-6">
                 <span className="text-5xl font-bold font-heading">7</span>
                 <span className="text-muted-foreground mb-1">Days in a row</span>
              </div>
              
              <div className="flex justify-between gap-1 mb-2">
                 {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                       <div className={cn(
                          "w-8 h-24 rounded-full flex items-end justify-center overflow-hidden bg-secondary",
                          i < 5 ? "bg-primary/10" : "bg-secondary"
                       )}>
                          <div 
                            className="w-full bg-primary transition-all duration-1000" 
                            style={{ height: i < 7 ? `${Math.random() * 60 + 20}%` : '0%' }} 
                          />
                       </div>
                       <span className="text-xs text-muted-foreground font-medium">{day}</span>
                    </div>
                 ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="border-none shadow-md flex flex-col">
             <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                   <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                      <TrendingUp className="w-5 h-5" />
                   </div>
                   <CardTitle>Goal Progress</CardTitle>
                </div>
                <CardDescription>You're 75% of the way to your weekly goal.</CardDescription>
             </CardHeader>
             <CardContent className="flex-1 flex flex-col justify-center items-center py-8">
                <div className="relative w-48 h-48 flex items-center justify-center">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-secondary" />
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        stroke="currentColor" 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - 0.75)}
                        className="text-accent text-emerald-400" 
                        strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-4xl font-bold font-heading">75%</span>
                      <span className="text-xs text-muted-foreground">Completed</span>
                   </div>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Mental Health Check-in */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-card to-secondary/30">
          <CardHeader className="text-center">
             <div className="mx-auto w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 mb-4">
                <Heart className="w-6 h-6" />
             </div>
             <CardTitle className="text-xl">Mental Health Check-in</CardTitle>
             <CardDescription>How are you feeling right now?</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-4">
              {MOODS.map((mood, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMood(index)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 transform hover:scale-110",
                    mood.color,
                    selectedMood === index ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-lg" : "grayscale opacity-70 hover:grayscale-0 hover:opacity-100"
                  )}
                >
                  <span className="text-4xl filter drop-shadow-sm">{mood.emoji}</span>
                  <span className="text-xs font-medium text-foreground/80">{mood.label}</span>
                </button>
              ))}
            </div>
            
            {selectedMood !== null && (
              <div className="mt-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-500">
                <p className="text-lg font-medium text-primary">
                  "Believe you can and you're halfway there."
                </p>
                <p className="text-sm text-muted-foreground mt-1">- Theodore Roosevelt</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
