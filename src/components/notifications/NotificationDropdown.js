// /src/components/notifications/NotificationDropdown.js
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FiHeart, 
  FiCamera, 
  FiCheckCircle, 
  FiXCircle, 
  FiUserPlus, 
  FiUpload, 
  FiInfo,
  FiMoreVertical,
  FiCheck,
  FiTrash2,
  FiBell
} from 'react-icons/fi';

const NotificationDropdown = ({ 
  isOpen, 
  notifications, 
  loading, 
  hasMore, 
  onMarkRead, 
  onMarkAllRead, 
  onLoadMore, 
  onDeleteNotification,
  getNotificationMessage,
  isMobile = false 
}) => {
  const [selectedNotification, setSelectedNotification] = useState(null);

  if (!isOpen) return null;

  const getNotificationIcon = (type) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case 'frame_like':
        return <FiHeart className={`${iconClass} text-red-500`} />;
      case 'frame_use':
        return <FiCamera className={`${iconClass} text-blue-500`} />;
      case 'frame_approved':
        return <FiCheckCircle className={`${iconClass} text-green-500`} />;
      case 'frame_rejected':
        return <FiXCircle className={`${iconClass} text-red-500`} />;
      case 'user_follow':
        return <FiUserPlus className={`${iconClass} text-purple-500`} />;
      case 'frame_upload':
        return <FiUpload className={`${iconClass} text-orange-500`} />;
      case 'system':
        return <FiInfo className={`${iconClass} text-gray-500`} />;
      default:
        return <FiInfo className={`${iconClass} text-gray-500`} />;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case 'frame_like':
      case 'frame_use':
      case 'frame_approved':
      case 'frame_rejected':
        return notification.frame_id ? `/frame/${notification.frame_id}` : null;
      case 'user_follow':
        return notification.sender ? `/user/${notification.sender.username}` : null;
      case 'frame_upload':
        return notification.frame_id ? `/frame/${notification.frame_id}` : null;
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
    
    const link = getNotificationLink(notification);
    if (link) {
      window.location.href = link;
    }
  };

  const NotificationItem = ({ notification }) => {
    const [showMenu, setShowMenu] = useState(false);
    
    return (
      <div 
        className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 cursor-pointer relative ${
          !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
        }`}
        onClick={() => handleNotificationClick(notification)}
      >
        <div className="flex items-start space-x-3">
          {/* Sender Avatar */}
          {notification.sender && (
            <div className="flex-shrink-0">
              <Image
                src={notification.sender.image_profile || '/images/assets/placeholder-user.png'}
                alt={notification.sender.name}
                width={32}
                height={32}
                className="rounded-full h-8 w-8 object-cover border border-gray-200"
              />
            </div>
          )}
          
          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 font-medium">
              {getNotificationMessage(notification)}
            </p>
            
            {notification.message && notification.type === 'system' && (
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              {formatTime(notification.created_at)}
            </p>
          </div>
          
          {/* Action Menu */}
          <div className="flex-shrink-0 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FiMoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                {!notification.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(notification.id);
                      setShowMenu(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <FiCheck className="h-4 w-4" />
                    Mark as read
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onDeleteNotification) {
                      onDeleteNotification(notification.id);
                    }
                    setShowMenu(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {/* Unread indicator */}
          {!notification.is_read && (
            <div className="absolute right-2 top-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`${
      isMobile 
        ? 'w-full bg-white border-t border-gray-200' 
        : 'absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200'
    } z-50 max-h-96 flex flex-col`}>
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
        {notifications.length > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all read
          </button>
        )}
      </div>
      
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications yet</h3>
            <p className="text-gray-500">You&apos;ll see notifications for likes, follows, and more here.</p>
          </div>
        ) : (
          <>
            {notifications.map((notification, index) => (
              <NotificationItem key={notification.id || index} notification={notification} />
            ))}
            
            {/* Load More Button */}
            {hasMore && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;