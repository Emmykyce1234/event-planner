
    import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { PlusCircle, Edit, Trash2, ListChecks, Search } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    import { v4 as uuidv4 } from 'uuid';

    const TasksPage = () => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [tasks, setTasks] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentTask, setCurrentTask] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      const [taskName, setTaskName] = useState('');
      const [taskDescription, setTaskDescription] = useState('');
      const [taskDueDate, setTaskDueDate] = useState('');

      useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem(`tasks_${user?.id}`)) || [];
        setTasks(storedTasks);
      }, [user]);

      const saveTasks = (updatedTasks) => {
        localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
      };

      const resetForm = () => {
        setTaskName('');
        setTaskDescription('');
        setTaskDueDate('');
      };

      const handleAddTask = () => {
        if (!taskName) {
          toast({ title: "Error", description: "Task name is required.", variant: "destructive" });
          return;
        }
        const newTask = { id: uuidv4(), name: taskName, description: taskDescription, dueDate: taskDueDate, completed: false };
        saveTasks([...tasks, newTask]);
        toast({ title: "Success", description: "Task added successfully!" });
        setIsModalOpen(false);
        resetForm();
      };

      const handleEditTask = (task) => {
        setCurrentTask(task);
        setTaskName(task.name);
        setTaskDescription(task.description || '');
        setTaskDueDate(task.dueDate || '');
        setIsModalOpen(true);
      };

      const handleUpdateTask = () => {
        if (!taskName) {
          toast({ title: "Error", description: "Task name is required.", variant: "destructive" });
          return;
        }
        const updatedTasks = tasks.map(t =>
          t.id === currentTask.id ? { ...t, name: taskName, description: taskDescription, dueDate: taskDueDate } : t
        );
        saveTasks(updatedTasks);
        toast({ title: "Success", description: "Task updated successfully!" });
        setIsModalOpen(false);
        setCurrentTask(null);
        resetForm();
      };

      const handleDeleteTask = (taskId) => {
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        saveTasks(updatedTasks);
        toast({ title: "Success", description: "Task deleted successfully." });
      };

      const toggleTaskCompletion = (taskId) => {
        const updatedTasks = tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        saveTasks(updatedTasks);
      };

      const filteredTasks = tasks.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-4xl font-bold text-white">My Tasks</h1>
            <div className="flex gap-2 items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/20 text-white placeholder-white/70 border-white/30 focus:border-purple-500 focus:ring-purple-500 w-full"
                />
              </div>
              <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                setIsModalOpen(isOpen);
                if (!isOpen) {
                  setCurrentTask(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsModalOpen(true)} className="bg-purple-500 hover:bg-purple-600 text-white">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glassmorphism text-white border-white/30">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{currentTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                    <DialogDescription className="text-white/80">
                      {currentTask ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} className="bg-white/10 border-white/20 focus:border-purple-400"/>
                    <Textarea placeholder="Description (Optional)" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="bg-white/10 border-white/20 focus:border-purple-400"/>
                    <Input type="date" placeholder="Due Date (Optional)" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="bg-white/10 border-white/20 focus:border-purple-400"/>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setIsModalOpen(false); setCurrentTask(null); resetForm();}} className="text-white border-white/50 hover:bg-white/10">Cancel</Button>
                    <Button onClick={currentTask ? handleUpdateTask : handleAddTask} className="bg-purple-500 hover:bg-purple-600">
                      {currentTask ? 'Save Changes' : 'Add Task'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {filteredTasks.length === 0 && !searchTerm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 glassmorphism rounded-lg"
            >
              <ListChecks className="mx-auto h-16 w-16 text-white/50 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No tasks yet!</h2>
              <p className="text-white/70 mb-4">Click "Add Task" to get started.</p>
            </motion.div>
          )}

          {filteredTasks.length === 0 && searchTerm && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 glassmorphism rounded-lg"
            >
              <Search className="mx-auto h-16 w-16 text-white/50 mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">No tasks found</h2>
              <p className="text-white/70 mb-4">Try a different search term.</p>
            </motion.div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.div key={task.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.8 }}>
                  <Card className={`glassmorphism shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full ${task.completed ? 'opacity-60' : ''}`}>
                    <CardHeader className="bg-white/5 pb-4 flex flex-row items-start justify-between">
                      <div>
                        <CardTitle className={`text-xl font-semibold text-white ${task.completed ? 'line-through' : ''}`}>{task.name}</CardTitle>
                        {task.dueDate && <p className={`text-sm text-purple-300 ${task.completed ? 'line-through' : ''}`}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                      </div>
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 border-white/50 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                    </CardHeader>
                    <CardContent className="flex-grow pt-4">
                      {task.description && <p className={`text-sm text-white/70 italic line-clamp-3 ${task.completed ? 'line-through' : ''}`}>{task.description}</p>}
                      {!task.description && <p className="text-sm text-white/60 italic">No description.</p>}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 p-4 bg-white/5">
                      <Button variant="outline" size="sm" onClick={() => handleEditTask(task)} disabled={task.completed} className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50">
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.id)} className="bg-red-500/80 hover:bg-red-600">
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      );
    };

    export default TasksPage;
  