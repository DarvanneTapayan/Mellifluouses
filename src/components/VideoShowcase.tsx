/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowUpRight, X } from 'lucide-react';
import { VIDEO_PROJECTS } from '../constants';
import { useFirebase } from '../lib/FirebaseProvider';
import { useState } from 'react';

export default function VideoShowcase() {
  const { projects: dbProjects, projectsLoading } = useFirebase();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  // Only show dummy data if we are NOT loading AND the database is actually empty
  const items = projectsLoading ? [] : (dbProjects.length > 0 ? dbProjects : VIDEO_PROJECTS);

  return (
    <section id="works" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">WHAT I'VE BEEN MAKING</h2>
            <p className="text-white/50 text-lg">A peek into my lab—some cinematic experiments and AI visual tests I'm proud of.</p>
          </div>
          <button className="group flex items-center gap-2 text-royal-purple font-bold">
            SEE EVERYTHING
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video rounded-3xl glass animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {items.map((project, index) => (
              <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="break-inside-avoid group relative"
            >
              {/* Card Container */}
              <div className="relative rounded-3xl overflow-hidden glass p-2 transition-all group-hover:bg-white/10">
                <div className="relative w-full rounded-2xl overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-auto transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-midnight/40 group-hover:opacity-0 transition-opacity" />
                  
                  {/* Play Button Overlay */}
                  <button 
                    onClick={() => setSelectedVideo(project.videoUrl)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-16 h-16 rounded-full bg-royal-purple/90 flex items-center justify-center backdrop-blur-sm shadow-xl">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 px-2 flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-royal-purple uppercase tracking-widest mb-2 block">{project.category}</span>
                  <h3 className="text-2xl font-bold font-display">{project.title}</h3>
                  <p className="text-white/50 text-sm mt-2 max-w-[280px] line-clamp-2">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 glass"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <iframe
                src={selectedVideo}
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
