import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";
import StudyBuddy from "@/pages/StudyBuddy";
import ChatbotPage from "@/pages/ChatbotPage"; // New
import Summarizer from "@/pages/Summarizer";
import TodoList from "@/pages/TodoList";
import CalendarPage from "@/pages/Calendar";
import Wellness from "@/pages/Wellness";
import MentalHealthCheckIn from "@/pages/MentalHealthCheckIn"; // New

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/" component={Dashboard} />
      <Route path="/study-buddy" component={StudyBuddy} />
      <Route path="/chatbot" component={ChatbotPage} />
      <Route path="/summarizer" component={Summarizer} />
      <Route path="/todo" component={TodoList} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/wellness" component={Wellness} />
      <Route path="/mental-health" component={MentalHealthCheckIn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
