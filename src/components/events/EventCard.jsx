import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { Edit, Trash2, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';

    const EventCard = ({ event, onEdit, onDelete, isSubmitting, currentEventId }) => {
      const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 }
      };
      
      const isCurrentlySubmittingThisCard = isSubmitting && currentEventId === event.id;

      return (
        <motion.div 
          key={event.id} 
          variants={itemVariants} 
          layout 
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        >
          <Card className="glassmorphism shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden flex flex-col h-full">
            <CardHeader className="bg-card/70 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-foreground truncate" title={event.name}>{event.name}</CardTitle>
              <CardDescription className="text-sm text-primary">{new Date(event.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow pt-3 sm:pt-4 space-y-2">
              {event.location && <p className="text-xs sm:text-sm text-muted-foreground"><span className="font-semibold text-foreground">Location:</span> {event.location}</p>}
              {event.description && <p className="text-xs sm:text-sm text-muted-foreground italic line-clamp-3">{event.description}</p>}
              {!event.location && !event.description && <p className="text-xs sm:text-sm text-muted-foreground/70 italic">No additional details.</p>}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 p-3 sm:p-4 bg-card/70">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit(event)} 
                className="text-foreground border-border hover:bg-secondary text-xs sm:text-sm" 
                disabled={isSubmitting}
              >
                <Edit className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDelete(event.id)} 
                className="bg-destructive/90 hover:bg-destructive text-destructive-foreground text-xs sm:text-sm" 
                disabled={isSubmitting}
              >
                {isCurrentlySubmittingThisCard ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin"/> : <Trash2 className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                 Delete
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default EventCard;