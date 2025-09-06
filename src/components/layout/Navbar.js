"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiSearch, FiUser, FiHeart, FiBell, FiLogOut, FiSettings } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import notificationService from "@/services/notificationService";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { socket, isConnected } = useSocket();
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial load notifications from API when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.username) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, user?.username]);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isAuthenticated || !isConnected) return;

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('New SnapLove Notification', {
          body: getNotificationMessage(notification),
          icon: '/images/assets/Logo/snaplove-icon.png'
        });
      }
    });

    // Listen for unread count updates
    socket.on('unread_count', (data) => {
      setUnreadCount(data.count);
    });

    // Listen for notifications list
    socket.on('notifications_list', (data) => {
      if (page === 1) {
        setNotifications(data.notifications);
      } else {
        setNotifications(prev => [...prev, ...data.notifications]);
      }
      setHasMore(data.hasMore);
      setLoading(false);
    });

    // Listen for errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      setLoading(false);
      // Fallback to API if socket fails
      fetchNotificationsFromAPI(page);
    });
    
    return () => {
      if (socket) {
        socket.off('new_notification');
        socket.off('unread_count');
        socket.off('notifications_list');
        socket.off('error');
      }
    };
  }, [socket, isAuthenticated, isConnected, page]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Request notification permission
  useEffect(() => {
    if (isAuthenticated && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    if (!user?.username) return;
    
    try {
      const response = await notificationService.getUnreadCount(user.username);
      if (response.success) {
        setUnreadCount(response.data.count || response.data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Try to get from full notifications if unread count endpoint fails
      try {
        const notifResponse = await notificationService.getNotifications(user.username, { 
          page: 1, 
          limit: 1 
        });
        if (notifResponse.success) {
          setUnreadCount(notifResponse.data.unread_count || 0);
        }
      } catch (fallbackError) {
        console.error('Fallback unread count error:', fallbackError);
      }
    }
  };

  const fetchNotificationsFromAPI = async (pageNum = 1) => {
    if (!user?.username || loading) return;
    
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(user.username, {
        page: pageNum,
        limit: 20
      });
      
      if (response.success) {
        const notificationsData = response.data.notifications || [];
        const pagination = response.data.pagination || {};
        
        if (pageNum === 1) {
          setNotifications(notificationsData);
        } else {
          setNotifications(prev => [...prev, ...notificationsData]);
        }
        
        setHasMore(pagination.has_next_page || false);
        setPage(pageNum);
        
        // Update unread count if available
        if (response.data.unread_count !== undefined) {
          setUnreadCount(response.data.unread_count);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications from API:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = (pageNum = 1) => {
    // Try socket first, fallback to API
    if (socket && isConnected && !loading) {
      setLoading(true);
      setPage(pageNum);
      socket.emit('get_notifications', {
        page: pageNum,
        limit: 20
      });
      
      // Set timeout fallback to API
      setTimeout(() => {
        if (loading) {
          console.log('Socket timeout, falling back to API');
          fetchNotificationsFromAPI(pageNum);
        }
      }, 3000);
    } else {
      // Direct API call if socket not available
      fetchNotificationsFromAPI(pageNum);
    }
  };

  const markNotificationRead = async (notificationId) => {
    if (!user?.username) return;
    
    try {
      // Use API call for marking as read
      await notificationService.markAsRead(user.username, notificationId);
      
      // Also emit socket event if connected
      if (socket && isConnected) {
        socket.emit('mark_notification_read', notificationId);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllRead = async () => {
    if (!user?.username) return;
    
    try {
      // Use API call for marking all as read
      await notificationService.markAllAsRead(user.username);
      
      // Also emit socket event if connected
      if (socket && isConnected) {
        socket.emit('mark_all_read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!user?.username) return;
    
    try {
      await notificationService.deleteNotification(user.username, notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Failed to delete notification');
    }
  };

  const getNotificationMessage = (notification) => {
    const messages = {
      frame_like: `${notification.sender?.name} liked your frame`,
      frame_use: `${notification.sender?.name} used your frame to take a photo`,
      frame_approved: 'Your frame was approved by admin',
      frame_rejected: 'Your frame was rejected by admin',
      user_follow: `${notification.sender?.name} started following you`,
      frame_upload: `${notification.sender?.name} uploaded a new frame`,
      system: notification.message
    };
    return messages[notification.type] || notification.message;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleNotificationMenu = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      // Reset to first page when opening
      setPage(1);
      fetchNotifications(1);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Check if user has admin role
  const isAdmin = user?.role && (user.role.toLowerCase().includes('official') || user.role.toLowerCase().includes('developer'));

  // Navigation items with their respective routes
  const navItems = [
    { name: "Discover", route: "/discover" },
    { name: "Leaderboard", route: "/leaderboard" },
    { name: "Pricing", route: "/pricing" },
    { name: "Help Center", route: "/tickets" }
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
    }`}>
      <div className="container-custom flex justify-between items-center max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={scrolled ? "/images/assets/Logo/snaplove-logo-black.png" : "/images/assets/Logo/snaplove-logo-black.png"}
            alt="SnapLove Logo"
            width={150}
            height={50}
            className="h-10 w-auto transition-all duration-300 hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link key={index} href={item.route} className="nav-link group">
              <span className="relative overflow-hidden">
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FF9898] transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          ))}
        </div>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 hover:rotate-6">
            <FiSearch className="h-5 w-5 text-gray-700" />
          </button>
          
          {isAuthenticated ? (
            <>
              {/* Notification Button */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={toggleNotificationMenu}
                  className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 relative group"
                >
                  <FiBell className="h-5 w-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF9898] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px] group-hover:animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                
                <NotificationDropdown 
                  isOpen={isNotificationOpen}
                  notifications={notifications}
                  loading={loading}
                  hasMore={hasMore}
                  onMarkRead={markNotificationRead}
                  onMarkAllRead={markAllRead}
                  onLoadMore={() => fetchNotifications(page + 1)}
                  onDeleteNotification={deleteNotification}
                  getNotificationMessage={getNotificationMessage}
                />
              </div>

              <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-all duration-300 hover:rotate-6">
                <FiHeart className="h-5 w-5 text-gray-700" />
              </button>
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="flex items-center gap-2 rounded-full hover:ring-2 hover:ring-[#FFE99A] transition-all duration-300 focus:outline-none"
                >
                  <Image
                    src={user?.image_profile || "/images/assets/placeholder-user.png"}
                    alt="Profile"
                    width={38}
                    height={38}
                    className="rounded-full h-9 w-9 object-cover border-2 border-[#FFE99A]"
                  />
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-500">@{user?.username}</p>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser className="h-4 w-4" /> Profile
                    </Link>
                    {isAdmin && (
                      <Link 
                        href="/official-admin-snaplove" 
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiSettings className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left flex items-center gap-2"
                    >
                      <FiLogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link href="/auth/login" className="btn-primary flex items-center gap-2 group">
              <FiUser className="h-5 w-5 group-hover:rotate-12 transition-transform" /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors">
            <FiSearch className="h-5 w-5 text-gray-700" />
          </button>
          
          {isAuthenticated && (
            <div className="relative">
              <button 
                onClick={toggleNotificationMenu}
                className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors relative"
              >
                <FiBell className="h-5 w-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF9898] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium min-w-[20px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full hover:bg-[#FFE99A] transition-colors"
          >
            {isMenuOpen ? (
              <FiX className="h-5 w-5 text-gray-700" />
            ) : (
              <FiMenu className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Notification Dropdown */}
      {isAuthenticated && (
        <div className="md:hidden">
          <NotificationDropdown 
            isOpen={isNotificationOpen}
            notifications={notifications}
            loading={loading}
            hasMore={hasMore}
            onMarkRead={markNotificationRead}
            onMarkAllRead={markAllRead}
            onLoadMore={() => fetchNotifications(page + 1)}
            onDeleteNotification={deleteNotification}
            getNotificationMessage={getNotificationMessage}
            isMobile={true}
          />
        </div>
      )}

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="container mx-auto px-6 py-6 flex flex-col space-y-6">
          {isAuthenticated && (
            <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
              <Image
                src={user?.image_profile || "/images/assets/placeholder-user.png"}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full h-10 w-10 object-cover border-2 border-[#FFE99A]"
              />
              <div>
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
            </div>
          )}
          
          {navItems.map((item, index) => (
            <Link 
              key={index}
              href={item.route} 
              className="text-lg font-medium text-gray-700 hover:text-[#FF9898] transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="pt-4 border-t border-gray-100 flex flex-col space-y-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/profile" 
                  className="btn-outline flex items-center justify-center gap-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="h-5 w-5" /> Profile
                </Link>
                {isAdmin && (
                  <Link 
                    href="/official-admin-snaplove" 
                    className="btn-outline flex items-center justify-center gap-2 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiSettings className="h-5 w-5" /> Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }} 
                  className="btn-primary flex items-center justify-center gap-2 w-full"
                >
                  <FiLogOut className="h-5 w-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <button className="btn-outline flex items-center justify-center gap-2 w-full">
                  <FiHeart className="h-5 w-5" /> Favorites
                </button>
                <Link 
                  href="/auth/login" 
                  className="btn-primary flex items-center justify-center gap-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FiUser className="h-5 w-5" /> Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;