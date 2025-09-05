'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiEdit3, FiTrash2, FiEye, FiEyeOff, FiMoreVertical, FiHeart, FiDownload } from 'react-icons/fi';
import api from '@/services/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function FrameManagement({ username }) {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFrame, setEditingFrame] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    desc: '',
    tag_label: [],
    visibility: 'private',
    layout_type: '2x1'
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [visibilityLoading, setVisibilityLoading] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    fetchFrames();
  }, [username]);

  const fetchFrames = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/user/${username}/frame`);
      if (response.data.success) {
        setFrames(response.data.data.frames || []);
      } else {
        setError(response.data.message || 'Failed to load frames');
      }
    } catch (error) {
      console.error('Error fetching frames:', error);
      setError('Failed to load frames');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (frame) => {
    setEditingFrame(frame.id);
    setEditForm({
      title: frame.title || '',
      desc: frame.desc || '',
      tag_label: frame.tag_label || [],
      visibility: frame.visibility || 'private',
      layout_type: frame.layout_type || '2x1'
    });
    setThumbnailFile(null);
  };

  const handleSaveEdit = async () => {
    if (!editingFrame) return;

    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('desc', editForm.desc);
      formData.append('visibility', editForm.visibility);
      formData.append('layout_type', editForm.layout_type);
      formData.append('tag_label', JSON.stringify(editForm.tag_label));

      // Check if changing to public and needs thumbnail
      const currentFrame = frames.find(f => f.id === editingFrame);
      if (editForm.visibility === 'public' && currentFrame?.visibility === 'private') {
        if (!thumbnailFile && !currentFrame.thumbnail) {
          alert('Thumbnail is required when making frame public');
          setEditLoading(false);
          return;
        }
        if (thumbnailFile) {
          formData.append('thumbnail', thumbnailFile);
        }
      }

      const response = await api.put(`/user/${username}/frame/private/${editingFrame}/edit`, formData);

      if (response.data.success) {
        await fetchFrames();
        setEditingFrame(null);
        setThumbnailFile(null);
        alert('Frame updated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to update frame');
      }
    } catch (error) {
      console.error('Error updating frame:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update frame';
      alert(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (frameId) => {
    if (!confirm('Are you sure you want to delete this frame? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(frameId);
    try {
      const response = await api.delete(`/user/${username}/frame/private/${frameId}/delete`);

      if (response.data.success) {
        setFrames(frames.filter(frame => frame.id !== frameId));
        alert('Frame deleted successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to delete frame');
      }
    } catch (error) {
      console.error('Error deleting frame:', error);
      alert(error.response?.data?.message || 'Failed to delete frame');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleVisibilityChange = async (frameId, currentVisibility) => {
    const newVisibility = currentVisibility === 'public' ? 'private' : 'public';

    if (newVisibility === 'public') {
      if (!confirm('Making this frame public will require approval before it appears in the public feed. Continue?')) {
        return;
      }
    }

    setVisibilityLoading(frameId);
    try {
      const formData = new FormData();
      formData.append('visibility', newVisibility);

      // If changing to public, check if thumbnail exists
      if (newVisibility === 'public') {
        const frame = frames.find(f => f.id === frameId);
        if (!frame?.thumbnail) {
          alert('Cannot make frame public: thumbnail is required');
          setVisibilityLoading(null);
          return;
        }
      }

      const response = await api.put(`/user/${username}/frame/private/${frameId}/edit`, formData);

      if (response.data.success) {
        setFrames(frames.map(frame =>
          frame.id === frameId
            ? { ...frame, visibility: newVisibility }
            : frame
        ));
        alert(`Frame visibility changed to ${newVisibility}!`);
      } else {
        throw new Error(response.data.message || 'Failed to change visibility');
      }
    } catch (error) {
      console.error('Error changing visibility:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change visibility';
      alert(errorMessage);
    } finally {
      setVisibilityLoading(null);
    }
  };

  const handleTagChange = (tagString) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setEditForm(prev => ({ ...prev, tag_label: tags }));
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-6">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {frames.map((frame) => {
          // Determine aspect ratio class based on layout type for varying heights
          const getAspectClass = (layoutType) => {
            switch (layoutType) {
              case '4x1':
                return 'aspect-[2/9]'; // Shortest/widest for 4 sections
              case '3x1':
                return 'aspect-[1/3]'; // Medium height for 3 sections
              case '2x1':
                return 'aspect-[9/18]'; // Tallest for 2 sections
              default:
                return 'aspect-[9/18]'; // Default to tallest
            }
          };

          const aspectClass = getAspectClass(frame.layout_type);

          return (
            <div key={frame.id} className="break-inside-avoid bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {/* Frame Image */}
              <div className={`relative ${aspectClass} bg-gray-100`}>
                {frame.thumbnail ? (
                  <Image
                    src={frame.thumbnail}
                    alt={frame.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiDownload className="h-8 w-8" />
                  </div>
                )}

                {/* Visibility Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    frame.visibility === 'public'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {frame.visibility}
                  </span>
                </div>

                {/* Action Menu */}
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button
                      className="p-2 bg-white/90 hover:bg-white rounded-full shadow-sm"
                      onClick={() => {
                        const menu = document.getElementById(`menu-${frame.id}`);
                        menu.classList.toggle('hidden');
                      }}
                    >
                      <FiMoreVertical className="h-4 w-4" />
                    </button>

                    <div
                      id={`menu-${frame.id}`}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden z-10"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleEdit(frame)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <FiEdit3 className="h-4 w-4 mr-3" />
                          Edit
                        </button>

                        <button
                          onClick={() => handleVisibilityChange(frame.id, frame.visibility)}
                          disabled={visibilityLoading === frame.id}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {frame.visibility === 'public' ? (
                            <>
                              <FiEyeOff className="h-4 w-4 mr-3" />
                              Make Private
                            </>
                          ) : (
                            <>
                              <FiEye className="h-4 w-4 mr-3" />
                              Make Public
                          </>
                        )}
                        </button>

                        <button
                          onClick={() => handleDelete(frame.id)}
                          disabled={deleteLoading === frame.id}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          <FiTrash2 className="h-4 w-4 mr-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{frame.title}</h3>
                {frame.desc && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{frame.desc}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <FiHeart className="h-4 w-4" />
                      {frame.total_likes || 0}
                    </span>
                    <span>{frame.layout_type}</span>
                  </div>
                  <span>{new Date(frame.created_at).toLocaleDateString()}</span>
                </div>

                {frame.tag_label && frame.tag_label.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {frame.tag_label.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {frames.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          No frames uploaded yet
        </div>
      )}

      {/* Edit Modal */}
      {editingFrame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
            <h2 className="text-xl font-semibold mb-6">Edit Frame</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent"
                  placeholder="Frame title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.desc}
                  onChange={(e) => setEditForm(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent resize-none"
                  placeholder="Frame description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout Type
                </label>
                <select
                  value={editForm.layout_type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, layout_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent"
                >
                  <option value="2x1">2x1</option>
                  <option value="3x1">3x1</option>
                  <option value="4x1">4x1</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.tag_label.join(', ')}
                  onChange={(e) => handleTagChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent"
                  placeholder="nature, landscape, art"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility
                </label>
                <select
                  value={editForm.visibility}
                  onChange={(e) => setEditForm(prev => ({ ...prev, visibility: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                </select>
              </div>

              {editForm.visibility === 'public' && frames.find(f => f.id === editingFrame)?.visibility === 'private' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail (Required for public frames)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9898] focus:border-transparent"
                  />
                  {thumbnailFile && (
                    <p className="text-xs text-green-600 mt-1">Thumbnail selected: {thumbnailFile.name}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingFrame(null);
                  setThumbnailFile(null);
                }}
                className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#FF9898] to-[#FFE99A] text-white text-sm font-semibold disabled:opacity-60 transition"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
