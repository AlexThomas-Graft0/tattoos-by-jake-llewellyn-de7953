'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseAuthed';

interface FlashDesign {
  id: string;
  design_code: string;
  title: string;
  image_url: string;
  estimated_size: string | null;
  estimated_price: number | null;
  status: 'available' | 'claimed';
  created_at: string;
}

export default function FlashManager() {
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [designCode, setDesignCode] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [estimatedSize, setEstimatedSize] = useState<string>('');
  const [estimatedPrice, setEstimatedPrice] = useState<string>('');
  const [status, setStatus] = useState<'available' | 'claimed'>('available');

  const [editingDesign, setEditingDesign] = useState<FlashDesign | null>(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  async function fetchDesigns() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('flash_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setDesigns(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch flash designs');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!designCode.trim() || !title.trim() || !imageUrl.trim()) {
      setError('Design code, title, and image URL are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const priceNum = estimatedPrice.trim() ? parseFloat(estimatedPrice) : null;

      const { data, error: insertError } = await supabase
        .from('flash_designs')
        .insert([
          {
            design_code: designCode.trim().toUpperCase(),
            title: title.trim(),
            image_url: imageUrl.trim(),
            estimated_size: estimatedSize.trim() || null,
            estimated_price: priceNum,
            status: status,
          },
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess(`Flash design ${designCode.toUpperCase()} added successfully!`);
      // Reset inputs
      setDesignCode('');
      setTitle('');
      setImageUrl('');
      setEstimatedSize('');
      setEstimatedPrice('');
      setStatus('available');
      fetchDesigns();
    } catch (err: any) {
      setError(err.message || 'Failed to add flash design. Check for unique Code.');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingDesign) return;
    if (!editingDesign.design_code.trim() || !editingDesign.title.trim() || !editingDesign.image_url.trim()) {
      setError('Required fields must not be empty');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('flash_designs')
        .update({
          design_code: editingDesign.design_code.trim().toUpperCase(),
          title: editingDesign.title.trim(),
          image_url: editingDesign.image_url.trim(),
          estimated_size: editingDesign.estimated_size,
          estimated_price: editingDesign.estimated_price,
          status: editingDesign.status,
        })
        .eq('id', editingDesign.id);

      if (updateError) throw updateError;

      setSuccess(`Updated design ${editingDesign.design_code} successfully!`);
      setEditingDesign(null);
      fetchDesigns();
    } catch (err: any) {
      setError(err.message || 'Failed to update flash design');
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(item: FlashDesign) {
    const nextStatus = item.status === 'available' ? 'claimed' : 'available';
    try {
      setLoading(true);
      setError(null);
      const { error: updateError } = await supabase
        .from('flash_designs')
        .update({ status: nextStatus })
        .eq('id', item.id);

      if (updateError) throw updateError;
      setSuccess(`Marked ${item.design_code} as ${nextStatus}`);
      fetchDesigns();
    } catch (err: any) {
      setError(err.message || 'Failed to toggle status');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this flash design? This will affect any linked booking request references.')) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: deleteError } = await supabase
        .from('flash_designs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Successfully deleted flash design!');
      fetchDesigns();
    } catch (err: any) {
      setError(err.message || 'Failed to delete flash design');
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
        {/* Form panel */}
        <div className="bg-[#1C1C1E] border border-neutral-800 p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-[#D4AF37] font-semibold text-lg mb-4">
            {editingDesign ? 'Edit Flash Design' : 'Add Exclusive Flash Artwork'}
          </h3>

          {editingDesign ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Design Code (Unique)
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingDesign.design_code}
                  onChange={(e) => setEditingDesign({ ...editingDesign, design_code: e.target.value })}
                  placeholder="e.g., JL-OWL-01"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingDesign.title}
                  onChange={(e) => setEditingDesign({ ...editingDesign, title: e.target.value })}
                  placeholder="e.g., The Sentinel Owl"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Image URL (HTTPS only)
                </label>
                <input
                  type="url"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingDesign.image_url}
                  onChange={(e) => setEditingDesign({ ...editingDesign, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                    Est. Size
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                    value={editingDesign.estimated_size || ''}
                    onChange={(e) => setEditingDesign({ ...editingDesign, estimated_size: e.target.value })}
                    placeholder="e.g., 15cm x 12cm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                    Est. Price (£)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                    value={editingDesign.estimated_price || ''}
                    onChange={(e) =>
                      setEditingDesign({
                        ...editingDesign,
                        estimated_price: e.target.value ? parseFloat(e.target.value) : null,
                      })
                    }
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Status
                </label>
                <select
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingDesign.status}
                  onChange={(e) =>
                    setEditingDesign({ ...editingDesign, status: e.target.value as 'available' | 'claimed' })
                  }
                >
                  <option value="available">Available</option>
                  <option value="claimed">Claimed</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#D4AF37] text-[#121214] text-xs font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingDesign(null)}
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
                  Design Code (e.g., JL-OWL-01)
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={designCode}
                  onChange={(e) => setDesignCode(e.target.value)}
                  placeholder="JL-OWL-01"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Sentinel Owl"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Image URL (HTTPS only)
                </label>
                <input
                  type="url"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                    Est. Size
                  </label>
                  <input
                    type="text"
                    className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                    value={estimatedSize}
                    onChange={(e) => setEstimatedSize(e.target.value)}
                    placeholder="15cm x 12cm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                    Est. Price (£)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                    value={estimatedPrice}
                    onChange={(e) => setEstimatedPrice(e.target.value)}
                    placeholder="e.g. 180"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Initial Status
                </label>
                <select
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'available' | 'claimed')}
                >
                  <option value="available">Available</option>
                  <option value="claimed">Claimed</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#121214] text-xs font-bold py-2.5 rounded hover:opacity-90 disabled:opacity-50 transition uppercase tracking-wider"
              >
                Add Flash Design
              </button>
            </form>
          )}
        </div>

        {/* List of Flash items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-white font-semibold text-lg">Exclusive Flash Designs</h3>
            <p className="text-xs text-[#9CA3AF]">
              Once claimed, the card opacity is lowered on the main site to maintain exclusivity.
            </p>
          </div>

          {loading && designs.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              Loading flash designs...
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-12 bg-[#1C1C1E] border border-dashed border-neutral-800 rounded text-neutral-500 text-sm">
              No flash designs found. Start adding some!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className={`bg-[#1C1C1E] border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between transition ${
                    design.status === 'claimed' ? 'opacity-70' : ''
                  }`}
                >
                  <div className="relative h-44 bg-neutral-900 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={design.image_url}
                      alt={design.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/80 text-[#D4AF37] text-[11px] font-mono font-bold px-2 py-0.5 rounded">
                      {design.design_code}
                    </div>

                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          design.status === 'available'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {design.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white font-medium text-sm mb-1">{design.title}</h4>
                      <p className="text-xs text-neutral-400">
                        Size: <span className="text-neutral-200">{design.estimated_size || 'N/A'}</span>
                      </p>
                      <p className="text-xs text-neutral-400">
                        Price:{' '}
                        <span className="text-[#D4AF37] font-semibold">
                          {design.estimated_price ? `£${design.estimated_price}` : 'Quote on booking'}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-800/60 pt-3 mt-3">
                      <button
                        onClick={() => toggleStatus(design)}
                        className={`text-[11px] font-medium px-2 py-1 rounded transition ${
                          design.status === 'available'
                            ? 'bg-emerald-900/20 text-emerald-300 hover:bg-emerald-900/40 border border-emerald-900/40'
                            : 'bg-amber-900/20 text-amber-300 hover:bg-amber-900/40 border border-amber-900/40'
                        }`}
                      >
                        Set {design.status === 'available' ? 'Claimed' : 'Available'}
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingDesign(design)}
                          className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] px-2 py-1 bg-neutral-800 rounded transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(design.id)}
                          className="text-xs text-red-400 hover:text-red-500 px-2 py-1 bg-red-950/20 rounded border border-red-900/30 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}