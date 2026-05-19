/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { useFirebase } from '../lib/FirebaseProvider';

export default function Testimonials() {
  const { testimonials: dbTestimonials } = useFirebase();
  const items = dbTestimonials.length > 0 ? dbTestimonials : TESTIMONIALS;

  return (
    <section id="testimonials" className="py-24 px-6 bg-obsidian relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-royal-purple/5 rounded-full blur-[120px]" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">LOVE FROM FRIENDS</h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">Some kind words from the awesome people I've had the chance to work with.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((testimony, index) => (
            <motion.div
              key={testimony.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass p-10 rounded-[32px] relative group"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-royal-purple/20 group-hover:text-royal-purple/40 transition-colors" />
              
              <p className="text-xl md:text-2xl leading-relaxed mb-10 text-white/90">
                "{testimony.content}"
              </p>

              <div className="flex items-center gap-4">
                <img 
                  src={testimony.avatar || 'https://i.pravatar.cc/150'} 
                  alt={testimony.name}
                  className="w-14 h-14 rounded-full border-2 border-royal-purple/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-lg">{testimony.name}</h4>
                  <p className="text-white/40 text-sm">{testimony.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
