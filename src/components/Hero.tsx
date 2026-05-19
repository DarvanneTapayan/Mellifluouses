/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/src/assets/images/hero_abstract_purple_1779186845239.png" 
          alt="Atmospheric Background"
          className="w-full h-full object-cover opacity-60 scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-midnight via-midnight/40 to-midnight" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Sparkles className="w-4 h-4 text-royal-purple" />
          <span className="text-xs font-semibold tracking-widest uppercase text-white/80">AI Visual Artist & Creator</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-5xl md:text-8xl font-bold leading-tight mb-8"
        >
          HI, I AM <br />
          <span className="text-gradient">DARVANNE TAPAYAN</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          I'm just a guy who loves playing with AI to create weirdly beautiful videos and visuals. Welcome to my personal corner of the internet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
          <a href="#works" className="group bg-royal-purple hover:bg-electric-purple px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all purple-glow">
            See My Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#process" className="glass px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
            How I Do It
          </a>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-10 w-64 h-64 bg-royal-purple/10 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-96 h-96 bg-electric-purple/10 rounded-full blur-3xl"
      />
    </section>
  );
}
