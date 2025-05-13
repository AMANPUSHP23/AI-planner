
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, Bell, ShieldCheck, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from "@/components/ui/switch"; // Assuming Switch is a shadcn component

const SettingsPage = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({ name: 'Aman Pushp', email: 'aman@example.com', bio: '' });
  const [profileErrors, setProfileErrors] = useState({ name: '', email: '' });
  const [notifications, setNotifications] = useState({ email: true, aiSuggestions: false });

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notificationsSettings'));
    if (savedNotifications) {
      setNotifications(savedNotifications);
    }
    const savedProfile = JSON.parse(localStorage.getItem('userProfileSettings'));
    if (savedProfile) {
      setProfileData(savedProfile);
    }
  }, []);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
    if (value.trim() === "") {
        setProfileErrors(prev => ({...prev, [id]: `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty.`}));
    } else {
        setProfileErrors(prev => ({...prev, [id]: ''}));
    }
  };

  const saveProfile = () => {
    let isValid = true;
    const newErrors = { name: '', email: '' };
    if (!profileData.name.trim()) {
        newErrors.name = "Full Name cannot be empty.";
        isValid = false;
    }
    if (!profileData.email.trim()) {
        newErrors.email = "Email Address cannot be empty.";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
    }
    setProfileErrors(newErrors);

    if (isValid) {
      localStorage.setItem('userProfileSettings', JSON.stringify(profileData));
      toast({ title: "Profile Updated", description: "Your profile information has been saved.", className: "bg-green-600 text-white border-green-700" });
    } else {
      toast({ title: "Validation Error", description: "Please correct the errors in the form.", variant: "destructive" });
    }
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => {
      const newSettings = { ...prev, [type]: !prev[type] };
      localStorage.setItem('notificationsSettings', JSON.stringify(newSettings));
      toast({
        title: "Notification Settings Updated",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${newSettings[type] ? 'enabled' : 'disabled'}.`,
        className: newSettings[type] ? "bg-sky-500 text-white" : "bg-orange-500 text-white"
      });
      return newSettings;
    });
  };
  
  const SettingsSection = ({ title, description, icon, children, onSave, saveText = "Save Changes" }) => (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, type: "spring" }}>
      <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl hover:shadow-primary/20 transition-all duration-300">
        <CardHeader className="flex flex-row items-start space-x-4 p-6">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl text-primary-foreground shadow-md">
            {React.cloneElement(icon, { className: "h-7 w-7" })}
          </div>
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-6 pb-6">
          {children}
        </CardContent>
        {onSave && (
          <CardFooter className="p-6 border-t border-border/30">
            <Button onClick={onSave} className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-primary/40 transition-all transform hover:scale-105">
              <CheckCircle className="mr-2 h-5 w-5" /> {saveText}
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8"
    >
      <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">Account Settings</h1>
      
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <SettingsSection title="Profile Information" description="Update your personal details and how you appear on the platform." icon={<UserCircle />} onSave={saveProfile}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Your Name" value={profileData.name} onChange={handleProfileChange} className={`bg-slate-800/70 border-border/60 focus:border-primary ${profileErrors.name ? 'border-red-500 focus:ring-red-500' : ''}`} />
              {profileErrors.name && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/>{profileErrors.name}</p>}
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={profileData.email} onChange={handleProfileChange} className={`bg-slate-800/70 border-border/60 focus:border-primary ${profileErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`} />
              {profileErrors.email && <p className="text-xs text-red-400 mt-1 flex items-center"><AlertTriangle className="h-3 w-3 mr-1"/>{profileErrors.email}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="bio">Short Bio (Optional)</Label>
            <textarea id="bio" rows="3" placeholder="Tell us about yourself..." value={profileData.bio} onChange={handleProfileChange} className="w-full p-3 rounded-md bg-slate-800/70 border-border/60 focus:ring-primary focus:border-primary"></textarea>
          </div>
        </SettingsSection>

        <SettingsSection title="Notification Preferences" description="Control how you receive updates and alerts from the platform." icon={<Bell />}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors">
              <div>
                <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                <p className="text-xs text-muted-foreground">New features, scheduled post reminders.</p>
              </div>
              <Switch id="email-notifications" checked={notifications.email} onCheckedChange={() => handleNotificationChange('email')} aria-label="Toggle email notifications"/>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-md hover:bg-slate-700/50 transition-colors">
              <div>
                <Label htmlFor="ai-suggestions" className="font-medium">AI Suggestion Alerts</Label>
                <p className="text-xs text-muted-foreground">Notify when AI has new content ideas.</p>
              </div>
              <Switch id="ai-suggestions" checked={notifications.aiSuggestions} onCheckedChange={() => handleNotificationChange('aiSuggestions')} aria-label="Toggle AI suggestion alerts"/>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Security Settings" description="Manage your password and account security features." icon={<ShieldCheck />} onSave={() => toast({title: "Security Settings", description: "Password change functionality coming soon!", className: "bg-yellow-500 text-black"})}>
          <div className="space-y-3">
            <Input id="current-password" type="password" placeholder="Current Password" className="bg-slate-800/70 border-border/60 focus:border-primary" />
            <Input id="new-password" type="password" placeholder="New Password" className="bg-slate-800/70 border-border/60 focus:border-primary" />
            <Input id="confirm-password" type="password" placeholder="Confirm New Password" className="bg-slate-800/70 border-border/60 focus:border-primary" />
          </div>
           <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/20 hover:text-red-400 mt-4 w-full sm:w-auto transition-all transform hover:scale-105" onClick={() => toast({title: "2FA Not Implemented", description:"Two-Factor Authentication setup is planned for a future update.", variant:"default", className: "bg-orange-500 text-white"})}>
            Enable Two-Factor Authentication
          </Button>
        </SettingsSection>

        <SettingsSection title="Billing & Subscription" description="View your current plan and manage payment methods via Stripe." icon={<CreditCard />}>
            <div className="p-4 bg-slate-800/50 rounded-lg text-center">
                <p className="text-lg text-muted-foreground">Your Current Plan: <span className="text-primary font-bold text-xl">Pro Plan</span></p>
                <p className="text-sm text-muted-foreground">(Renews on: May 30, 2025)</p>
                <img  class="w-auto h-16 mx-auto my-4 opacity-80" alt="Visa, Mastercard, Amex logos" src="https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1" />
            </div>
            <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent/20 hover:text-purple-300 mt-4 transition-all transform hover:scale-105" onClick={() => toast({title: "Stripe Integration", description:"Redirecting to Stripe (simulation). Real integration coming soon!", className: "bg-indigo-600 text-white"})}>
                Manage Subscription via Stripe
            </Button>
        </SettingsSection>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
  