import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
    import { useAuth } from '@/contexts/AuthContext';
    import { motion } from 'framer-motion';
    import { LogIn, Mail, Lock } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';

    const LoginPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const { login, user } = useAuth();
      const navigate = useNavigate();
      const { toast } = useToast();

      useEffect(() => {
        if (user) {
          navigate('/dashboard');
        }
      }, [user, navigate]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        const success = login(email, password);
        if (success) {
          navigate('/dashboard');
          toast({ title: "Login Successful", description: "Welcome back!", variant: "default" });
        } else {
          toast({ title: "Login Failed", description: "Invalid email or password.", variant: "destructive" });
        }
      };

      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-center min-h-screen p-4"
        >
          <Card className="w-full max-w-md glassmorphism shadow-2xl border-border/50">
            <CardHeader className="text-center bg-card/70 p-8 rounded-t-lg">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="mx-auto mb-4 p-3 bg-gradient-to-br from-primary to-accent rounded-full inline-block"
              >
                <LogIn className="h-10 w-10 text-primary-foreground" />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-foreground">Welcome Back!</CardTitle>
              <CardDescription className="text-muted-foreground">Sign in to continue to your Event Planner</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-foreground/90">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="you@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="pl-10 bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-foreground/90">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      className="pl-10 bg-secondary border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-semibold py-3 text-base">
                    <LogIn className="mr-2 h-5 w-5"/> Sign In
                  </Button>
                </motion.div>
              </form>
            </CardContent>
            <CardFooter className="p-6 text-center bg-card/50 rounded-b-lg border-t border-border/50">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
                  <Link to="/signup" className="font-semibold text-accent hover:text-accent/90 underline">
                    Sign Up
                  </Link>
                </motion.div>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default LoginPage;