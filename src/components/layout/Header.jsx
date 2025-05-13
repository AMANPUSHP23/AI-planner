
import React, { useState, useEffect } from 'react';
import { Bell, Search, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Header = () => {
  const [userName, setUserName] = useState('Guest User');
  const [userRole, setUserRole] = useState('User'); // Default role

  useEffect(() => {
    const loadUserData = () => {
      const profile = JSON.parse(localStorage.getItem('userProfileSettings') || '{}');
      if (profile.name) {
        setUserName(profile.name);
      }
      // Placeholder for role, could also be in profile
      if (profile.email && profile.email.includes('admin')) { 
        setUserRole('Admin Role');
      } else {
        setUserRole('User Role');
      }
    };
    
    loadUserData();
    window.addEventListener('authChange', loadUserData); // Listen for login/logout
    window.addEventListener('storage', (event) => { // Listen for settings changes
      if (event.key === 'userProfileSettings') {
        loadUserData();
      }
    });

    return () => {
      window.removeEventListener('authChange', loadUserData);
      window.removeEventListener('storage', (event) => {
        if (event.key === 'userProfileSettings') {
          loadUserData();
        }
      });
    };
  }, []);

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="h-20 bg-card/50 backdrop-blur-md border-b border-border/20 shadow-sm flex items-center justify-between px-6"
    >
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search content, features..."
            className="pl-10 pr-4 py-2 w-64 rounded-lg bg-slate-800/60 border border-transparent focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-sm"
          />
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <motion.div whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.3 }}>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
            <Bell className="h-6 w-6" />
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 p-2 rounded-full hover:bg-primary/10 cursor-pointer transition-colors">
          <UserCircle className="h-8 w-8 text-primary" />
          <div className="text-sm">
            <p className="font-semibold">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
  