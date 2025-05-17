import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/contexts/AuthContext';
    import { LogOut, CalendarDays, LayoutDashboard } from 'lucide-react';
    import { motion } from 'framer-motion';

    const Navbar = () => {
      const { logout, user } = useAuth();
      const navigate = useNavigate();

      const handleLogout = () => {
        logout();
        navigate('/login');
      };

      return (
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-card/80 backdrop-blur-lg shadow-lg p-4 sticky top-0 z-50 border-b border-border/50"
        >
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-primary hover:text-primary/90 transition-colors">
              EventPlanner
            </Link>
            <div className="space-x-2 flex items-center">
              <NavLink icon={<LayoutDashboard size={18} />} to="/dashboard">Dashboard</NavLink>
              <NavLink icon={<CalendarDays size={18} />} to="/events">Events</NavLink>
              {user && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="destructive" onClick={handleLogout} size="sm" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center">
                    <LogOut size={16} className="mr-2" /> Logout
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.nav>
      );
    };

    const NavLink = ({ to, children, icon }) => (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="ghost" asChild className="text-foreground hover:bg-accent/20 hover:text-accent-foreground">
          <Link to={to} className="flex items-center space-x-2">
            {icon}
            <span>{children}</span>
          </Link>
        </Button>
      </motion.div>
    );

    export default Navbar;