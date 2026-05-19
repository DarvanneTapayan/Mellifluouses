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
  projects: VideoProject[];
  testimonials: Testimony[];
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimony[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Real-time projects
    const projectsQuery = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribeProjects = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VideoProject[];
      setProjects(projectsData);
    });

    // Real-time testimonials
    const testimonialsQuery = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubscribeTestimonials = onSnapshot(testimonialsQuery, (snapshot) => {
      const testimonialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Testimony[];
      setTestimonials(testimonialsData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeProjects();
      unsubscribeTestimonials();
    };
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, loading, projects, testimonials }}>
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
