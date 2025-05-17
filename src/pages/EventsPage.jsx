import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { PlusCircle, Edit, Trash2, Search, CalendarDays } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    import { v4 as uuidv4 } from 'uuid';

    const EventsPage = () => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [events, setEvents] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentEvent, setCurrentEvent] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      const [eventName, setEventName] = useState('');
      const [eventDate, setEventDate] = useState('');
      const [eventLocation, setEventLocation] = useState('');
      const [eventDescription, setEventDescription] = useState('');

      useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem(`events_${user?.id}`)) || [];
        setEvents(storedEvents);
      }, [user]);

      const saveEvents = (updatedEvents) => {
        localStorage.setItem(`events_${user?.id}`, JSON.stringify(updatedEvents));
        setEvents(updatedEvents);
      };

      const resetForm = () => {
        setEventName('');
        setEventDate('');
        setEventLocation('');
        setEventDescription('');
      };

      const handleAddEvent = () => {
        if (!eventName || !eventDate) {
          toast({ title: "Error", description: "Event name and date are required.", variant: "destructive" });
          return;
        }
        const newEvent = { id: uuidv4(), name: eventName, date: eventDate, location: eventLocation, description: eventDescription };
        saveEvents([...events, newEvent]);
        toast({ title: "Success", description: "Event added successfully!" });
        setIsModalOpen(false);
        resetForm();
      };

      const handleEditEvent = (event) => {
        setCurrentEvent(event);
        setEventName(event.name);
        setEventDate(event.date);
        setEventLocation(event.location || '');
        setEventDescription(event.description || '');
        setIsModalOpen(true);
      };

      const handleUpdateEvent = () => {
        if (!eventName || !eventDate) {
          toast({ title: "Error", description: "Event name and date are required.", variant: "destructive" });
          return;
        }
        const updatedEvents = events.map(e => 
          e.id === currentEvent.id ? { ...e, name: eventName, date: eventDate, location: eventLocation, description: eventDescription } : e
        );
        saveEvents(updatedEvents);
        toast({ title: "Success", description: "Event updated successfully!" });
        setIsModalOpen(false);
        setCurrentEvent(null);
        resetForm();
      };

      const handleDeleteEvent = (eventId) => {
        const updatedEvents = events.filter(e => e.id !== eventId);
        saveEvents(updatedEvents);
        toast({ title: "Success", description: "Event deleted successfully." });
      };

      const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
            <h1 className="text-4xl font-bold text-foreground">My Events</h1>
            <div className="flex gap-2 items-center w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-card text-foreground placeholder-muted-foreground border-border focus:border-primary focus:ring-primary w-full"
                />
              </div>
              <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                setIsModalOpen(isOpen);
                if (!isOpen) {
                  setCurrentEvent(null);
                  resetForm();
                }
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glassmorphism text-foreground border-border">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">{currentEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      {currentEvent ? 'Update the details of your event.' : 'Fill in the details for your new event.'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"/>
                    <Input type="date" placeholder="Event Date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"/>
                    <Input placeholder="Location (Optional)" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"/>
                    <Textarea placeholder="Description (Optional)" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"/>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => { setIsModalOpen(false); setCurrentEvent(null); resetForm(); }} className="text-foreground border-border hover:bg-secondary">Cancel</Button>
                    <Button onClick={currentEvent ? handleUpdateEvent : handleAddEvent} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {currentEvent ? 'Save Changes' : 'Add Event'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {filteredEvents.length === 0 && !searchTerm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 glassmorphism rounded-lg"
            >
              <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No events yet!</h2>
              <p className="text-muted-foreground mb-4">Click "Add Event" to start planning.</p>
            </motion.div>
          )}

          {filteredEvents.length === 0 && searchTerm && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 glassmorphism rounded-lg"
            >
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">No events found</h2>
              <p className="text-muted-foreground mb-4">Try a different search term.</p>
            </motion.div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredEvents.map(event => (
                <motion.div key={event.id} variants={itemVariants} layout exit={{ opacity: 0, scale: 0.8 }}>
                  <Card className="glassmorphism shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full">
                    <CardHeader className="bg-card/70 pb-4">
                      <CardTitle className="text-xl font-semibold text-foreground">{event.name}</CardTitle>
                      <CardDescription className="text-primary">{new Date(event.date).toLocaleDateString()}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pt-4">
                      {event.location && <p className="text-sm text-muted-foreground mb-1"><span className="font-semibold text-foreground">Location:</span> {event.location}</p>}
                      {event.description && <p className="text-sm text-muted-foreground italic line-clamp-3">{event.description}</p>}
                      {!event.location && !event.description && <p className="text-sm text-muted-foreground/70 italic">No additional details.</p>}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 p-4 bg-card/70">
                      <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)} className="text-foreground border-border hover:bg-secondary">
                        <Edit className="mr-1 h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)} className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">
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

    export default EventsPage;