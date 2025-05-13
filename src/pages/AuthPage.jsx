
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginEmail) newErrors.loginEmail = "Email is required.";
    else if (!validateEmail(loginEmail)) newErrors.loginEmail = "Invalid email format.";
    if (!loginPassword) newErrors.loginPassword = "Password is required.";
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate API call & successful login
      localStorage.setItem('authToken', 'fake-jwt-token');
      localStorage.setItem('userProfileSettings', JSON.stringify({name: 'Demo User', email: loginEmail, bio: 'Logged in user'}));
      window.dispatchEvent(new Event('authChange')); // Notify AppRoutes and Header
      toast({
        title: "Login Successful!",
        description: "Welcome back!",
        className: "bg-green-600 text-white"
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!signupName) newErrors.signupName = "Full name is required.";
    if (!signupEmail) newErrors.signupEmail = "Email is required.";
    else if (!validateEmail(signupEmail)) newErrors.signupEmail = "Invalid email format.";
    if (!signupPassword) newErrors.signupPassword = "Password is required.";
    else if (signupPassword.length < 6) newErrors.signupPassword = "Password must be at least 6 characters.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Simulate API call & successful signup
      localStorage.setItem('authToken', 'fake-jwt-token');
      localStorage.setItem('userProfileSettings', JSON.stringify({name: signupName, email: signupEmail, bio: ''}));
      window.dispatchEvent(new Event('authChange'));
      toast({
        title: "Signup Successful!",
        description: "Your account has been created.",
        className: "bg-green-600 text-white"
      });
      navigate('/dashboard');
    } else {
       toast({
        title: "Signup Failed",
        description: "Please correct the errors and try again.",
        variant: "destructive"
      });
    }
  };

  const ErrorMessage = ({ message }) => message ? (
    <p className="text-xs text-red-400 mt-1 flex items-center">
      <AlertTriangle className="h-3 w-3 mr-1" /> {message}
    </p>
  ) : null;


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-background to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <Tabs defaultValue="login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card className="border-border/30 bg-card/80 backdrop-blur-md shadow-2xl shadow-primary/10">
              <form onSubmit={handleLogin}>
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Welcome Back!
                  </CardTitle>
                  <CardDescription>
                    Enter your credentials to access your AI Content Planner.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className={`bg-slate-800/50 border-border/50 focus:border-primary ${errors.loginEmail ? 'border-red-500' : ''}`} />
                    <ErrorMessage message={errors.loginEmail} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" type="password" placeholder="••••••••" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} className={`bg-slate-800/50 border-border/50 focus:border-primary ${errors.loginPassword ? 'border-red-500' : ''}`} />
                    <ErrorMessage message={errors.loginPassword} />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3">
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
                    <LogIn className="mr-2 h-4 w-4" /> Login
                  </Button>
                  <Button variant="link" type="button" className="text-muted-foreground hover:text-primary">Forgot password?</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card className="border-border/30 bg-card/80 backdrop-blur-md shadow-2xl shadow-primary/10">
              <form onSubmit={handleSignup}>
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Create Account
                  </CardTitle>
                  <CardDescription>
                    Join us and supercharge your content strategy with AI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input id="signup-name" placeholder="Your Name" value={signupName} onChange={e => setSignupName(e.target.value)} className={`bg-slate-800/50 border-border/50 focus:border-primary ${errors.signupName ? 'border-red-500' : ''}`} />
                    <ErrorMessage message={errors.signupName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" placeholder="your@email.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} className={`bg-slate-800/50 border-border/50 focus:border-primary ${errors.signupEmail ? 'border-red-500' : ''}`} />
                    <ErrorMessage message={errors.signupEmail} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input id="signup-password" type="password" placeholder="Choose a strong password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} className={`bg-slate-800/50 border-border/50 focus:border-primary ${errors.signupPassword ? 'border-red-500' : ''}`} />
                    <ErrorMessage message={errors.signupPassword} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity text-primary-foreground">
                    <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AuthPage;
  