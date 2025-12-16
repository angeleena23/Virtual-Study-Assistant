import { Link } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, FileText, CheckSquare, Calendar, Heart, ArrowRight } from "lucide-react";
import studyBuddyAvatar from "@assets/generated_images/cute_minimalist_3d_study_mascot.png";
import { cn } from "@/lib/utils";

const FEATURES = [
  { title: "Virtual Study Buddy", icon: MessageSquare, href: "/chatbot", color: "text-blue-500", desc: "Get help with your homework" },
  { title: "AI Text Summarizer", icon: FileText, href: "/summarizer", color: "text-purple-500", desc: "Summarize long texts instantly" },
  { title: "To-Do List", icon: CheckSquare, href: "/todo", color: "text-green-500", desc: "Manage your tasks" },
  { title: "Calendar", icon: Calendar, href: "/calendar", color: "text-orange-500", desc: "Track deadlines" },
  { title: "Wellness Check-in", icon: Heart, href: "/mental-health", color: "text-red-500", desc: "Track your mental health" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Good Morning, Student</h1>
            <p className="text-muted-foreground">Ready to be productive today?</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="text-right hidden md:block">
                <p className="text-sm font-medium">Study Streak</p>
                <p className="text-xs text-muted-foreground">7 Days 🔥</p>
             </div>
          </div>
        </header>

        {/* Hero / Study Buddy Promo */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-primary text-primary-foreground border-none shadow-lg overflow-hidden relative">
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
               <div className="w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>
            <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 space-y-4 text-center md:text-left">
                <h2 className="text-2xl font-heading font-bold">Need help with a topic?</h2>
                <p className="text-primary-foreground/80 text-lg">Your AI Study Buddy is here to answer questions and explain concepts.</p>
                <Link href="/chatbot">
                  <Button variant="secondary" size="lg" className="mt-2 font-semibold">
                    Start Chatting <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className="w-40 h-40 shrink-0 rounded-full border-4 border-white/20 shadow-xl overflow-hidden bg-white/10 backdrop-blur">
                  <img src={studyBuddyAvatar} alt="Study Buddy" className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-center items-center p-6 text-center space-y-4 bg-accent/30 border-none shadow-sm hover:shadow-md transition-all">
             <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
                <Heart className="w-8 h-8" />
             </div>
             <div>
                <h3 className="font-heading font-semibold text-lg">How are you feeling?</h3>
                <p className="text-sm text-muted-foreground">Take a moment to check in.</p>
             </div>
             <Link href="/mental-health">
                <Button variant="outline" className="w-full border-accent-foreground/20 hover:bg-accent">Check In</Button>
             </Link>
          </Card>
        </div>

        {/* Quick Links Grid */}
        <div>
          <h3 className="text-xl font-heading font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.slice(1, 5).map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <a className="block group">
                  <Card className="h-full hover:shadow-md transition-all duration-300 border-none bg-secondary/50 hover:bg-secondary">
                    <CardHeader className="pb-2">
                       <feature.icon className={cn("w-8 h-8 mb-2 transition-transform group-hover:scale-110 duration-300", feature.color)} />
                       <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
