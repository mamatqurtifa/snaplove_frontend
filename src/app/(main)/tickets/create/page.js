'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ticketService } from '@/services/ticket';
import { FaArrowLeft, FaPlus, FaTimes, FaImage, FaLightbulb, FaCommentAlt, FaTicketAlt, FaUpload, FaExclamationTriangle, FaCheck, FaClock, FaUser } from 'react-icons/fa';

export default function CreateTicketPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'suggestion',
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        setError(`File ${file.name} is not a valid image type. Please use JPG, PNG, GIF, or WebP.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (formData.images.length + validFiles.length > 5) {
      setError('Maximum 5 images allowed per ticket.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
    setError(null);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.username) {
      setError('Please log in to create a ticket.');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title for your ticket.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description for your ticket.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await ticketService.createTicket(user.username, formData);
      
      if (response.success) {
        setSuccess('Your ticket has been created successfully! You will be redirected shortly.');
        setTimeout(() => {
          router.push(`/tickets/${response.data.ticket.id}`);
        }, 2000);
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.message || 'Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'suggestion': return <FaLightbulb className="w-5 h-5" />;
      case 'critics': return <FaCommentAlt className="w-5 h-5" />;
      case 'other': return <FaTicketAlt className="w-5 h-5" />;
      default: return <FaTicketAlt className="w-5 h-5" />;
    }
  };

  const getTypeDescription = (type) => {
    switch(type) {
      case 'suggestion': return 'Share ideas for new features or improvements';
      case 'critics': return 'Provide feedback or report issues with existing features';
      case 'other': return 'General questions or other support requests';
      default: return '';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-center text-red-600">Please log in to create a support ticket</p>
          <div className="flex justify-center mt-4">
            <Link href="/tickets" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center">
          <Link href="/tickets" className="mr-4 text-blue-600 hover:text-blue-800 transition-colors">
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Support Ticket</h1>
            <p className="text-gray-600 mt-1">Submit a support request or share your feedback</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                      <div className="flex items-center">
                        <FaCheck className="mr-2" />
                        <span className="font-medium">Success!</span>
                      </div>
                      <p className="mt-1">{success}</p>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      <div className="flex items-center">
                        <FaExclamationTriangle className="mr-2" />
                        <span className="font-medium">Error:</span>
                      </div>
                      <p className="mt-1">{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ticket Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type of Request *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['suggestion', 'critics', 'other'].map((type) => (
                          <label
                            key={type}
                            className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                              formData.type === type
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={type}
                              checked={formData.type === type}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <div className="flex items-center">
                              <div className={`mr-3 ${formData.type === type ? 'text-blue-600' : 'text-gray-400'}`}>
                                {getTypeIcon(type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium capitalize">
                                  {type === 'critics' ? 'Feedback' : type}
                                </div>
                              </div>
                            </div>
                            {formData.type === type && (
                              <div className="absolute top-2 right-2">
                                <FaCheck className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        {getTypeDescription(formData.type)}
                      </p>
                    </div>

                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Brief summary of your request"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={150}
                        required
                      />
                      <div className="mt-1 text-sm text-gray-500 text-right">
                        {formData.title.length}/150 characters
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Provide detailed information about your request, issue, or feedback..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={6}
                        maxLength={1000}
                        required
                      />
                      <div className="mt-1 text-sm text-gray-500 text-right">
                        {formData.description.length}/1000 characters
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attachments (Optional)
                      </label>
                      <div className="space-y-4">
                        {/* Upload Button */}
                        <div className="relative">
                          <input
                            type="file"
                            id="images"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="images"
                            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                          >
                            <div className="text-center">
                              <FaUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-700">
                                Click to upload images
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, GIF, WebP up to 5MB each (max 5 files)
                              </p>
                            </div>
                          </label>
                        </div>

                        {/* Image Preview */}
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(image)}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                  <FaTimes className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                  {(image.size / 1024 / 1024).toFixed(1)}MB
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                      <Link
                        href="/tickets"
                        className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Cancel
                      </Link>
                      <button
                        type="submit"
                        disabled={loading || !formData.title.trim() || !formData.description.trim()}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            Creating...
                          </>
                        ) : (
                          <>
                            <FaPlus className="w-4 h-4" />
                            Create Ticket
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="w-5 h-5 text-blue-600" />
                  Guidelines
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Be Specific</h4>
                    <p>Provide clear details about your request or issue to help us understand and respond effectively.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Include Context</h4>
                    <p>Share relevant information like what you were trying to do, what happened, and what you expected.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Add Screenshots</h4>
                    <p>Visual examples can help us understand your request or identify issues more quickly.</p>
                  </div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Types</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaLightbulb className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Suggestion</h4>
                      <p className="text-sm text-gray-600">Ideas for new features, improvements, or enhancements to the platform.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaCommentAlt className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Feedback</h4>
                      <p className="text-sm text-gray-600">Report bugs, issues, or provide feedback on existing features.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaTicketAlt className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Other</h4>
                      <p className="text-sm text-gray-600">General questions, account issues, or other support requests.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <FaClock className="w-5 h-5" />
                  Response Time
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Suggestions:</strong> 3-5 business days</p>
                  <p><strong>Feedback:</strong> 1-3 business days</p>
                  <p><strong>Other:</strong> 1-2 business days</p>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-xs text-blue-700">
                    Response times may vary based on complexity and current volume of requests.
                  </p>
                </div>
              </div>

              {/* User Info */}
              {user && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaUser className="w-5 h-5 text-gray-600" />
                    Your Information
                  </h3>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.image_profile || "https://via.placeholder.com/48"}
                      alt={user.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">@{user.username || 'unknown'}</p>
                      {user.role && (
                        <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}