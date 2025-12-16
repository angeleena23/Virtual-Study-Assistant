import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Clock, AlertCircle } from "lucide-react";

interface Deadline {
  id: number;
  title: string;
  date: Date;
  type: "high" | "medium";
  description?: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [deadlines, setDeadlines] = useState<Deadline[]>([
    { id: 1, title: "Essay Submission", date: new Date(), type: "high" },
    { id: 2, title: "Math Quiz", date: new Date(new Date().setDate(new Date().getDate() + 2)), type: "medium" },
    { id: 3, title: "Project Presentation", date: new Date(new Date().setDate(new Date().getDate() + 5)), type: "high" },
  ]);
  
  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDeadline = () => {
    if (!newTitle || !newDate) return;

    const newDeadline: Deadline = {
        id: Date.now(),
        title: newTitle,
        date: new Date(newDate),
        type: "medium", // Default type for now
        description: newDesc
    };

    setDeadlines([...deadlines, newDeadline].sort((a, b) => a.date.getTime() - b.date.getTime()));
    
    // Reset and close
    setNewTitle("");
    setNewDate("");
    setNewDesc("");
    setIsDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-heading font-bold">Calendar</h1>
            <p className="text-muted-foreground">Keep track of your deadlines.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Deadline
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Deadline</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                    placeholder="e.g. History Essay" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Details about the deadline..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddDeadline}>Save Deadline</Button>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 border-none shadow-md">
            <CardContent className="p-6">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none w-full"
                modifiers={{
                    deadline: deadlines.map(d => d.date)
                }}
                modifiersStyles={{
                    deadline: { fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary)' }
                }}
                classNames={{
                   month: "space-y-4 w-full",
                   table: "w-full border-collapse space-y-1",
                   head_row: "flex w-full justify-between",
                   row: "flex w-full mt-2 justify-between",
                   cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                   day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-full",
                   day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                   day_today: "bg-accent text-accent-foreground",
                }}
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-white">
            <CardHeader>
              <CardTitle>Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deadlines.map((deadline) => (
                <div key={deadline.id} className="flex gap-3 items-start p-3 rounded-lg bg-secondary/30 border border-transparent hover:border-border transition-all">
                  <div className={`mt-1 w-2 h-2 rounded-full ${deadline.type === 'high' ? 'bg-red-400' : 'bg-orange-400'}`} />
                  <div>
                    <h4 className="font-medium text-sm">{deadline.title}</h4>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {deadline.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {deadline.type === 'high' && (
                     <AlertCircle className="w-4 h-4 text-red-400 ml-auto" />
                  )}
                </div>
              ))}
              
              <div className="pt-4 text-center">
                 <Button variant="link" size="sm" className="text-muted-foreground">View All</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
