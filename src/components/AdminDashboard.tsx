/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, LogIn, LogOut, Video, MessageSquare, X, HardDrive, RefreshCcw } from 'lucide-react';
import { useFirebase } from '../lib/FirebaseProvider';
import { signIn, signOutUser, db, getAccessToken, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  webViewLink?: string;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const { user, projects, testimonials } = useFirebase();
  const [activeTab, setActiveTab] = useState<'projects' | 'testimonials'>('projects');
  
  // Drive selection state
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [showDrivePicker, setShowDrivePicker] = useState(false);

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

  const [debugMsg, setDebugMsg] = useState('');

  const fetchDriveFiles = async () => {
    const token = getAccessToken();
    if (!token) {
      alert("No access token found. Trying to re-auth...");
      await signIn();
      return;
    }
    
    setIsDriveLoading(true);
    try {
      // Query for videos
      const query = "mimeType contains 'video/' and trashed = false";
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,thumbnailLink,webViewLink)&pageSize=20`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.files) {
        setDriveFiles(data.files);
        setShowDrivePicker(true);
      }
    } catch (err) {
      console.error("Error fetching drive files:", err);
    } finally {
      setIsDriveLoading(false);
    }
  };

  const selectDriveFile = (file: DriveFile) => {
    // Convert to preview link for embedding
    const embedUrl = `https://drive.google.com/file/d/${file.id}/preview`;
    setVideo(embedUrl);
    if (!title) setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension for title
    if (file.thumbnailLink) setThumb(file.thumbnailLink.replace(/=s[0-9]+$/, "=s1200")); // Get higher res thumbnail
    setShowDrivePicker(false);
  };

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
      setDebugMsg("Last action: Project added successfully!");
      alert("Project added successfully!");
    } catch (err: any) {
      console.error(err);
      const errString = handleFirestoreError(err, OperationType.CREATE, 'projects');
      setDebugMsg("Error adding project: " + err.message);
      alert("Failed to add project: " + errString);
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
      setDebugMsg("Last action: Testimonial added successfully!");
      alert("Testimonial added successfully!");
    } catch (err: any) {
      console.error(err);
      const errString = handleFirestoreError(err, OperationType.CREATE, 'testimonials');
      setDebugMsg("Error adding testimony: " + err.message);
      alert("Failed to add testimonial: " + errString);
    }
  };

  const handleDelete = async (coll: string, id: string) => {
    if (!isAdmin) return;
    if (!window.confirm("Sure about this?")) return;
    try {
      await deleteDoc(doc(db, coll, id));
      setDebugMsg(`Last action: Deleted from ${coll}`);
    } catch (err: any) {
      const errString = handleFirestoreError(err, OperationType.DELETE, `${coll}/${id}`);
      setDebugMsg(`Error deleting: ${err.message}`);
      alert("Failed to delete: " + errString);
    }
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
          <p className="text-white/50 mb-8">This dashboard is strictly for Darvanne (found user: {user.email}).</p>
          <button onClick={signOutUser} className="text-royal-purple font-bold">Sign Out</button>
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
            <button onClick={signOutUser} className="glass p-3 rounded-xl hover:bg-red-500/20 text-red-400 group flex items-center gap-2">
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
          {debugMsg && <span className="flex-1 text-xs text-royal-purple/60 italic self-center truncate ml-4">{debugMsg}</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Side */}
          <section className="glass p-8 rounded-[32px] relative">
            <h2 className="text-2xl font-display font-bold mb-8">
              {activeTab === 'projects' ? 'Add New Project' : 'Add New Testimonial'}
            </h2>
            
            {activeTab === 'projects' ? (
              <form onSubmit={handleAddProject} className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-sm font-bold text-white/40 uppercase">G-Drive Integration</span>
                  <button 
                    type="button"
                    onClick={fetchDriveFiles}
                    disabled={isDriveLoading}
                    className="flex items-center gap-2 text-royal-purple hover:text-electric-purple font-bold text-sm transition-colors"
                  >
                    {isDriveLoading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
                    Browse my Drive
                  </button>
                </div>

                <input required placeholder="Project Title" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea required placeholder="Description" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none h-32" value={desc} onChange={e => setDesc(e.target.value)} />
                <input required placeholder="Thumbnail URL" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={thumb} onChange={e => setThumb(e.target.value)} />
                <input required placeholder="Video URL (Drive Link)" className="w-full bg-white/5 border border-white/10 p-4 rounded-xl focus:border-royal-purple outline-none" value={video} onChange={e => setVideo(e.target.value)} />
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

            {/* Drive File Picker Modal-ish */}
            {showDrivePicker && (
              <div className="absolute inset-0 bg-midnight/95 rounded-[32px] p-8 z-20 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Select Video from Drive</h3>
                  <button onClick={() => setShowDrivePicker(false)} className="opacity-50 hover:opacity-100"><X /></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {driveFiles.map(file => (
                    <button 
                      key={file.id}
                      onClick={() => selectDriveFile(file)}
                      className="w-full flex items-center gap-4 bg-white/5 p-3 rounded-xl hover:bg-royal-purple/20 transition-all text-left"
                    >
                      {file.thumbnailLink ? (
                        <img src={file.thumbnailLink} className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center"><Video className="w-6 h-6 opacity-20" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate text-sm">{file.name}</p>
                        <p className="text-[10px] opacity-40 uppercase">{file.mimeType.split('/')[1]}</p>
                      </div>
                    </button>
                  ))}
                  {driveFiles.length === 0 && <p className="text-center opacity-30 mt-10">No videos found in your Drive.</p>}
                </div>
              </div>
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
