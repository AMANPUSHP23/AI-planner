
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarPlus, Trash2, Edit3, GripVertical, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const ContentCalendarPage = () => {
  const [posts, setPosts] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadScheduledPosts();
  }, []);

  const loadScheduledPosts = () => {
    const scheduled = JSON.parse(localStorage.getItem('scheduledPostsV2') || '[]');
    // Sort by scheduledAt, most recent first for this view, or however you prefer.
    // For a calendar, chronological is better.
    setPosts(scheduled.sort((a,b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)));
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    localStorage.setItem('scheduledPostsV2', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
    window.dispatchEvent(new Event('postsUpdated')); // Notify dashboard
    toast({
      title: "Post Deleted",
      description: "The scheduled post has been removed.",
      variant: "destructive",
      className: "bg-red-600 text-white border-red-700"
    });
  };

  // Placeholder for edit functionality
  const editPost = (postId) => {
    // In a real app, you'd navigate to CreatePostPage with postId to load data
    navigate(`/create-post?edit=${postId}`); // Example route, not implemented
    toast({
      title: "Edit Post",
      description: `Editing functionality for post ID ${postId} is a TODO. Navigating to create page as placeholder.`,
      className: "bg-blue-500 text-white"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Content Calendar & Schedule</h1>
        <motion.div whileHover={{ scale: 1.05}} whileTap={{ scale: 0.95 }}>
        <Button onClick={() => navigate('/create-post')} className="bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground shadow-lg hover:shadow-primary/30">
          <CalendarPlus className="mr-2 h-5 w-5" /> Schedule New Post
        </Button>
        </motion.div>
      </div>
      
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Scheduled Posts List</CardTitle>
          <CardDescription>View, manage, and (soon) reorder your scheduled content. Full calendar view coming soon!</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[400px]">
          {posts.length > 0 ? (
            <ul className="space-y-4">
              {posts.map((post, index) => (
                <motion.li 
                    key={post.id}
                    layout // Animate reordering if list changes
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-800/60 rounded-lg shadow-md hover:bg-slate-700/60 transition-colors duration-200 group"
                >
                  <div className="flex items-start sm:items-center mb-3 sm:mb-0">
                    <GripVertical className="h-5 w-5 text-muted-foreground mr-3 hidden sm:block cursor-grab group-hover:text-primary transition-colors" />
                    <div className="w-full">
                      <p className="font-semibold text-foreground text-lg truncate max-w-xs md:max-w-md" title={post.content}>{post.content.substring(0,60)}{post.content.length > 60 ? "..." : ""}</p>
                      <p className="text-sm text-primary/90">Platform: {post.platform || 'General'} | Tone: {post.tone || 'Default'}</p>
                      <p className="text-xs text-muted-foreground">Scheduled: {new Date(post.scheduledAt).toLocaleString()}</p>
                      {post.imagePreview && <img  class="w-24 h-16 object-cover rounded-md mt-2 opacity-70 group-hover:opacity-100 transition-opacity" alt="Scheduled post preview" src={post.imagePreview}/>}
                    </div>
                  </div>
                  <div className="flex space-x-2 self-end sm:self-center">
                    <Button variant="outline" size="sm" onClick={() => editPost(post.id)} className="border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300">
                      <Edit3 className="h-4 w-4"/>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300">
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-destructive">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this scheduled post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deletePost(post.id)} className="bg-destructive hover:bg-destructive/80">
                            Yes, delete post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-16">
              <Info className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="mt-4 text-xl text-muted-foreground">No posts scheduled yet.</p>
              <p className="text-sm text-muted-foreground/80">Click "Schedule New Post" to get started.</p>
            </div>
          )}
        </CardContent>
        {posts.length > 0 && (
            <CardFooter>
                <p className="text-xs text-muted-foreground">Drag & drop reordering coming soon for full calendar view.</p>
            </CardFooter>
        )}
      </Card>
       <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm border-border/30 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-primary">Full Calendar View (Coming Soon)</h3>
            <div className="min-h-[300px] flex items-center justify-center bg-slate-800/40 rounded-md border-2 border-dashed border-border/40">
                <img  class="w-48 h-48 opacity-40" alt="Abstract calendar graphic" src="https://images.unsplash.com/photo-1622940000663-a20e92ffb555" />
            </div>
            <p className="text-center mt-3 text-muted-foreground">An interactive drag-and-drop calendar will be implemented here using a library like FullCalendar.js.</p>
        </div>
    </motion.div>
  );
};

export default ContentCalendarPage;
  