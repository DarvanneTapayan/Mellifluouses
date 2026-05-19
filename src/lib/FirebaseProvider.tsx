/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';
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

    // Real-time projects
    const projectsQuery = query(collection(db, 'projects'));
    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      
      // Sort locally by createdAt if available
      projectsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setProjects(projectsData as VideoProject[]);
      setProjectsLoading(false);
      setErrorMessage(null);
    }, (error) => {
      console.error("Projects loading error:", error);
      setErrorMessage(`Projects: ${error.message}`);
      setProjectsLoading(false);
    });

    // Real-time testimonials
    const testimonialsQuery = query(collection(db, 'testimonials'));
    const unsubscribeTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
      const testimonialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];

      // Sort locally
      testimonialsData.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setTestimonials(testimonialsData as Testimony[]);
      setTestimonialsLoading(false);
      setErrorMessage(null);
    }, (error) => {
      console.error("Testimonials loading error:", error);
      setErrorMessage(`Testimonials: ${error.message}`);
      setTestimonialsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
      unsubscribeTestimonials();
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
