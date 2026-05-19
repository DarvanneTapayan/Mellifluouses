/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Cpu, Zap, Wand2, MonitorPlay } from 'lucide-react';

const steps = [
  {
    icon: Cpu,
    title: "Brainstorming & AI Training",
    description: "It starts with an idea. I use custom models and specific prompts to generate the primary aesthetic and character concepts."
  },
  {
    icon: Wand2,
    title: "Iteration & Refinement",
    description: "AI rarely gets it right the first time. I spend hours tweaking parameters, seeds, and weights to get that perfect frame."
  },
  {
    icon: Zap,
    title: "Motion & Animation",
    description: "Using tools like Runway or Luma, I breathe life into static images, focusing on fluid camera movements and cinematic pacing."
  },
  {
    icon: MonitorPlay,
    title: "Post-Processing",
    description: "The final touch happens in the edit. I add sound design, color grading, and custom effects to make the AI output feel truly professional."
  }
];

export default function Process() {
  return (
    <section id="process" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-royal-purple font-bold tracking-[0.2em] uppercase mb-4 block">The Workflow</span>
            <h2 className="font-display text-5xl md:text-7xl font-bold leading-tight">
              HOW THE <span className="text-gradient">MAGIC</span> HAPPENS
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-lg italic">
            Mixing bleeding-edge AI technology with traditional cinematic principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 rounded-[32px] group hover:bg-white/5 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-royal-purple/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-royal-purple transition-all">
                <step.icon className="w-6 h-6 text-royal-purple group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-white/50 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
