'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseAuthed';

interface PortfolioItem {
  id: string;
  image_url: string;
  title: string;
  style_category: string;
  created_at: string;
}

export default function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [styleCategory, setStyleCategory] = useState<string>('Black & Grey');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Filter category in Admin view
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = [
    'Black & Grey',
    'Traditional',
    'Fine Line',
    'Colour',
    'Cover-up',
    'Geometric',
    'Other'
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch portfolio items');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setError('Title and Image URL are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data, error: insertError } = await supabase
        .from('portfolio_items')
        .insert([
          {
            title: title.trim(),
            image_url: imageUrl.trim(),
            style_category: styleCategory,
          },
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess('Successfully added portfolio item!');
      setTitle('');
      setImageUrl('');
      setStyleCategory('Black & Grey');
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to add portfolio item');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.title.trim() || !editingItem.image_url.trim()) {
      setError('Title and Image URL are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('portfolio_items')
        .update({
          title: editingItem.title.trim(),
          image_url: editingItem.image_url.trim(),
          style_category: editingItem.style_category,
        })
        .eq('id', editingItem.id);

      if (updateError) throw updateError;

      setSuccess('Successfully updated portfolio item!');
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to update portfolio item');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: deleteError } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Successfully deleted portfolio item!');
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete portfolio item');
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = filterCategory === 'All'
    ? items
    : items.filter(item => item.style_category === filterCategory);

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
            {editingItem ? 'Edit Portfolio Item' : 'Add New Portfolio Work'}
          </h3>

          {editingItem ? (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g., Realistic Lion & Compass"
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Image URL (HTTPS only)
                </label>
                <input
                  type="url"
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingItem.image_url}
                  onChange={(e) => setEditingItem({ ...editingItem, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Style Category
                </label>
                <select
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={editingItem.style_category}
                  onChange={(e) => setEditingItem({ ...editingItem, style_category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#D4AF37] text-[#121214] text-xs font-bold py-2 rounded hover:opacity-90 disabled:opacity-50 transition"
                >
                  Update Item
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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
                  placeholder="e.g., Delicate Floral Bouquet"
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
                  placeholder="https://images.unsplash.com/photo-..."
                />
              </div>

              <div>
                <label className="block text-xs text-[#9CA3AF] font-semibold uppercase mb-1">
                  Style Category
                </label>
                <select
                  className="w-full bg-[#121214] border border-neutral-700 rounded p-2 text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none text-sm"
                  value={styleCategory}
                  onChange={(e) => setStyleCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-[#121214] text-xs font-bold py-2..5 rounded hover:opacity-90 disabled:opacity-50 transition uppercase tracking-wider"
              >
                Add to Portfolio
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-neutral-800 pt-4">
            <h4 className="text-xs text-[#9CA3AF] font-semibold uppercase mb-2">
              Reference Placement
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Ensure you use high resolution, well-lit images. Hotlinking from reliable cloud hosts or storage works best. Keep categories accurate so clients can filter easily.
            </p>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-neutral-800">
            <div>
              <h3 className="text-white font-semibold text-lg">Portfolio Works</h3>
              <p className="text-xs text-[#9CA3AF]">
                Manage public work pieces displayed in the primary portfolio section
              </p>
            </div>

            {/* Filter */}
            <select
              className="bg-[#1C1C1E] border border-neutral-700 rounded px-3 py-1.5 text-xs text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {loading && items.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              Loading portfolio items...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-[#1C1C1E] border border-dashed border-neutral-800 rounded text-neutral-500 text-sm">
              No portfolio items found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#1C1C1E] border border-neutral-800 rounded-lg overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-40 bg-neutral-900 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/80 text-[#D4AF37] text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      {item.style_category}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="text-white font-medium text-sm mb-2 line-clamp-1">
                      {item.title}
                    </h4>

                    <div className="flex items-center justify-end space-x-2 border-t border-neutral-800/60 pt-3 mt-2">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] px-2 py-1 bg-neutral-800/80 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-red-400 hover:text-red-500 px-2 py-1 bg-red-950/20 rounded border border-red-900/30 transition"
                      >
                        Delete
                      </button>
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