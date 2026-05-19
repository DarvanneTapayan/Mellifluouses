import { VideoProject, Testimony } from '../types';

export const VIDEO_PROJECTS: VideoProject[] = [
  {
    id: '1',
    title: 'Neon Genesis',
    description: 'A cinematic exploration of a cyberpunk metropolis realized through advanced AI diffusion models.',
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200',
    videoUrl: '#',
    category: 'Cinematic'
  },
  {
    id: '2',
    title: 'Abstract Echoes',
    description: 'Experimental fluid simulations driven by neural network interpretations of classical music.',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    videoUrl: '#',
    category: 'Experimental'
  },
  {
    id: '3',
    title: 'Digital Fragrance',
    description: 'AI-generated product showcase for a speculative luxury perfume brand.',
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    videoUrl: '#',
    category: 'Product'
  }
];

export const TESTIMONIALS: Testimony[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Creative Director at Flux Media',
    content: "The way the AI handles lighting and motion is unlike anything we've seen. Truly a glimpse into the future of storytelling.",
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'Founder of Arclight Studios',
    content: 'Collaborating on the Neon Genesis project was seamless. The turnaround time and quality were impeccable.',
    avatar: 'https://i.pravatar.cc/150?u=marcus'
  }
];
