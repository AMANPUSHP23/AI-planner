
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { BarChart, CalendarDays, FilePlus2, Users, ListChecks, Activity, Info, Zap, ExternalLink, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';


const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    scheduledPostsCount: 0,
    draftsCount: 0,
    upcomingPosts: [],
    recentActivity: [],
  });
  const [selectedStat, setSelectedStat] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadDashboardData = () => {
    const draft = JSON.parse(localStorage.getItem('postDraftV2') || '{}');
    const draftsCount = draft.content ? 1 : 0;

    const scheduled = JSON.parse(localStorage.getItem('scheduledPostsV2') || '[]');
    const scheduledPostsCount = scheduled.length;
    
    const now = new Date();
    const upcomingPosts = scheduled
      .filter(post => new Date(post.scheduledAt) >= now) 
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
      .slice(0, 5);

    const recentActivity = [];
    if (draft.content) {
      recentActivity.push({ id: 'draft1', type: 'Draft Updated', time: 'Recently', details: `Draft content: "${draft.content.substring(0,30)}..."` });
    }
    scheduled.slice(-3).forEach((post, index) => {
        recentActivity.push({ 
            id: `sch${post.id}`, 
            type: `Post Scheduled (${post.platform || 'General'})`, 
            time: new Date(post.scheduledAt).toLocaleString(), 
            details: `Content: "${post.content.substring(0,30)}..."` 
        });
    });

    setDashboardData({
        scheduledPostsCount,
        draftsCount,
        upcomingPosts,
        recentActivity: recentActivity.reverse(),
    });
  };
  
  useEffect(() => {
    loadDashboardData();
    const handleStorageChange = () => {
        loadDashboardData();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('postsUpdated', handleStorageChange);

    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('postsUpdated', handleStorageChange);
    };
  }, []);

  const statsCardsMeta = [
    { title: "Scheduled Posts", dataKey: "scheduledPostsCount", icon: <CalendarDays className="h-8 w-8 text-primary" />, color: "text-primary", description: "Total posts lined up for publishing.", action: "/calendar" },
    { title: "Drafts", dataKey: "draftsCount", icon: <FilePlus2 className="h-8 w-8 text-accent" />, color: "text-accent", description: "Content saved but not yet scheduled.", action: "/create-post" }, 
    { title: "AI Credits (Simulated)", value: "2450", icon: <Zap className="h-8 w-8 text-yellow-500" />, color: "text-yellow-500", description: "Remaining credits for AI generation.", staticValue: true },
    { title: "Engagement (Simulated)", value: "7.2%", icon: <BarChart className="h-8 w-8 text-green-500" />, color: "text-green-500", description: "Overall post engagement rate.", staticValue: true, action: "/analytics" },
  ];

  const clearLocalStorage = () => {
    localStorage.removeItem('postDraftV2');
    localStorage.removeItem('scheduledPostsV2');
    loadDashboardData(); 
    window.dispatchEvent(new Event('postsUpdated')); 
    toast({
        title: "Local Data Cleared",
        description: "All drafts and scheduled posts in local storage have been cleared.",
        variant: "destructive",
        className: "bg-red-700 text-white border-red-800"
    });
  };

  const handleStatCardClick = (stat) => {
    if (stat.action && !stat.staticValue) { 
        setSelectedStat(stat);
    } else if (stat.action) {
        navigate(stat.action);
    } else if (stat.staticValue){
        setSelectedStat(stat); 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 sm:p-6 space-y-6 min-h-screen"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
          Content Command Center
        </h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button onClick={clearLocalStorage} variant="destructive" className="shadow-lg hover:shadow-red-500/50 transition-all duration-300">
            <Trash2 className="mr-2 h-4 w-4" /> Clear All Local Data
        </Button>
        </motion.div>
      </div>
      
      <Dialog open={!!selectedStat} onOpenChange={(isOpen) => !isOpen && setSelectedStat(null)}>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statsCardsMeta.map((stat, index) => (
            <DialogTrigger asChild key={stat.title} onClick={() => handleStatCardClick(stat)}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 120 }}
                className="cursor-pointer"
              >
                <Card className="bg-card/80 backdrop-blur-md border-border/40 shadow-xl hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105 h-full flex flex-col justify-between">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.staticValue ? stat.value : dashboardData[stat.dataKey]}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </DialogTrigger>
          ))}
        </div>
        {selectedStat && (
            <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl border-primary/30">
                <DialogHeader>
                    <DialogTitle className="flex items-center text-2xl">
                        {selectedStat.icon && React.cloneElement(selectedStat.icon, {className: `mr-2 h-6 w-6 ${selectedStat.color}`})}
                        {selectedStat.title}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {selectedStat.description} Currently, you have <span className={`font-bold ${selectedStat.color}`}>{selectedStat.staticValue ? selectedStat.value : dashboardData[selectedStat.dataKey]}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 text-sm text-foreground">
                    <p>This is a quick overview. For more details or to manage this, you can visit the relevant section.</p>
                    {selectedStat.action && (
                        <Button onClick={() => { navigate(selectedStat.action); setSelectedStat(null); }} className="mt-4 w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                            Go to {selectedStat.title.replace(" (Simulated)", "")} <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        )}
      </Dialog>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, type: "spring" }} className="lg:col-span-2">
          <Card className="bg-card/80 backdrop-blur-md border-border/40 shadow-lg h-full min-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><Activity className="mr-2 text-primary h-6 w-6"/>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates in your content planner.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto custom-scrollbar pr-2 max-h-[400px] lg:max-h-[calc(100vh-450px)]">
              {dashboardData.recentActivity.length > 0 ? (
                <ul className="space-y-3">
                  {dashboardData.recentActivity.map(activity => (
                    <motion.li 
                        key={activity.id} 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                        className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-primary/10 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <div className="flex-shrink-0 p-2 bg-slate-700 rounded-full">
                        {activity.type.includes("Draft") ? <FilePlus2 className="h-5 w-5 text-accent" /> : <ListChecks className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-foreground">{activity.type}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-full sm:max-w-md">{activity.details}</p>
                      </div>
                       <p className="text-xs text-muted-foreground/70 whitespace-nowrap">{activity.time}</p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                  <Activity className="h-16 w-16 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="mt-2 text-lg text-muted-foreground">No recent activity.</p>
                  <p className="text-sm text-muted-foreground/70">Your latest actions will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, type: "spring" }}>
          <Card className="bg-card/80 backdrop-blur-md border-border/40 shadow-lg h-full min-h-[300px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl flex items-center"><CalendarDays className="mr-2 text-accent h-6 w-6"/>Upcoming Posts</CardTitle>
              <CardDescription>Your next few scheduled items.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto custom-scrollbar pr-2 max-h-[400px] lg:max-h-[calc(100vh-450px)]">
               {dashboardData.upcomingPosts.length > 0 ? (
                <ul className="space-y-3">
                  {dashboardData.upcomingPosts.map(post => (
                    <motion.li 
                        key={post.id} 
                        initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
                        className="p-3 bg-slate-800/50 rounded-lg hover:bg-accent/10 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <p className="text-sm font-semibold text-foreground truncate">{post.content.substring(0, 40)}...</p>
                      <p className="text-xs text-accent/90">Platform: {post.platform || 'General'} | Tone: {post.tone || 'Default'}</p>
                      <p className="text-xs text-muted-foreground">Scheduled: {new Date(post.scheduledAt).toLocaleDateString()} {new Date(post.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      {post.imagePreview && <img  class="w-full h-24 object-cover rounded-md mt-2 opacity-70 border border-border/20" alt="Scheduled post image preview" src={post.imagePreview} />}
                    </motion.li>
                  ))}
                </ul>
               ) : (
                 <div className="text-center py-10 flex flex-col items-center justify-center h-full">
                    <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="mt-2 text-lg text-muted-foreground">No upcoming posts.</p>
                    <p className="text-sm text-muted-foreground/70">Schedule new content to see it here.</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
  