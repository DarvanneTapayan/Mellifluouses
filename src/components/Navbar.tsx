/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Menu, X, Play } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-2xl px-8 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-royal-purple rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight uppercase">Mellifluouses</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Works', 'Testimonials', 'Process', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-white/70 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
          <a href="#contact" className="bg-royal-purple hover:bg-electric-purple px-5 py-2 rounded-xl transition-all font-semibold purple-glow">
            Say Hello
          </a>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-4 glass rounded-2xl p-6 flex flex-col gap-4 text-center"
        >
          {['Works', 'Testimonials', 'Process', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              {item}
            </a>
          ))}
          <a href="#contact" onClick={() => setIsOpen(false)} className="bg-royal-purple px-5 py-3 rounded-xl font-semibold">
            Start Project
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
