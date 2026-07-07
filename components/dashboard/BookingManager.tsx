'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseAuthed';

interface FlashDesign {
  id: string;
  design_code: string;
  title: string;
}

interface BookingRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  idea_description: string;
  placement_area: string;
  estimated_size_cm: string;
  reference_images: string[];
  preferred_days: string[];
  flash_design_id: string | null;
  status: 'pending' | 'contacted' | 'booked' | 'archived';
  created_at: string;
  flash_designs?: FlashDesign | null;
}

export default function BookingManager() {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      setError(null);
      
      // Let's perform a join query with flash_designs
      const { data, error: fetchError } = await supabase
        .from('booking_requests')
        .select(`
          *,
          flash_designs(id, design_code, title)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setBookings(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking requests');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: BookingRequest['status']) {
    try {
      setError(null);
      setSuccess(null);
      const { error: updateError } = await supabase
        .from('booking_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(`Booking status updated to ${newStatus}`);
      
      // Update local state if the selectedBooking is active
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }

      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to update booking status');
    }
  }

  async function deleteBooking(id: string) {
    if (!confirm('Are you sure you want to permanently delete this booking request? This action cannot be undone.')) return;

    try {
      setError(null);
      setSuccess(null);
      const { error: deleteError } = await supabase
        .from('booking_requests')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      setSuccess('Booking request deleted successfully.');
      setSelectedBooking(null);
      fetchBookings();
    } catch (err: any) {
      setError(err.message || 'Failed to delete booking request');
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-white font-semibold text-xl">Booking &amp; Design Enquiries</h3>
          <p className="text-xs text-[#9CA3AF]">
            Review incoming requests, verify reference photos, and update conversation status
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#9CA3AF]">Filter Status:</span>
          <select
            className="bg-[#1C1C1E] border border-neutral-700 rounded px-3 py-1.5 text-xs text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Submissions</option>
            <option value="pending">Pending Review</option>
            <option value="contacted">Contacted</option>
            <option value="booked">Booked</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Bookings List Column */}
        <div className="xl:col-span-2 space-y-3">
          {loading && bookings.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              Loading booking requests...
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12 bg-[#1C1C1E] border border-dashed border-neutral-800 rounded text-neutral-500 text-sm">
              No booking requests match the current filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookings.map((req) => {
                const isSelected = selectedBooking?.id === req.id;
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedBooking(req)}
                    className={`p-4 rounded-lg border text-left cursor-pointer transition ${
                      isSelected
                        ? 'bg-neutral-800/40 border-[#D4AF37]'
                        : 'bg-[#1C1C1E] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-white font-semibold text-sm mr-2">
                          {req.client_name}
                        </span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {new Date(req.created_at).toLocaleDateString('en-GB')}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {req.flash_designs && (
                          <span className="bg-amber-950/40 text-[#D4AF37] border border-amber-900/30 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                            Flash {req.flash_designs.design_code}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wide ${
                            req.status === 'pending'
                              ? 'bg-amber-500/10 text-[#D4AF37] border border-amber-500/20'
                              : req.status === 'contacted'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : req.status === 'booked'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                          }`}
                        >
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 mt-2 line-clamp-2 italic leading-relaxed">
                      &ldquo;{req.idea_description}&rdquo;
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 pt-2 border-t border-neutral-800/60 text-[11px] text-[#9CA3AF]">
                      <div>
                        Placement:{' '}
                        <span className="text-neutral-300 font-medium">{req.placement_area}</span>
                      </div>
                      <div>
                        Size:{' '}
                        <span className="text-neutral-300 font-medium">{req.estimated_size_cm}</span>
                      </div>
                      <div>
                        Images:{' '}
                        <span className="text-neutral-300 font-medium">
                          {req.reference_images ? req.reference_images.length : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Details Column */}
        <div className="bg-[#1C1C1E] border border-neutral-800 rounded-lg p-6 h-fit space-y-6">
          {selectedBooking ? (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedBooking.client_name}</h3>
                    <p className="text-xs text-[#9CA3AF]">{selectedBooking.client_email}</p>
                    <p className="text-xs text-[#9CA3AF]">{selectedBooking.client_phone}</p>
                  </div>
                  <button
                    onClick={() => deleteBooking(selectedBooking.id)}
                    className="text-xs text-red-400 hover:text-red-500 bg-red-950/20 border border-red-900/30 px-2.5 py-1 rounded transition"
                  >
                    Delete Request
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs text-neutral-400 self-center">Status Action:</span>
                  <select
                    className="bg-[#121214] border border-neutral-700 rounded px-2.5 py-1 text-xs text-[#F3F4F6] focus:border-[#D4AF37] focus:outline-none"
                    value={selectedBooking.status}
                    onChange={(e) =>
                      updateStatus(selectedBooking.id, e.target.value as BookingRequest['status'])
                    }
                  >
                    <option value="pending">Set Pending</option>
                    <option value="contacted">Set Contacted</option>
                    <option value="booked">Set Booked</option>
                    <option value="archived">Set Archived</option>
                  </select>
                </div>
              </div>

              {/* Tattoo Concept Details */}
              <div className="space-y-2">
                <h4 className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                  The Tattoo Concept
                </h4>
                {selectedBooking.flash_designs && (
                  <div className="bg-[#121214] p-3 rounded border border-amber-900/20 mb-2">
                    <p className="text-xs text-[#D4AF37] font-semibold">
                      Claiming Pre-Drawn Flash Design
                    </p>
                    <p className="text-xs text-neutral-300">
                      Code: {selectedBooking.flash_designs.design_code} &mdash; &ldquo;
                      {selectedBooking.flash_designs.title}&rdquo;
                    </p>
                  </div>
                )}
                <div className="bg-[#121214] p-4 rounded border border-neutral-800 text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                  {selectedBooking.idea_description}
                </div>
              </div>

              {/* Placement and Details */}
              <div className="grid grid-cols-2 gap-4 bg-[#121214] p-4 rounded border border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-500 block uppercase font-semibold text-[10px] mb-1">
                    Body Location
                  </span>
                  <span className="text-white text-sm font-medium">
                    {selectedBooking.placement_area}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block uppercase font-semibold text-[10px] mb-1">
                    Estimated Size
                  </span>
                  <span className="text-white text-sm font-medium">
                    {selectedBooking.estimated_size_cm}
                  </span>
                </div>
              </div>

              {/* Preferred Days */}
              <div>
                <h4 className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-2">
                  Client Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBooking.preferred_days && selectedBooking.preferred_days.length > 0 ? (
                    selectedBooking.preferred_days.map((day) => (
                      <span
                        key={day}
                        className="bg-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded"
                      >
                        {day}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-neutral-500">No preference specified</span>
                  )}
                </div>
              </div>

              {/* Reference Images */}
              <div>
                <h4 className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-2">
                  Reference Images ({selectedBooking.reference_images?.length || 0})
                </h4>
                {selectedBooking.reference_images && selectedBooking.reference_images.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedBooking.reference_images.map((img, idx) => (
                      <a
                        key={idx}
                        href={img}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square bg-neutral-900 border border-neutral-800 rounded overflow-hidden group block hover:border-[#D4AF37] transition"
                        title="Click to view full image in a new tab"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Reference ${idx + 1}`}
                          className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-white font-medium transition duration-200">
                          View Original
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">No reference images provided</p>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-500 space-y-1">
                <p>
                  Contact this client at{' '}
                  <a
                    href={`mailto:${selectedBooking.client_email}`}
                    className="text-[#D4AF37] hover:underline"
                  >
                    {selectedBooking.client_email}
                  </a>{' '}
                  or{' '}
                  <a
                    href={`tel:${selectedBooking.client_phone}`}
                    className="text-[#D4AF37] hover:underline"
                  >
                    {selectedBooking.client_phone}
                  </a>
                </p>
                <p>Ensure you align pricing, sketch expectations, and deposit details manually.</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500 space-y-2">
              <div className="text-4xl text-neutral-600">📥</div>
              <p className="text-sm">Select a booking request from the list to view full details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}