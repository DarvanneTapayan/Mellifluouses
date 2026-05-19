/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoShowcase from './components/VideoShowcase';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import { useState } from 'react';
import { Settings } from 'lucide-react';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <main className="min-h-screen selection:bg-royal-purple selection:text-white overflow-x-hidden">
      <Navbar />
      <Hero />
      <VideoShowcase />
      <Testimonials />
      
      {/* CTA Section */}
      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-royal-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-7xl font-bold mb-8">WANT TO MAKE SOMETHING <span className="text-gradient underline decoration-royal-purple/30 underline-offset-8">WILD?</span></h2>
            <p className="text-white/60 text-xl mb-12 max-w-xl mx-auto">
              I'm always down to chat about cool projects, AI experiments, or just geek out over pixels. Let's make it happen.
            </p>
            <button className="bg-white text-midnight px-10 py-5 rounded-2xl font-bold text-xl hover:bg-royal-purple hover:text-white transition-all purple-glow">
              Get In Touch
            </button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Hidden Admin Trigger */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 left-6 w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center text-white/20 hover:text-white/60 transition-colors z-40"
        title="Admin Dashboard"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </main>
  );
}
