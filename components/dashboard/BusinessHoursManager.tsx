'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseAuthed';

interface BusinessHour {
  id: string;
  day_of_week: string;
  is_open: boolean;
  open_time: string | null;
  close_time: string | null;
  created_at: string;
}

export default function BusinessHoursManager() {
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [is_open, setIsOpen] = useState<boolean>(true);
  const [open_time, setOpenTime] = useState<string>('10:00');
  const [close_time, setCloseTime] = useState<string>('18:00');

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('business_hours')
        .select('*')
        .order('created_at', { ascending: true }); // Standard ordering or manual week sorting

      if (fetchError) throw fetchError;

      // Let's sort manually in standard week order
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const sorted = (data || []).sort((a, b) => {
        return dayOrder.indexOf(a.day_of_week) - dayOrder.indexOf(b.day_of_week);
      });

      setHours(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch business hours');
    } finally {
      setLoading(false);
    }
  }

  function startEdit(item: BusinessHour) {
    setEditingId(item.id);
    setIsOpen(item.is_open);
    
    // Normalize times from "10:00:00" to "10:00"
    const parsedOpen = item.open_time ? item.open_time.substring(0, 5) : '10:00';
    const parsedClose = item.close_time ? item.close_time.substring(0, 5) : '18:00';
    setOpenTime(parsedOpen);
    setCloseTime(parsedClose);
  }

  async function handleSave(id: string, day: string) {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { error: updateError } = await supabase
        .from('business_hours')
        .update({
          is_open: is_open,
          open_time: is_open ? open_time : null,
          close_time: is_open ? close_time : null,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(`Updated business hours for ${day}!`);
      setEditingId(null);
      fetchHours();
    } catch (err: any) {
      setError(err.message || 'Failed to update business hours');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
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

      <div className="border-b border-neutral-800 pb-4">
        <h3 className="text-white font-semibold text-lg">Weekly Operating Schedule</h3>
        <p className="text-xs text-[#9CA3AF]">
          Configures the live header status and the contact table information.
        </p>
      </div>

      <div className="bg-[#1C1C1E] border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-[#121214] text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              <th className="p-4">Day of Week</th>
              <th className="p-4">Status</th>
              <th className="p-4">Open Time</th>
              <th className="p-4">Close Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60 text-sm text-neutral-200">
            {hours.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <tr
                  key={item.id}
                  className={`hover:bg-neutral-800/20 transition ${
                    isEditing ? 'bg-amber-950/10' : ''
                  }`}
                >
                  <td className="p-4 font-semibold text-white">{item.day_of_week}</td>
                  <td className="p-4">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`is_open_${item.id}`}
                          className="rounded border-neutral-700 bg-neutral-900 text-[#D4AF37] focus:ring-[#D4AF37]"
                          checked={is_open}
                          onChange={(e) => setIsOpen(e.target.checked)}
                        />
                        <label htmlFor={`is_open_${item.id}`} className="text-xs text-neutral-300">
                          Open for Business
                        </label>
                      </div>
                    ) : (
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                          item.is_open
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                            : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}
                      >
                        {item.is_open ? 'Open' : 'Closed'}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {isEditing ? (
                      <input
                        type="time"
                        disabled={!is_open}
                        className="bg-[#121214] border border-neutral-700 rounded p-1 text-white focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
                        value={open_time}
                        onChange={(e) => setOpenTime(e.target.value)}
                      />
                    ) : item.is_open && item.open_time ? (
                      item.open_time.substring(0, 5)
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-xs">
                    {isEditing ? (
                      <input
                        type="time"
                        disabled={!is_open}
                        className="bg-[#121214] border border-neutral-700 rounded p-1 text-white focus:outline-none focus:border-[#D4AF37] disabled:opacity-40"
                        value={close_time}
                        onChange={(e) => setCloseTime(e.target.value)}
                      />
                    ) : item.is_open && item.close_time ? (
                      item.close_time.substring(0, 5)
                    ) : (
                      <span className="text-neutral-500">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {isEditing ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleSave(item.id, item.day_of_week)}
                          disabled={loading}
                          className="bg-[#D4AF37] text-[#121214] text-xs font-bold px-3 py-1 rounded hover:opacity-90 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-neutral-800 text-white text-xs font-bold px-3 py-1 rounded hover:bg-neutral-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEdit(item)}
                        className="text-xs text-[#9CA3AF] hover:text-[#D4AF37] bg-neutral-800 px-3 py-1 rounded transition"
                      >
                        Adjust Times
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-[#1C1C1E] border border-neutral-800 p-4 rounded-lg">
        <h4 className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-1">
          Dynamic Hours Indicator Logic
        </h4>
        <p className="text-xs text-neutral-400 leading-relaxed">
          The public-facing header will display a Gold Dot and say 
          <strong className="text-neutral-200"> &ldquo;Studio Open &mdash; Creative Sessions in Progress&rdquo; </strong> 
          if the current local time falls within the configured open day&apos;s hour slots. Otherwise, it defaults to closed status.
        </p>
      </div>
    </div>
  );
}