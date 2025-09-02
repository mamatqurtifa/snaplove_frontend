"use client";
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { frameService } from '@/services/frame';
import { FiSearch, FiRefreshCcw, FiHeart, FiImage } from 'react-icons/fi';
import CorsImage from '@/components/common/CorsImage';

const MasonryCard = ({ frame }) => {
  const thumb = frame.thumbnail_url || frame.thumbnail || (Array.isArray(frame.images) && frame.images[0]);
  const aspectClass = frame.layout_type === '4x1' ? 'row-span-4' : frame.layout_type === '3x1' ? 'row-span-3' : 'row-span-2';
  const likeCount = typeof frame.total_likes === 'number'
    ? frame.total_likes
    : (Array.isArray(frame.like_count) ? frame.like_count.length : 0);
  return (
  <Link href={`/frame/${frame._id || frame.id}`} className={`group relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col ${aspectClass}`}>
      <div className="relative w-full flex-1 bg-gray-50 flex items-center justify-center">
        {thumb ? (
          <CorsImage src={thumb} alt={frame.title || 'Frame'} className="object-cover w-full h-full" />
        ) : (
          <div className="flex flex-col items-center text-gray-400 py-6">
            <FiImage className="w-8 h-8 mb-2" />
            <span className="text-xs">No Thumbnail</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition" />
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition">
          <h3 className="text-sm font-semibold text-white line-clamp-1">{frame.title || 'Untitled Frame'}</h3>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-white/80">
            <span className="px-1.5 py-0.5 bg-white/20 rounded">{frame.layout_type}</span>
            <span className="flex items-center gap-1"><FiHeart className="w-3 h-3" />{likeCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function DiscoverPage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [layoutFilter, setLayoutFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  const fetchFrames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { sort };
      if (layoutFilter !== 'all') params.layout_type = layoutFilter;
  const res = await frameService.getPublicFrames(params);
  // Response shapes we might get:
  // { success:true, data:{ frames:[...] }}
  // { data:{ frames:[...] }}
  // { frames:[...] }
  // Or directly an array
  let framesArray = [];
  if (Array.isArray(res)) framesArray = res;
  else if (Array.isArray(res?.frames)) framesArray = res.frames;
  else if (Array.isArray(res?.data)) framesArray = res.data;
  else if (Array.isArray(res?.data?.frames)) framesArray = res.data.frames;
  else if (res?.data?.data && Array.isArray(res.data.data.frames)) framesArray = res.data.data.frames; // in case of nested data
  if (!Array.isArray(framesArray)) framesArray = [];
  setFrames(framesArray);
    } catch (e) {
      setError('Failed to load frames');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [layoutFilter, sort]);

  useEffect(() => { fetchFrames(); }, [fetchFrames]);

  const framesSafe = Array.isArray(frames) ? frames : [];
  const filtered = framesSafe.filter(f => {
    if (!query) return true;
    const q = query.toLowerCase();
    const tagsJoined = Array.isArray(f.tag_label) ? f.tag_label.join(' ').toLowerCase() : (f.tag_label || '').toLowerCase();
    return (f.title || '').toLowerCase().includes(q) || tagsJoined.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discover Frames</h1>
          <p className="text-gray-600 mt-1 text-sm">Explore approved community frames. Shadow-banned frames are hidden.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <FiSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search title or tag..." className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <select value={layoutFilter} onChange={e => setLayoutFilter(e.target.value)} className="text-sm border-gray-300 rounded-lg py-2 px-3 focus:ring-pink-500">
            <option value="all">All Layouts</option>
            <option value="2x1">2x1</option>
            <option value="3x1">3x1</option>
            <option value="4x1">4x1</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="text-sm border-gray-300 rounded-lg py-2 px-3 focus:ring-pink-500">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most_liked">Most Liked</option>
            <option value="most_used">Most Used</option>
          </select>
          <button onClick={fetchFrames} className="inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <FiRefreshCcw className="w-4 h-4" /> Refresh
          </button>
        </div>
      </div>

      {error && <div className="p-4 mb-6 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-500">Loading frames...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-sm text-gray-500">No frames found.</div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-5 space-y-5">
          {filtered.map(frame => (
            <MasonryCard key={frame._id || frame.id} frame={frame} />
          ))}
        </div>
      )}
    </div>
  );
}
