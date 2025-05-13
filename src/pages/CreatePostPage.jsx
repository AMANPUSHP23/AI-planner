
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, UploadCloud, Save, CalendarClock, Trash2, CornerDownLeft, Edit } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useLocation, useNavigate } from 'react-router-dom';

const CreatePostPage = () => {
  const [postId, setPostId] = useState(null); // For editing
  const [postContent, setPostContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [aiOptions, setAiOptions] = useState({ tone: 'professional', platform: 'linkedin' });
  const { toast } = useToast();
  const MAX_CHARS = 500;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const editPostId = queryParams.get('edit');

    if (editPostId) {
      const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPostsV2') || '[]');
      const postToEdit = scheduledPosts.find(p => p.id.toString() === editPostId);
      if (postToEdit) {
        setPostId(postToEdit.id);
        setPostContent(postToEdit.content);
        setImagePreview(postToEdit.imagePreview); // Assuming imagePreview is a URL or DataURL
        setAiOptions({ tone: postToEdit.tone || 'professional', platform: postToEdit.platform || 'linkedin' });
        toast({ title: "Editing Post", description: "Loaded post data for editing.", className: "bg-blue-500 text-white" });
      } else {
        toast({ title: "Error", description: "Could not find post to edit.", variant: "destructive" });
        navigate('/calendar'); // Or dashboard
      }
    } else {
      const draft = JSON.parse(localStorage.getItem('postDraftV2') || '{}');
      if (draft.content) setPostContent(draft.content);
      if (draft.imageName && draft.imageDataUrl) setImagePreview(draft.imageDataUrl);
    }
  }, [location.search, navigate, toast]);

  const handleContentChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setPostContent(e.target.value);
    }
  };

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file); 
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast({ title: "Image Selected!", description: `${file.name} ready.`, className: "bg-green-600 text-white" });
    }
  };
  
  const removeImage = () => {
      setImagePreview(null);
      setImageFile(null);
      if (document.getElementById('imageUploadInput')) {
        document.getElementById('imageUploadInput').value = "";
      }
      toast({ title: "Image Removed", className: "bg-orange-500 text-white" });
  }

  const saveDraft = () => {
    const draftData = {
      content: postContent,
      imageName: imageFile ? imageFile.name : null,
      imageDataUrl: imagePreview 
    };
    localStorage.setItem('postDraftV2', JSON.stringify(draftData));
    toast({ title: "Draft Saved!", description: "Progress saved locally.", className: "bg-sky-600 text-white" });
  };

  const scheduleOrUpdatePost = () => {
    if (!postContent.trim()) {
      toast({ title: "Cannot Schedule", description: "Post content is empty.", variant: "destructive" });
      return;
    }
    
    let scheduledPosts = JSON.parse(localStorage.getItem('scheduledPostsV2') || '[]');
    const newPostData = { 
      content: postContent, 
      scheduledAt: new Date(), // Keep simple for now, ideally use a date picker
      imagePreview: imagePreview, 
      platform: aiOptions.platform,
      tone: aiOptions.tone,
    };

    if (postId) { // Editing existing post
      scheduledPosts = scheduledPosts.map(p => p.id === postId ? { ...p, ...newPostData, scheduledAt: p.scheduledAt } : p); // Keep original schedule time unless changed
      localStorage.setItem('scheduledPostsV2', JSON.stringify(scheduledPosts));
      toast({ title: "Post Updated!", className: "bg-teal-600 text-white" });
    } else { // Scheduling new post
      scheduledPosts.push({ ...newPostData, id: Date.now() });
      localStorage.setItem('scheduledPostsV2', JSON.stringify(scheduledPosts));
      toast({ title: "Post Scheduled!", className: "bg-emerald-600 text-white" });
    }
    
    window.dispatchEvent(new Event('postsUpdated')); // Notify other components
    setPostContent('');
    setImagePreview(null);
    setImageFile(null);
    if (document.getElementById('imageUploadInput')) {
        document.getElementById('imageUploadInput').value = "";
    }
    localStorage.removeItem('postDraftV2');
    if (postId) navigate('/calendar'); // Go back to calendar if editing
    setPostId(null); // Reset postId after operation
  };

  const generateWithAI = () => {
    let generatedText = "Generated AI Content: ";
    generatedText += `For ${aiOptions.platform}, with a ${aiOptions.tone} tone: "This is a sample AI generated post about a trending topic that will surely engage your audience! #AIContent #${aiOptions.platform.toUpperCase()}"`;
    setPostContent(generatedText.substring(0, MAX_CHARS));
    toast({ title: "AI Content Generated!", className: "bg-purple-600 text-white" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {postId ? "Edit Post" : "Create New Post"}
        </h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={() => navigate(postId ? '/calendar' : '/dashboard')} className="text-muted-foreground hover:text-primary">
                <CornerDownLeft className="mr-2 h-4 w-4" /> Back
            </Button>
        </motion.div>
      </div>
      
      <Card className="bg-card/90 backdrop-blur-md border-border/50 shadow-2xl shadow-primary/10">
        <CardHeader>
          <CardTitle>Content Composer</CardTitle>
          <CardDescription>Craft your post. Max {MAX_CHARS} characters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="post-text" className="block text-sm font-medium text-muted-foreground mb-1">Post Content ({postContent.length}/{MAX_CHARS})</Label>
            <textarea 
              id="post-text" 
              rows="8" 
              placeholder="Start typing or use AI..." 
              className="w-full p-3 rounded-md bg-slate-800/70 border border-border/60 focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base"
              value={postContent}
              onChange={handleContentChange}
            ></textarea>
             <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: `${(postContent.length / MAX_CHARS) * 100}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="ai-platform">Platform</Label>
                <select id="ai-platform" value={aiOptions.platform} onChange={e => setAiOptions({...aiOptions, platform: e.target.value})} className="w-full p-2.5 mt-1 rounded-md bg-slate-800/70 border border-border/60 focus:ring-primary focus:border-primary">
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter (X)</option>
                    <option value="instagram">Instagram</option>
                </select>
            </div>
            <div>
                <Label htmlFor="ai-tone">Tone</Label>
                <select id="ai-tone" value={aiOptions.tone} onChange={e => setAiOptions({...aiOptions, tone: e.target.value})} className="w-full p-2.5 mt-1 rounded-md bg-slate-800/70 border border-border/60 focus:ring-primary focus:border-primary">
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="witty">Witty</option>
                    <option value="empathetic">Empathetic</option>
                </select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10" onClick={generateWithAI}>
              <Wand2 className="mr-2 h-4 w-4" /> Generate with AI
            </Button>
            <Button variant="outline" className="w-full sm:w-auto border-accent text-accent hover:bg-accent/10" onClick={() => document.getElementById('imageUploadInput').click()}>
              <UploadCloud className="mr-2 h-4 w-4" /> {imagePreview ? "Change Image" : "Upload Image"}
            </Button>
            <input type="file" id="imageUploadInput" accept="image/*" className="hidden" onChange={handleImageUpload} />
             {imagePreview && (
                <Button variant="destructive" size="sm" onClick={removeImage}>
                    <Trash2 className="mr-2 h-4 w-4" /> Remove Image
                </Button>
            )}
          </div>
          {imagePreview ? (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                <img  class="w-full max-h-60 object-contain rounded-md mt-2 border-2 border-primary/50 shadow-lg" alt="Uploaded image preview" src={imagePreview} />
             </motion.div>
          ) : (
            <div className="w-full h-40 rounded-md mt-2 border-2 border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground bg-slate-800/30">
              <UploadCloud className="h-10 w-10 mb-2 opacity-50" />
              <p>Image Preview Area</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-6">
          {!postId && (
            <Button variant="ghost" className="w-full sm:w-auto text-muted-foreground hover:bg-slate-700/50" onClick={saveDraft}>
              <Save className="mr-2 h-4 w-4" /> Save Draft
            </Button>
          )}
          <Button className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground" onClick={scheduleOrUpdatePost}>
            {postId ? <Edit className="mr-2 h-4 w-4" /> : <CalendarClock className="mr-2 h-4 w-4" />}
            {postId ? "Update Post" : "Schedule Post"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CreatePostPage;
  