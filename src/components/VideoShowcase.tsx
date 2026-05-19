/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Play, ArrowUpRight } from 'lucide-react';
import { VIDEO_PROJECTS } from '../constants';

export default function VideoShowcase() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {VIDEO_PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative aspect-4/3 rounded-3xl overflow-hidden glass p-2 transition-all group-hover:bg-white/10">
                <div className="relative w-full h-full rounded-2xl overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-midnight/40 group-hover:opacity-0 transition-opacity" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-royal-purple/90 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-royal-purple uppercase tracking-widest mb-2 block">{project.category}</span>
                  <h3 className="text-2xl font-bold font-display">{project.title}</h3>
                  <p className="text-white/50 text-sm mt-2 max-w-[280px]">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
