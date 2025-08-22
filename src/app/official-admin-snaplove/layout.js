'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUsers, FaTicketAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Not authorized');
        }
        
        const userData = await response.json();
        
        if (!['official', 'developer'].includes(userData.data.user.role)) {
          router.push('/');
          return;
        }
        
        setUser(userData.data.user);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
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
                <p className="font-medium text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-2 py-4 bg-white space-y-1">
            <Link 
              href="/official-admin-snaplove/users" 
              className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700"
            >
              <FaUsers className="mr-3" />
              User Management
            </Link>
            <Link 
              href="/official-admin-snaplove/tickets" 
              className="flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-blue-50 hover:text-blue-700"
            >
              <FaTicketAlt className="mr-3" />
              Ticket Management
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
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}