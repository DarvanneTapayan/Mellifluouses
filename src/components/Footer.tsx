/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Instagram, Twitter, Linkedin, Youtube, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-royal-purple rounded-xl flex items-center justify-center">
                <span className="font-display font-bold text-xl">M</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-tighter uppercase">Mellifluouses</span>
            </div>
            <p className="text-white/40 leading-relaxed">
              Just a human and his machines making cool stuff. Exploring the intersection of pure creativity and AI.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-24">
            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest text-white/30 mb-8">Navigation</h5>
              <ul className="flex flex-col gap-4 text-white/60">
                <li><a href="#" className="hover:text-royal-purple transition-colors">About Me</a></li>
                <li><a href="#" className="hover:text-royal-purple transition-colors">Showreel</a></li>
                <li><a href="#" className="hover:text-royal-purple transition-colors">Say Hi</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-xs uppercase tracking-widest text-white/30 mb-8">What I Do</h5>
              <ul className="flex flex-col gap-4 text-white/60">
                <li><a href="#" className="hover:text-royal-purple transition-colors">AI Video</a></li>
                <li><a href="#" className="hover:text-royal-purple transition-colors">Experiments</a></li>
                <li><a href="#" className="hover:text-royal-purple transition-colors">Visual Art</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-white/20 text-sm italic">
            © 2026 Mellifluouses. All rights reserved. Built with passion and AI.
          </p>

          <div className="flex items-center gap-6">
            {[Instagram, Twitter, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="text-white/30 hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </a>
            ))}
            <button 
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-royal-purple transition-all group"
            >
              <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
