import React, { createContext, useContext, useState, useEffect } from 'react';

    const AuthContext = createContext();

    export const useAuth = () => useContext(AuthContext);

    const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const storedUser = localStorage.getItem('eventPlannerUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }, []);

      const login = (email, password) => {
        setLoading(true);
        const users = JSON.parse(localStorage.getItem('eventPlannerUsers')) || [];
        const foundUser = users.find(u => u.email === email && u.password === password); 

        if (foundUser) {
          const userToStore = { email: foundUser.email, id: foundUser.id };
          localStorage.setItem('eventPlannerUser', JSON.stringify(userToStore));
          setUser(userToStore);
          setLoading(false);
          return true;
        } else {
          setLoading(false);
          return false;
        }
      };

      const signup = (email, password) => {
        setLoading(true);
        let users = JSON.parse(localStorage.getItem('eventPlannerUsers')) || [];
        if (users.find(u => u.email === email)) {
          setLoading(false);
          return false;
        }
        
        const newUser = { id: Date.now().toString(), email, password }; 
        users.push(newUser);
        localStorage.setItem('eventPlannerUsers', JSON.stringify(users));
        
        const userToStore = { email: newUser.email, id: newUser.id };
        localStorage.setItem('eventPlannerUser', JSON.stringify(userToStore));
        setUser(userToStore);
        setLoading(false);
        return true;
      };

      const logout = () => {
        localStorage.removeItem('eventPlannerUser');
        setUser(null);
      };

      const value = {
        user,
        loading,
        login,
        signup,
        logout,
      };

      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export default AuthProvider;