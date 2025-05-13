
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart as LineChartIcon, Users, ThumbsUp, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalReach: 0,
    engagementRate: 0,
    postsPublished: 0,
    reachTrend: 0,
    engagementTrend: 0,
    postsTrend: 0,
  });

  useEffect(() => {
    // Simulate fetching data or calculating from localStorage
    const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPostsV2') || '[]');
    const postsPublished = scheduledPosts.length;
    
    // Dummy data generation
    const totalReach = postsPublished * Math.floor(Math.random() * 500 + 100); // Each post reaches 100-600 people
    const engagementRate = postsPublished > 0 ? (Math.random() * 5 + 1).toFixed(1) : 0; // 1-6% engagement
    
    setAnalyticsData({
      totalReach: totalReach,
      engagementRate: parseFloat(engagementRate),
      postsPublished: postsPublished,
      // Dummy trends
      reachTrend: Math.floor(Math.random() * 20 - 10), // -10% to +10%
      engagementTrend: parseFloat((Math.random() * 2 - 1).toFixed(1)), // -1.0% to +1.0%
      postsTrend: Math.floor(Math.random() * 5 - 2), // -2 to +3 posts
    });
  }, []);

  const TrendIndicator = ({ value, unit = '%' }) => {
    const isPositive = value > 0;
    const isNeutral = value === 0;
    if (isNeutral) return <span className="text-yellow-500 ml-1">~0{unit}</span>;
    return (
      <span className={`ml-1 ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
        {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5"/> : <TrendingDown className="h-3 w-3 mr-0.5"/>}
        {isPositive ? '+' : ''}{value}{unit}
      </span>
    );
  };

  const chartCard = (title, value, description, trendValue, trendUnit, icon) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-primary/20 transition-shadow duration-300 h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-md font-medium text-muted-foreground">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{value}{title.includes("Rate") ? "%" : ""}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {description} <TrendIndicator value={trendValue} unit={trendUnit} />
          </p>
          <div className="h-32 mt-4 bg-slate-800/50 rounded-md flex items-center justify-center overflow-hidden">
             <img  class="w-full h-full object-cover opacity-70" alt={`Placeholder graphic for ${title} chart`} src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Content Analytics</h1>
            <CardDescription>Track the performance of your social media posts. Data is simulated.</CardDescription>
        </div>
         <div className="mt-4 sm:mt-0 flex items-center p-3 bg-slate-800/50 rounded-lg text-xs text-muted-foreground">
            <Activity className="h-4 w-4 mr-2 text-primary"/> Last updated: Just now (simulated)
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {chartCard("Total Reach", analyticsData.totalReach.toLocaleString(), "vs last period", analyticsData.reachTrend, '%', <Users className="h-5 w-5 text-primary" />)}
        {chartCard("Engagement Rate", analyticsData.engagementRate, "vs last period", analyticsData.engagementTrend, '%', <ThumbsUp className="h-5 w-5 text-accent" />)}
        {chartCard("Posts Published", analyticsData.postsPublished, "vs last period", analyticsData.postsTrend, '', <LineChartIcon className="h-5 w-5 text-green-500" />)}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.3 }}>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Reach and engagement trends for the last 30 days (simulated).</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex items-center justify-center">
            <div className="text-center w-full">
              <img  class="w-full max-w-2xl h-auto mx-auto opacity-60 rounded-lg" alt="Analytics dashboard illustration showing line graphs and pie charts" src="https://images.unsplash.com/photo-1625296276188-1d149bdaf560" />
              <p className="mt-4 text-lg text-muted-foreground">Recharts/Chart.js integration will render actual charts here.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
  