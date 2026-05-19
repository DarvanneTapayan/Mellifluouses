/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
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

    // Real-time projects from Firestore
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoProject[];
      
      setProjects(projectsData);
      setProjectsLoading(false);
      setErrorMessage(null);
    }, (error) => {
      console.error("Projects loading error (Firestore):", error);
      setErrorMessage(handleFirestoreError(error, OperationType.LIST, 'projects'));
      setProjectsLoading(false);
    });

    // Real-time testimonials from Firestore
    const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribeTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
      const testimonialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimony[];

      setTestimonials(testimonialsData);
      setTestimonialsLoading(false);
      setErrorMessage(null);
    }, (error) => {
      console.error("Testimonials loading error (Firestore):", error);
      setErrorMessage(handleFirestoreError(error, OperationType.LIST, 'testimonials'));
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
