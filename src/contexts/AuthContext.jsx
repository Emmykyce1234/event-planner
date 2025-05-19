
import React, { createContext, useContext, useState, useEffect } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from '@/components/ui/use-toast';

    const AuthContext = createContext();

    export const useAuth = () => useContext(AuthContext);

    const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [session, setSession] = useState(null);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();

      useEffect(() => {
        const fetchSession = async () => {
          const { data: { session: currentSession } } = await supabase.auth.getSession();
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            setLoading(false);
          }
        );

        return () => {
          authListener?.subscription?.unsubscribe();
        };
      }, []);

      const login = async (email, password) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
          toast({ title: "Login Failed", description: error.message, variant: "destructive" });
          return false;
        }
        toast({ title: "Login Successful", description: "Welcome back!", variant: "default" });
        return true;
      };

      const signup = async (email, password) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) {
          toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
          return false;
        }
        toast({ title: "Signup Successful", description: "Please check your email to verify your account.", variant: "default" });
        return true;
      };

      const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);
        if (error) {
          toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
          return;
        }
        setUser(null);
        setSession(null);
        toast({ title: "Logged Out", description: "You have been successfully logged out.", variant: "default"});
      };
      
      const value = {
        user,
        session,
        loading,
        login,
        signup,
        logout,
      };

      return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
    };

    export default AuthProvider;
