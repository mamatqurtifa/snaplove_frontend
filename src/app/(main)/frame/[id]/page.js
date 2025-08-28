"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiLoader, FiExternalLink } from 'react-icons/fi';
import { frameService } from '@/services/frame';
import { useAuth } from '@/context/AuthContext';

export default function FrameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [frame, setFrame] = useState(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await frameService.getPublicFrameById(id);
        setFrame(res?.data || res?.frame || res);
      } catch (e) {
        console.error(e);
        setError('Frame not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated || !frame?._id) return;
    try {
      setLiking(true);
      const res = await frameService.likePublicFrame(frame._id);
      const userId = res?.user_id || 'me';
      let likeArray = frame.like_count || [];
      const liked = likeArray.includes(userId);
      if (liked) likeArray = likeArray.filter(l => l !== userId); else likeArray = [...likeArray, userId];
      setFrame({ ...frame, like_count: likeArray });
    } catch (e) {
      console.error(e);
    } finally {
      setLiking(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-gray-500">Loading frame...</div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-sm text-red-600">{error}</div>;
  if (!frame) return null;

  const thumb = frame.thumbnail_url || frame.thumbnail || (frame.images && frame.images[0]);
  const likeCount = frame.like_count?.length || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <FiArrowLeft className="w-4 h-4" /> Back
          </button>
          <h1 className="text-xl font-semibold tracking-tight">{frame.title || 'Untitled Frame'}</h1>
        </div>
        <div className="text-xs text-gray-500">Layout: <span className="font-medium">{frame.layout_type}</span></div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="relative w-full aspect-[9/16] bg-gray-50 flex items-center justify-center">
            {thumb ? (
              <img src={thumb} alt={frame.title} className="object-cover w-full h-full" />
            ) : (
              <div className="text-gray-400 text-sm">No Thumbnail</div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{frame.desc || 'No description provided.'}</p>
          </div>
          {frame.tag_label && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {frame.tag_label.split(',').map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-200">{t.trim()}</span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button disabled={!isAuthenticated || liking} onClick={handleLike} className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
              {liking ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiHeart className={`w-4 h-4 ${likeCount ? 'text-pink-600 fill-pink-600' : ''}`} />}
              {likeCount}
            </button>
            <Link href={`/photobooth?frameId=${frame._id || frame.id}&layout=${frame.layout_type}`} className="inline-flex items-center gap-2 text-sm px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow hover:opacity-90">
              Use Frame
            </Link>
            <a href={thumb} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              <FiExternalLink className="w-4 h-4" /> Open
            </a>
          </div>
          <div className="text-xs text-gray-500">
            Visibility: {frame.visibility} | Approval: {frame.approval_status}
          </div>
        </div>
      </div>
    </div>
  );
}
