import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: "Studies" | "Personal" | "Exam" | "Project";
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", text: "Read chapter 4 of History", completed: false, category: "Studies" },
    { id: "2", text: "Complete math assignment", completed: false, category: "Studies" },
    { id: "3", text: "Review lecture notes", completed: true, category: "Exam" },
    { id: "4", text: "Buy groceries", completed: false, category: "Personal" },
  ]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      category: "Personal" // Default
    };
    setTasks([...tasks, task]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "Studies": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "Exam": return "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200";
      case "Project": return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-heading font-bold">Tasks</h1>
            <p className="text-muted-foreground">Stay organized and focused.</p>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            {tasks.filter(t => t.completed).length}/{tasks.length} Completed
          </p>
        </header>

        <Card className="border-none shadow-md overflow-hidden">
          <CardHeader className="bg-secondary/30 pb-4">
             <div className="flex gap-2">
                <Input 
                  placeholder="Add a new task..." 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="bg-white border-transparent focus:border-primary/20 shadow-sm"
                />
                <Button onClick={addTask} size="icon" className="shrink-0">
                  <Plus className="w-5 h-5" />
                </Button>
             </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {tasks.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No tasks yet. Enjoy your free time!
                </div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "flex items-center gap-4 p-4 transition-colors hover:bg-muted/30 group",
                      task.completed && "bg-muted/10"
                    )}
                  >
                    <Checkbox 
                      checked={task.completed} 
                      onCheckedChange={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded-full border-2 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium truncate transition-all",
                        task.completed && "text-muted-foreground line-through decoration-muted-foreground/50"
                      )}>
                        {task.text}
                      </p>
                    </div>
                    
                    <Badge variant="outline" className={cn("hidden sm:inline-flex border", getCategoryColor(task.category))}>
                      {task.category}
                    </Badge>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
