/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, LogIn, LogOut, Video, MessageSquare, X } from 'lucide-react';
import { useFirebase } from '../lib/FirebaseProvider';
import { signIn, signOut, db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { user, projects, testimonials } = useFirebase();
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials'>('projects');
  
  // Form States
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [thumb, setThumb] = useState('');
  const [video, setVideo] = useState('');
  const [cat, setCat] = useState<'Cinematic' | 'Experimental' | 'Product'>('Cinematic');

  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tContent, setTContent] = useState('');
  const [tAvatar, setTAvatar] = useState('');

  const isAdmin = user?.email === 'darvanne.tapayan@gmail.com';

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, 'projects'), {
        title,
        description: desc,
        thumbnail: thumb,
        videoUrl: video,
        category: cat,
        createdAt: serverTimestamp()
      });
      setTitle(''); setDesc(''); setThumb(''); setVideo('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    try {
      await addDoc(collection(db, 'testimonials'), {
        name: tName,
        role: tRole,
        content: tContent,
        avatar: tAvatar,
        createdAt: serverTimestamp()
      });
      setTName(''); setTRole(''); setTContent(''); setTAvatar('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!isAdmin) return;
    await deleteDoc(doc(db, coll, id));
  };

  if (!user) {
    return (
      <div className="fixed inset-0 z-[100] glass flex items-center justify-center p-6">
        <div className="bg-midnight p-12 rounded-[40px] border border-white/10 text-center max-w-md w-full shadow-2xl">
          <h2 className="text-3xl font-display font-bold mb-6">ADMIN LOGIN</h2>
          <p className="text-white/50 mb-10 text-lg">Sign in with your Google account to manage your portfolio.</p>
          <button 
            onClick={signIn}
            className="w-full bg-royal-purple hover:bg-electric-purple py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all purple-glow"
          >
            <LogIn className="w-5 h-5" />
            Sign in as Darvanne
          </button>
          <button onClick={onClose} className="mt-6 text-white/30 hover:text-white transition-colors">Close</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] glass flex items-center justify-center p-6 text-center">
        <div className="bg-midnight p-12 rounded-[40px] border border-white/10 max-w-md">
          <p className="text-xl font-bold mb-4">Access Denied</p>
          <p className="text-white/50 mb-8">This dashboard is strictly for Darvanne.</p>
          <button onClick={signOut} className="text-royal-purple font-bold">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-midnight overflow-y-auto p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <img src={user.photoURL!} className="w-12 h-12 rounded-full border border-royal-purple" />
            <div>
              <h1 className="text-2xl font-display font-bold">Hi, Darvanne</h1>
              <p className="text-white/40 text-sm italic">You're in control</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="glass p-3 rounded-xl hover:bg-white/10"><X /></button>
            <button onClick={signOut} className="glass p-3 rounded-xl hover:bg-red-500/20 text-red-400 group flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline font-bold">Log Out</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-12">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'projects' ? 'bg-royal-purple shadow-lg' : 'glass opacity-50'}`}
          >
            <Video className="w-5 h-5" /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === 'testimonials' ? 'bg-royal-purple shadow-lg' : 'glass opacity-50'}`}
          >
            <MessageSquare className="w-5 h-5" /> Testimonials
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Side */}
          <section className="glass p-8 rounded-[32px]">
            <h2 className="text-2xl font-display font-bold mb-8">
              {activeTab === 'projects' ? 'Add New Project' : 'Add New Testimonial'}
            </h2>
            
            {activeTab === 'projects' ? (
              <form onSubmit={handleAddProject} className="space-y-6">
                <input required placeholder="Project Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea required placeholder="Description" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none h-32" value={desc} onChange={e => setDesc(e.target.value)} />
                <input required placeholder="Thumbnail URL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={thumb} onChange={e => setThumb(e.target.value)} />
                <input required placeholder="Video URL (YouTube/Vimeo/Direct)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={video} onChange={e => setVideo(e.target.value)} />
                <select className="w-full bg-midnight border border-white/10 p-4 rounded-xl outline-none" value={cat} onChange={e => setCat(e.target.value as any)}>
                  <option value="Cinematic">Cinematic</option>
                  <option value="Experimental">Experimental</option>
                  <option value="Product">Product</option>
                </select>
                <button className="w-full bg-royal-purple py-4 rounded-xl font-bold hover:bg-electric-purple transition-all">Publish Project</button>
              </form>
            ) : (
              <form onSubmit={handleAddTestimony} className="space-y-6">
                <input required placeholder="Client Name" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={tName} onChange={e => setTName(e.target.value)} />
                <input placeholder="Client Role" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={tRole} onChange={e => setTRole(e.target.value)} />
                <textarea required placeholder="What did they say?" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none h-32" value={tContent} onChange={e => setTContent(e.target.value)} />
                <input placeholder="Avatar URL (optional)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={tAvatar} onChange={e => setTAvatar(e.target.value)} />
                <button className="w-full bg-royal-purple py-4 rounded-xl font-bold hover:bg-electric-purple transition-all">Add Testimony</button>
              </form>
            )}
          </section>

          {/* List Side */}
          <section className="space-y-4">
            <h2 className="text-2xl font-display font-bold mb-8">Manage Content</h2>
            <div className="max-h-[800px] overflow-y-auto pr-2 space-y-4">
              {activeTab === 'projects' ? (
                projects.length === 0 ? <p className="text-white/20 italic">No projects yet...</p> :
                projects.map(p => (
                  <div key={p.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                    <img src={p.thumbnail} className="w-20 h-14 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{p.title}</h4>
                      <p className="text-xs text-white/40">{p.category}</p>
                    </div>
                    <button onClick={() => handleDelete('projects', p.id)} className="p-3 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              ) : (
                testimonials.length === 0 ? <p className="text-white/20 italic">No testimonials yet...</p> :
                testimonials.map(t => (
                  <div key={t.id} className="glass p-4 rounded-2xl flex items-center gap-4">
                    <img src={t.avatar || 'https://i.pravatar.cc/150'} className="w-12 h-12 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate">{t.name}</h4>
                      <p className="text-xs text-white/40 truncate">{t.content}</p>
                    </div>
                    <button onClick={() => handleDelete('testimonials', t.id)} className="p-3 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
