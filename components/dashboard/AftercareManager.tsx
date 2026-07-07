'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseAuthed';

interface AftercareGuide {
  id: string;
  title: string;
  section_type: 'pre-appointment' | 'post-tattoo';
  content: string;
  display_order: number;
  created_at: string;
}

export default function AftercareManager() {
  const [guides, setGuides] = useState<AftercareGuide[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [sectionType, setSectionType] = useState<'pre-appointment' | 'post-tattoo'>('post-tattoo');
  const [content, setContent] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<string>('0');

  const [editingGuide, setEditingGuide] = useState<AftercareGuide | null>(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  async function fetchGuides() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('aftercare_guides')
        .select('*')
        .order('section_type', { ascending: true })
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setGuides(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch aftercare guides');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data, error: insertError } = await supabase
        .from('aftercare_guides')
        .insert([
          {
            title: title.trim(),
            section_type: sectionType,
            content: content.trim(),
            display_order: parseInt(displayOrder) || 0,
          },
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess('Successfully added aftercare instruction!');
      setTitle('');
      setContent('');
      setDisplayOrder('0');
      fetchGuides();
    } catch (err: any) {
      setError(err.message || 'Failed to add aftercare guide');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGuide) return;
    if (!editingGuide.title.trim() || !editingGuide.content.trim()) {
      setError('Title and Content cannot be empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('aftercare_guides')
        .update({
          title: editingGuide.title.trim(),
          section_type: editingGuide.section_type,
          content: editingGuide.content.trim(),
          display_order: editingGuide.display_order,
        })
        .eq('id', editingGuide.id);

      if (updateError) throw updateError;

      setSuccess('Successfully updated aftercare guide!');
      setEditingGuide(null);
      fetchGuides();
    } catch (err: any) {
      setError(err.message || 'Failed to update aftercare guide');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this aftercare step?')) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: deleteError } = await supabase
        .from('aftercare_guides')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Successfully deleted guide step!');
      fetchGuides();
    } catch (err: any) {
      setError(err.message || 'Failed to delete guide step');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Notifications */}
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-200 p-4 rounded-md text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-900/30 border border-emerald-500 text-emerald-200 p-4 rounded-md text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-[#D4AF37] font-semibold text-lg mb-4">
            {editingGuide ? 'Edit Aftercare Step' : 'Add Aftercare Step'}
          </h3>

          {editingGuide ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingGuide.title}
                  onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                  placeholder="e.g. Phase 1: The First 2 to 4 Hours"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Section / Column
                </label>
                <select
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingGuide.section_type}
                  onChange={(e) =>
                    setEditingGuide({
                      ...editingGuide,
                      section_type: e.target.value as 'pre-appointment' | 'post-tattoo',
                    })
                  }
                >
                  <option value="pre-appointment">Pre-Appointment (How to Prepare)</option>
                  <option value="post-tattoo">Post-Tattoo (The Healing Process)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingGuide.display_order}
                  onChange={(e) =>
                    setEditingGuide({ ...editingGuide, display_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Content Details
                </label>
                <textarea
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm h-36"
                  value={editingGuide.content}
                  onChange={(e) => setEditingGuide({ ...editingGuide, content: e.target.value })}
                  placeholder="Provide explicit instructions for the client..."
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#D4AF37] text-[#121214] text-xs font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
                >
                  Update Step
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGuide(null)}
                  className="flex-1 bg-neutral-800 text-white text-xs font-bold py-2 rounded hover:bg-neutral-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Step 1: Stay Hydrated & Eat Well"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Section / Column
                </label>
                <select
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={sectionType}
                  onChange={(e) => setSectionType(e.target.value as 'pre-appointment' | 'post-tattoo')}
                >
                  <option value="pre-appointment">Pre-Appointment (How to Prepare)</option>
                  <option value="post-tattoo">Post-Tattoo (The Healing Process)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Content Details
                </label>
                <textarea
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm h-36"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Keep it friendly and concise. e.g. Drink plenty of water the day before..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#121214] text-xs font-bold py-2.5 rounded hover:opacity-90 disabled:opacity-50 transition uppercase tracking-wider"
              >
                Add Aftercare Step
              </button>
            </form>
          )}
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pre-appointment */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold text-md mb-3 pb-1 border-b border-neutral-800">
              Pre-Session Preparation (How to Prepare)
            </h3>

            {loading && guides.length === 0 ? (
              <div className="text-xs text-neutral-500">Loading guide entries...</div>
            ) : guides.filter((g) => g.section_type === 'pre-appointment').length === 0 ? (
              <div className="text-xs text-neutral-500 italic p-4 bg-[#1C1C1E] rounded">
                No pre-session items configured.
              </div>
            ) : (
              <div className="space-y-3">
                {guides
                  .filter((g) => g.section_type === 'pre-appointment')
                  .map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-[#1C1C1E] border border-neutral-800 p-4 rounded-lg flex justify-between items-start"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-[#D4AF37] bg-amber-950/40 px-1.5 py-0.5 rounded">
                            Order {guide.display_order}
                          </span>
                          <h4 className="text-white font-semibold text-sm">{guide.title}</h4>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-wrap">
                          {guide.content}
                        </p>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingGuide(guide)}
                          className="text-[11px] text-[#9CA3AF] hover:text-[#D4AF37] bg-neutral-800 px-2 py-1 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(guide.id)}
                          className="text-[11px] text-red-400 hover:text-red-500 bg-red-950/20 border border-red-900/30 px-2 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Post-tattoo */}
          <div>
            <h3 className="text-emerald-400 font-semibold text-md mb-3 pb-1 border-b border-neutral-800">
              Post-Session Healing (The Healing Process)
            </h3>

            {loading && guides.length === 0 ? (
              <div className="text-xs text-neutral-500">Loading...</div>
            ) : guides.filter((g) => g.section_type === 'post-tattoo').length === 0 ? (
              <div className="text-xs text-neutral-500 italic p-4 bg-[#1C1C1E] rounded">
                No post-tattoo items configured.
              </div>
            ) : (
              <div className="space-y-3">
                {guides
                  .filter((g) => g.section_type === 'post-tattoo')
                  .map((guide) => (
                    <div
                      key={guide.id}
                      className="bg-[#1C1C1E] border border-neutral-800 p-4 rounded-lg flex justify-between items-start"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded">
                            Order {guide.display_order}
                          </span>
                          <h4 className="text-white font-semibold text-sm">{guide.title}</h4>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed whitespace-pre-wrap">
                          {guide.content}
                        </p>
                      </div>

                      <div className="flex space-x-1">
                        <button
                          onClick={() => setEditingGuide(guide)}
                          className="text-[11px] text-[#9CA3AF] hover:text-[#D4AF37] bg-neutral-800 px-2 py-1 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(guide.id)}
                          className="text-[11px] text-red-400 hover:text-red-500 bg-red-950/20 border border-red-900/30 px-2 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}