import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { Loader2 } from 'lucide-react';

    const EventForm = ({ event, onSubmit, onCancel, isSubmitting }) => {
      const [eventName, setEventName] = useState('');
      const [eventDate, setEventDate] = useState('');
      const [eventLocation, setEventLocation] = useState('');
      const [eventDescription, setEventDescription] = useState('');
      const { toast } = useToast();

      useEffect(() => {
        if (event) {
          setEventName(event.name || '');
          setEventDate(event.date || '');
          setEventLocation(event.location || '');
          setEventDescription(event.description || '');
        } else {
          setEventName('');
          setEventDate('');
          setEventLocation('');
          setEventDescription('');
        }
      }, [event]);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!eventName.trim() || !eventDate) {
          toast({ title: "Validation Error", description: "Event name and date are required.", variant: "destructive" });
          return;
        }
        onSubmit({
          name: eventName,
          date: eventDate,
          location: eventLocation,
          description: eventDescription,
        });
      };

      return (
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-semibold">{event ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {event ? 'Update the details of your event.' : 'Fill in the details for your new event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              placeholder="Event Name" 
              value={eventName} 
              onChange={(e) => setEventName(e.target.value)} 
              className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"
              required
            />
            <Input 
              type="date" 
              placeholder="Event Date" 
              value={eventDate} 
              onChange={(e) => setEventDate(e.target.value)} 
              className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"
              required
            />
            <Input 
              placeholder="Location (Optional)" 
              value={eventLocation} 
              onChange={(e) => setEventLocation(e.target.value)} 
              className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"
            />
            <Textarea 
              placeholder="Description (Optional)" 
              value={eventDescription} 
              onChange={(e) => setEventDescription(e.target.value)} 
              className="bg-secondary border-border focus:border-primary text-foreground placeholder-muted-foreground"
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onCancel} className="text-foreground border-border hover:bg-secondary w-full sm:w-auto" disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? (isSubmitting ? 'Saving...' : 'Save Changes') : (isSubmitting ? 'Adding...' : 'Add Event')}
            </Button>
          </DialogFooter>
        </form>
      );
    };

    export default EventForm;