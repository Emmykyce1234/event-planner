import React, { useState, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { PlusCircle, Search, CalendarDays, Loader2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    import { supabase } from '@/lib/supabaseClient';
    import EventForm from '@/components/events/EventForm';
    import EventCard from '@/components/events/EventCard';
    
    const EventsPage = () => {
      const { user } = useAuth();
      const { toast } = useToast();
      const [events, setEvents] = useState([]);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [currentEvent, setCurrentEvent] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [isLoading, setIsLoading] = useState(true);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submittingEventId, setSubmittingEventId] = useState(null);

      const fetchEvents = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: true });

          if (error) throw error;
          setEvents(data || []);
        } catch (error) {
          toast({ title: "Error fetching events", description: error.message, variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      }, [user, toast]);

      useEffect(() => {
        fetchEvents();
      }, [fetchEvents]);

      const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        setSubmittingEventId(currentEvent?.id || null);
        try {
          if (currentEvent) {
            const { data, error } = await supabase
              .from('events')
              .update({ ...formData })
              .eq('id', currentEvent.id)
              .select()
              .single();
            if (error) throw error;
            setEvents(prevEvents => prevEvents.map(e => e.id === currentEvent.id ? data : e).sort((a,b) => new Date(a.date) - new Date(b.date)));
            toast({ title: "Success", description: "Event updated successfully!" });
          } else {
            const { data, error } = await supabase
              .from('events')
              .insert([{ ...formData, user_id: user.id }])
              .select()
              .single();
            if (error) throw error;
            setEvents(prevEvents => [...prevEvents, data].sort((a,b) => new Date(a.date) - new Date(b.date)));
            toast({ title: "Success", description: "Event added successfully!" });
          }
          setIsModalOpen(false);
          setCurrentEvent(null);
        } catch (error) {
          toast({ title: `Error ${currentEvent ? 'updating' : 'adding'} event`, description: error.message, variant: "destructive" });
        } finally {
          setIsSubmitting(false);
          setSubmittingEventId(null);
        }
      };
      
      const openEditModal = (event) => {
        setCurrentEvent(event);
        setIsModalOpen(true);
      };

      const openAddModal = () => {
        setCurrentEvent(null);
        setIsModalOpen(true);
      };
      
      const closeModal = () => {
        setIsModalOpen(false);
        setCurrentEvent(null);
      }

      const handleDeleteEvent = async (eventId) => {
        setIsSubmitting(true);
        setSubmittingEventId(eventId);
        try {
          const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);

          if (error) throw error;

          setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
          toast({ title: "Success", description: "Event deleted successfully." });
        } catch (error) {
          toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
        } finally {
          setIsSubmitting(false);
          setSubmittingEventId(null);
        }
      };

      const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.07 }
        }
      };

      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <header className="flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">My Events</h1>
            <div className="flex flex-col sm:flex-row gap-2 items-center w-full md:w-auto">
              <div className="relative flex-grow w-full sm:flex-grow-0 sm:w-auto">
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
                if (!isOpen) closeModal();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] glassmorphism text-foreground border-border">
                  <EventForm 
                    event={currentEvent} 
                    onSubmit={handleFormSubmit} 
                    onCancel={closeModal}
                    isSubmitting={isSubmitting}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {isLoading && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-spin" />
            </div>
          )}

          {!isLoading && filteredEvents.length === 0 && !searchTerm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 glassmorphism rounded-lg"
            >
              <CalendarDays className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">No events yet!</h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">Click "Add Event" to start planning.</p>
            </motion.div>
          )}

          {!isLoading && filteredEvents.length === 0 && searchTerm && (
             <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 glassmorphism rounded-lg"
            >
              <Search className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">No events found</h2>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base">Try a different search term.</p>
            </motion.div>
          )}

          {!isLoading && filteredEvents.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              <AnimatePresence>
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event.id}
                    event={event} 
                    onEdit={openEditModal} 
                    onDelete={handleDeleteEvent}
                    isSubmitting={isSubmitting}
                    currentEventId={submittingEventId}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default EventsPage;