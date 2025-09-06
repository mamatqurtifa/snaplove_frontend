// components/modals/ReportModal.js

'use client';
import { useState } from 'react';
import { FiX, FiFlag, FiLoader, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { reportService } from '@/services/report';

export default function ReportModal({ 
  isOpen, 
  onClose, 
  frameId, 
  frameTitle, 
  frameOwner, 
  currentUser 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser?.username) {
      setError('You must be logged in to submit a report');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const reportData = {
        title: title.trim(),
        description: description.trim(),
        frame_id: frameId
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
                placeholder="Please provide detailed information about why you're reporting this frame. Include specific details about what violates our community guidelines (inappropriate content, spam, harassment, copyright issues, etc.). This helps our team understand the issue better."
                rows={6}
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

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">Common report reasons include:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Inappropriate or offensive content</li>
                    <li>• Spam or promotional content</li>
                    <li>• Harassment or bullying</li>
                    <li>• Copyright violation</li>
                    <li>• Other community guideline violations</li>
                  </ul>
                </div>
              </div>
            </div>

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
                disabled={submitting || !title.trim() || !description.trim()}
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