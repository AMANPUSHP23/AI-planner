
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, Code, Briefcase, Users, Github, Linkedin, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  const features = [
    "Plan and generate social media content using AI",
    "Organize posts in a calendar-style dashboard",
    "Create, edit, delete, and schedule content",
    "Use AI (simulated OpenAI API) to generate post captions or ideas",
    "Save drafts and manage user settings (profile, notifications)",
    "View simulated post analytics"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-8 max-w-4xl mx-auto"
    >
      <header className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 150 }}
        >
          <Sparkles className="h-20 w-20 text-primary mx-auto animate-bounce" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-pink-500 bg-clip-text text-transparent">
          AI Content Planner Dashboard
        </h1>
        <p className="text-lg text-muted-foreground">
          A demonstration of full-stack React development, integrating modern tools.
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><Code className="mr-3 h-7 w-7 text-accent" /> About The Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-foreground/90">
            <p>
              This project, developed by <strong className="text-primary">Aman Pushp</strong>, serves as a demonstration of building scalable, AI-powered web applications with real-world functionality. It showcases skills in modern web technologies and SaaS product simulation.
            </p>
            <p>
              The AI Content Planner Dashboard is designed to help users streamline their social media strategy by leveraging AI for content generation and organization.
            </p>
            <h3 className="text-xl font-semibold mt-4 text-primary">Core Features:</h3>
            <ul className="list-none space-y-2 pl-2">
              {features.map((feature, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-start"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><Briefcase className="mr-3 h-7 w-7 text-green-500" /> About The Developer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-base text-foreground/90">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img  class="h-32 w-32 rounded-full object-cover shadow-lg border-2 border-primary" alt="Aman Pushp" src="https://images.unsplash.com/photo-1687031317737-53bd68f49e9f" />
              <div>
                <h3 className="text-2xl font-semibold text-primary">Aman Pushp</h3>
                <p className="text-muted-foreground">Full-Stack React Developer</p>
                <p className="mt-2">
                  Passionate about creating intuitive and powerful web applications using cutting-edge technologies. Experienced in React, Node.js, TailwindCSS, and cloud services.
                </p>
              </div>
            </div>
            <div className="flex space-x-4 pt-3">
              <a href="https://github.com/amanpushp" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5 mr-2" /> GitHub
              </a>
              <a href="https://linkedin.com/in/amanpushp" target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5 mr-2" /> LinkedIn
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card/80 backdrop-blur-md border-border/50 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl"><Users className="mr-3 h-7 w-7 text-blue-500" /> Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              "React 18 + Vite",
              "React Router 6",
              "Tailwind CSS + shadcn/ui",
              "Framer Motion for animations",
              "Lucide React for icons",
              "LocalStorage for temporary data persistence (Supabase for production)",
              "Simulated OpenAI API for AI features",
            ].map((tech, index) => (
              <motion.p 
                key={index} 
                className="text-foreground/90 flex items-center"
                initial={{ opacity:0, x: -10 }}
                animate={{ opacity:1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Code className="h-4 w-4 mr-2 text-primary/70" /> {tech}
              </motion.p>
            ))}
          </CardContent>
        </Card>
      </motion.section>
      
      <motion.footer
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-sm text-muted-foreground pt-6"
      >
        <p>&copy; {new Date().getFullYear()} Aman Pushp. All Rights Reserved.</p>
        <p>This project is for demonstration purposes.</p>
      </motion.footer>

    </motion.div>
  );
};

export default AboutPage;
  