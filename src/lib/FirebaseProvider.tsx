/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';
import { auth, rtdb, handleFirestoreError, OperationType } from './firebase';
import { VideoProject, Testimony } from '../types';

interface FirebaseContextType {
  user: User | null;
  loading: boolean;
  projectsLoading: boolean;
  testimonialsLoading: boolean;
  projects: VideoProject[];
  testimonials: Testimony[];
  errorMessage: string | null;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimony[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    // Real-time projects from RTDB
    const projectsRef = ref(rtdb, 'projects');
    const onProjectsValue = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const projectsData = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        })) as VideoProject[];
        
        // Sort locally by createdAt desc
        projectsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setProjects(projectsData);
      } else {
        setProjects([]);
      }
      setProjectsLoading(false);
      setErrorMessage(null);
    }, (error) => {
      console.error("Projects loading error (RTDB):", error);
      setErrorMessage(`Projects: ${error.message}`);
      setProjectsLoading(false);
    });

    // Real-time testimonials from RTDB
    const testimonialsRef = ref(rtdb, 'testimonials');
    const onTestimonialsValue = onValue(testimonialsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const testimonialsData = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        })) as Testimony[];

        // Sort locally
        testimonialsData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setTestimonials(testimonialsData);
      } else {
        setTestimonials([]);
      }
      setTestimonialsLoading(false);
      setErrorMessage(null);
    }, (error) => {
      console.error("Testimonials loading error (RTDB):", error);
      setErrorMessage(`Testimonials: ${error.message}`);
      setTestimonialsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      off(projectsRef, 'value', onProjectsValue);
      off(testimonialsRef, 'value', onTestimonialsValue);
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ 
      user, 
      loading: authLoading, 
      projectsLoading, 
      testimonialsLoading, 
      projects, 
      testimonials,
      errorMessage
    }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
