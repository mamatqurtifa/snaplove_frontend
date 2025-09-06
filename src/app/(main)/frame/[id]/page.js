"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiHeart, FiLoader, FiExternalLink, FiUser, FiCalendar, FiEye, FiTag, FiGrid, FiThumbsUp, FiPlay, FiCheckCircle, FiXCircle, FiFlag, FiMoreVertical, FiX, FiAlertTriangle } from 'react-icons/fi';
import { frameService } from '@/services/frame';
import { reportService } from '@/services/report';
import { useAuth } from '@/context/AuthContext';
import CorsImage from '@/components/common/CorsImage';

// Report Modal Component
function ReportModal({ 
  isOpen, 
  onClose, 
  frameId, 
  frameTitle, 
  frameOwner, 
  currentUser 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reportType, setReportType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const reportTypes = [
    { value: 'inappropriate_content', label: 'Inappropriate Content', description: 'Contains offensive, adult, or harmful content' },
    { value: 'spam', label: 'Spam', description: 'Promotional content or repetitive posts' },
    { value: 'harassment', label: 'Harassment', description: 'Bullying, threatening, or abusive content' },
    { value: 'copyright', label: 'Copyright Violation', description: 'Uses copyrighted material without permission' },
    { value: 'other', label: 'Other', description: 'Other violation not listed above' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.username) {
      setError('You must be logged in to submit a report');
      return;
    }

    if (!title.trim() || !description.trim() || !reportType) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const reportData = {
        title: title.trim(),
        description: description.trim(),
        frame_id: frameId,
        type: reportType
      };

      await reportService.submitReport(currentUser.username, reportData);
      
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error('Error submitting report:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    
    setTitle('');
    setDescription('');
    setReportType('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiFlag className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Report Frame</h2>
              <p className="text-sm text-gray-500">Help us keep the community safe</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
            <p className="text-gray-600 mb-4">
              Thank you for helping keep our community safe. We&apos;ll review your report and take appropriate action.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                You can check the status of your reports in your account settings.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Frame Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-1">Reporting Frame:</h3>
              <p className="text-sm text-gray-600 font-medium">{frameTitle || 'Untitled Frame'}</p>
              <p className="text-xs text-gray-500">by @{frameOwner}</p>
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What&apos;s the issue? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {reportTypes.map((type) => (
                  <label key={type.value} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={reportType === type.value}
                      onChange={(e) => setReportType(e.target.value)}
                      className="mt-1 w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{type.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Report Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the issue"
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                disabled={submitting}
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {title.length}/100 characters
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide detailed information about why you're reporting this frame. This helps our team understand the issue better."
                rows={5}
                maxLength={1000}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-vertical"
                disabled={submitting}
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {description.length}/1000 characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <FiAlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Please note:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Only submit reports for content that violates our community guidelines</li>
                    <li>• False reports may result in account restrictions</li>
                    <li>• We&apos;ll review your report within 24-48 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !title.trim() || !description.trim() || !reportType}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiFlag className="w-4 h-4" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function FrameDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [frame, setFrame] = useState(null);
  const [liking, setLiking] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const frameData = await frameService.getPublicFrameById(id);
        setFrame(frameData);
      } catch (e) {
        console.error('Error loading frame:', e);
        // Provide more user-friendly error messages
        if (e.message?.includes('connect to server') || e.message?.includes('Network error')) {
          setError('Unable to connect to server. Please check your internet connection and try again.');
        } else if (e.message?.includes('Frame not found')) {
          setError('Frame not found. It may have been deleted or is not publicly available.');
        } else if (e.message?.includes('permission')) {
          setError('You do not have permission to view this frame.');
        } else {
          setError(e.message || 'Failed to load frame details. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showOptionsMenu) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showOptionsMenu]);

  const handleLike = async () => {
    if (!isAuthenticated || !frame?._id) return;
    try {
      setLiking(true);
      const likeData = await frameService.likePublicFrame(frame._id);
      // Update local state based on response
      if (likeData) {
        const isLiked = likeData.is_liked;
        const newLikeCount = likeData.total_likes || frame.total_likes || 0;
        setFrame(prev => ({
          ...prev,
          total_likes: newLikeCount,
          is_liked: isLiked
        }));
      }
    } catch (e) {
      console.error('Error liking frame:', e);
      // Show user-friendly error message
      if (e.message?.includes('connect to server') || e.message?.includes('Network error')) {
        alert('Unable to connect to server. Please check your internet connection.');
      } else if (e.message?.includes('login')) {
        alert('Please login to like frames.');
      } else {
        alert(e.message || 'Failed to like frame. Please try again.');
      }
    } finally {
      setLiking(false);
    }
  };

  const handleReportClick = () => {
    if (!isAuthenticated) {
      alert('Please login to report content.');
      return;
    }
    setShowReportModal(true);
    setShowOptionsMenu(false);
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-500">Loading frame details...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FiXCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Frame Not Found</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={() => router.back()} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );

  if (!frame) return null;

  const thumb = frame.thumbnail_url || frame.thumbnail || (frame.images && frame.images[0]);
  const user = frame.user || frame.user_id;
  const createdDate = frame.created_at ? new Date(frame.created_at).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : null;

  // Check if current user is the frame owner
  const isOwner = user && currentUser && user.username === currentUser.username;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900 truncate">{frame.title || 'Untitled Frame'}</h1>
              <p className="text-sm text-gray-500 mt-1">Frame ID: {frame._id || frame.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
              frame.approval_status === 'approved'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : frame.approval_status === 'pending'
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {frame.approval_status === 'approved' ? <FiCheckCircle className="w-4 h-4" /> : <FiXCircle className="w-4 h-4" />}
              {frame.approval_status || 'Unknown'}
            </span>
            
            {/* Options Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptionsMenu(!showOptionsMenu);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>
              
              {showOptionsMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {!isOwner && (
                      <button
                        onClick={handleReportClick}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FiFlag className="w-4 h-4" />
                        Report Frame
                      </button>
                    )}
                    {/* Add more menu options here if needed */}
                    {!isOwner && (
                      <div className="border-t border-gray-100 my-1"></div>
                    )}
                    <div className="px-4 py-2 text-xs text-gray-500">
                      More options coming soon
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Frame Image */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm mx-auto">
              <div className="relative w-full bg-gray-50 flex items-center justify-center">
                {thumb ? (
                  <CorsImage
                    src={thumb}
                    alt={frame.title || 'Frame'}
                    className="w-auto h-auto max-w-full max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    <FiGrid className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No thumbnail available</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Description */}
            {frame.desc && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <FiTag className="w-5 h-5 text-blue-500" />
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">{frame.desc}</p>
              </div>
            )}
            
            {/* Tags */}
            {frame.tag_label && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <FiTag className="w-5 h-5 text-purple-500" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {Array.isArray(frame.tag_label)
                    ? frame.tag_label.map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 text-sm font-medium hover:shadow-md transition-shadow">
                          <FiTag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))
                    : frame.tag_label.split(',').map((tag, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 text-sm font-medium hover:shadow-md transition-shadow">
                          <FiTag className="w-3 h-3" />
                          {tag.trim()}
                        </span>
                      ))
                  }
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Uploader Info */}
            {user && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-green-500" />
                  Uploader
                </h3>
                <Link
                  href={`/user/${user.username}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 group border border-transparent hover:border-gray-200"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-gray-200 group-hover:border-blue-300 transition-all duration-200 shadow-md">
                    {user.image_profile ? (
                      <CorsImage
                        src={user.image_profile}
                        alt={user.name || user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <FiUser className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate text-lg">{user.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                    {user.role && (
                      <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            )}
            
            {/* Frame Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FiThumbsUp className="w-5 h-5 text-pink-500" />
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiThumbsUp className="w-5 h-5 text-pink-500" />
                    <span className="font-medium">Likes</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{frame.total_likes || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiPlay className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Uses</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{frame.total_uses || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-600">
                    <FiGrid className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Layout</span>
                  </div>
                  <span className="font-bold text-gray-900 text-lg">{frame.layout_type}</span>
                </div>
                {createdDate && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3 text-gray-600">
                      <FiCalendar className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">Created</span>
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{createdDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Frame Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-indigo-500" />
                Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">Visibility</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    frame.visibility === 'public'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {frame.visibility}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-600">Approval</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    frame.approval_status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : frame.approval_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {frame.approval_status}
                  </span>
                </div>
                {frame.official_status && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-600">Official</span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                      {frame.official_status}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
              <div className="space-y-4">
                <button
                  disabled={!isAuthenticated || liking}
                  onClick={handleLike}
                  className={`w-full inline-flex items-center justify-center gap-3 text-base px-6 py-4 rounded-xl border-2 transition-all duration-200 shadow-md hover:shadow-lg ${
                    frame.is_liked
                      ? 'bg-gradient-to-r from-pink-500 to-red-500 border-pink-500 text-white hover:from-pink-600 hover:to-red-600'
                      : 'border-gray-300 hover:border-pink-300 bg-white hover:bg-pink-50 disabled:opacity-50'
                  }`}
                >
                  {liking ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <FiHeart className={`w-5 h-5 ${frame.is_liked ? 'fill-current' : ''}`} />
                  )}
                  {liking ? 'Processing...' : `${frame.is_liked ? 'Liked' : 'Like'} (${frame.total_likes || 0})`}
                </button>
                <Link
                  href={`/photobooth?frameId=${frame._id || frame.id}&layout=${frame.layout_type}`}
                  className="w-full inline-flex items-center justify-center gap-3 text-base px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                >
                  <FiPlay className="w-5 h-5" />
                  Use Frame
                </Link>
                {thumb && (
                  <a
                    href={thumb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-3 text-base px-6 py-4 rounded-xl border-2 border-gray-300 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FiExternalLink className="w-5 h-5" />
                    View Full Image
                  </a>
                )}
                
                {/* Report Button in Action Buttons */}
                {!isOwner && isAuthenticated && (
                  <button
                    onClick={handleReportClick}
                    className="w-full inline-flex items-center justify-center gap-3 text-base px-6 py-4 rounded-xl border-2 border-red-300 hover:border-red-400 bg-white hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <FiFlag className="w-5 h-5" />
                    Report Frame
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        frameId={frame._id || frame.id}
        frameTitle={frame.title}
        frameOwner={user?.username}
        currentUser={currentUser}
      />
    </div>
  );
}