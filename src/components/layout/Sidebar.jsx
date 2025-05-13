
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, CalendarDays, PlusSquare, BarChart2, Settings, Sparkles, LogOut, Info } from 'lucide-react'; // Added Info icon
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const navItems = [
  { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/dashboard' },
  { name: 'Calendar', icon: <CalendarDays className="h-5 w-5" />, path: '/calendar' },
  { name: 'Create Post', icon: <PlusSquare className="h-5 w-5" />, path: '/create-post' },
  { name: 'Analytics', icon: <BarChart2 className="h-5 w-5" />, path: '/analytics' },
  { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  { name: 'About', icon: <Info className="h-5 w-5" />, path: '/about' }, // New About item
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userProfileSettings'); // Also clear profile
    window.dispatchEvent(new Event('authChange')); // Notify other components like AppRoutes
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      className: "bg-blue-500 text-white"
    });
    navigate('/auth');
  };

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="w-64 bg-gradient-to-b from-card via-slate-900 to-card text-foreground p-5 flex flex-col shadow-2xl border-r border-border/20"
    >
      <div className="flex items-center mb-10">
        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
        <h1 className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Planner
        </h1>
      </div>
      <nav className="flex-grow">
        <ul>
          {navItems.map((item) => (
            <motion.li 
              key={item.name} 
              className="mb-2"
              whileHover={{ x: 5, backgroundColor: "hsl(var(--primary) / 0.1)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out
                   ${isActive 
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg scale-105' 
                      : 'hover:bg-primary/10 hover:text-primary'
                   }`
                }
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.name}</span>
              </NavLink>
            </motion.li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto">
         <img  class="w-48 h-32 object-contain rounded-md mx-auto mb-4 opacity-70" alt="Abstract AI graphic illustration" src="https://images.unsplash.com/photo-1677442136019-21780ecad995" />
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-destructive/20 hover:text-destructive">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
  