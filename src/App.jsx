
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from '@/routes';
import { Toaster } from '@/components/ui/toaster';
import { MotionConfig } from 'framer-motion';

function App() {
  return (
    <React.StrictMode>
      <Router>
        <MotionConfig transition={{ duration: 0.3, ease: "easeInOut" }}>
          <AppRoutes />
          <Toaster />
        </MotionConfig>
      </Router>
    </React.StrictMode>
  );
}

export default App;
  