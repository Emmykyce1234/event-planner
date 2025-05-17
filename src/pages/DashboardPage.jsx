import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
    import { CalendarDays } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';

    const DashboardPage = () => {
      const { user } = useAuth();
      const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      };

      const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
      }

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-8"
        >
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-5xl font-extrabold text-foreground drop-shadow-lg">
              {getGreeting()}, {user?.email.split('@')[0]}!
            </h1>
            <p className="text-xl text-muted-foreground mt-2">Welcome to your Event Planner Dashboard.</p>
          </motion.header>

          <motion.div 
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-1 lg:max-w-md mx-auto gap-6"
          >
            <DashboardCard
              variants={itemVariants}
              title="Manage Events"
              description="Create, view, and update your upcoming events."
              icon={<CalendarDays className="h-10 w-10 text-accent" />}
              linkTo="/events"
              actionText="Go to Events"
            />
          </motion.div>
        </motion.div>
      );
    };

    const DashboardCard = ({ title, description, icon, linkTo, actionText, disabled, variants }) => (
      <motion.div variants={variants}>
        <Card className="glassmorphism shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-4 p-6 bg-card/50">
            <div className="p-3 rounded-full bg-primary/20">{icon}</div>
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground">{title}</CardTitle>
              <CardDescription className="text-muted-foreground">{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Button asChild variant="default" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold" disabled={disabled}>
              <Link to={linkTo}>{actionText}</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );

    export default DashboardPage;