
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import DashboardPage from '@/pages/DashboardPage';
import AuthPage from '@/pages/AuthPage';
import ContentCalendarPage from '@/pages/ContentCalendarPage';
import CreatePostPage from '@/pages/CreatePostPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import SettingsPage from '@/pages/SettingsPage';
import AboutPage from '@/pages/AboutPage'; // New About Page

const AppRoutes = () => {
  // Check for auth token in localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('authToken'));
    };

    window.addEventListener('authChange', handleStorageChange);
    // Also listen to direct storage changes if auth token is manipulated outside app
    window.addEventListener('storage', (event) => {
      if (event.key === 'authToken') {
        handleStorageChange();
      }
    });

    return () => {
      window.removeEventListener('authChange', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return (
    <Routes>
      <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/dashboard" replace />} />
      {isAuthenticated ? (
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<ContentCalendarPage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} /> 
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/auth" replace />} />
      )}
    </Routes>
  );
};

export default AppRoutes;
  