'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaTicketAlt, FaSignOutAlt, FaBars, FaTimes, FaServer, FaChartBar, FaImage } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/auth/login');
          return;
        }
        
        // Use the correct endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          // If unauthorized, redirect to login
          if (response.status === 401) {
            localStorage.removeItem('token'); // Clear invalid token
            router.push('/auth/login');
            return;
          }
          throw new Error(`HTTP ${response.status}: Not authorized`);
        }
        
        const userData = await response.json();
        
        // Check if response is successful and has the expected structure
        if (!userData.success || !userData.data?.user) {
          throw new Error('Invalid response structure');
        }
        
        const currentUser = userData.data.user;
        
        // Check for admin permissions using the permissions object
        const hasAdminAccess = userData.data.permissions?.is_admin || 
                              ['official', 'developer'].includes(currentUser.role);
        
        if (!hasAdminAccess) {
          router.push('/');
          return;
        }
        
        setUser(currentUser);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token'); // Clear token on error
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user after loading, don't render anything (redirect is happening)
  if (!user) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-md shadow-md text-gray-500 focus:outline-none"
        >
          {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b">
            <h1 className="text-xl font-bold text-blue-600">SnapLove Admin</h1>
            <div className="mt-4 flex items-center">
              <img 
                src={user?.image_profile || "https://via.placeholder.com/40"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-800">{user?.name || 'Unknown User'}</p>
                <p className="text-sm text-gray-500">{user?.role || 'user'}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 bg-white space-y-1">
            <Link 
              href="/official-admin-snaplove/users" 
              className={`flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 ${pathname?.startsWith('/official-admin-snaplove/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            >
              <FaUsers className="mr-3" />
              User Management
            </Link>
            <Link 
              href="/official-admin-snaplove/tickets" 
              className={`flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 ${pathname?.startsWith('/official-admin-snaplove/tickets') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            >
              <FaTicketAlt className="mr-3" />
              Ticket Management
            </Link>
            <Link 
              href="/official-admin-snaplove/framePublicApproval" 
              className={`flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 ${pathname?.startsWith('/official-admin-snaplove/framePublicApproval') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            >
              <FaImage className="mr-3" />
              Frame Approvals
            </Link>
            <Link 
              href="/official-admin-snaplove/reports" 
              className={`flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 ${pathname?.startsWith('/official-admin-snaplove/reports') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            >
              <FaChartBar className="mr-3" />
              Reports
            </Link>
            <Link 
              href="/official-admin-snaplove/serverHealth" 
              className={`flex items-center px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 ${pathname === '/official-admin-snaplove/serverHealth' ? 'bg-blue-50 text-blue-700' : 'text-gray-600'}`}
            >
              <FaServer className="mr-3" />
              Server Health
            </Link>
          </nav>
          
          <div className="px-4 py-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}