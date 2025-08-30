export async function generateMetadata({ params }) {
  // We need to destructure params immediately to avoid the error
  const { username } = params || {};
  
  if (!username) {
    return {
      title: 'User Not Found | SnapLove',
    };
  }
  
  try {
    // Use fetch instead of axios for server components
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/${username}`;
    const response = await fetch(apiUrl, { 
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      // We can't include auth headers here since this runs on the server
    });
    
    // If we get a 403, we know the profile exists but requires authentication
    if (response.status === 403) {
      return {
        title: `Private Profile | SnapLove`,
        description: 'This profile requires authentication to view',
      };
    }
    
    if (!response.ok) {
      return {
        title: 'User Not Found | SnapLove',
      };
    }
    
    const data = await response.json();
    
    if (!data.success) {
      return {
        title: 'User Not Found | SnapLove',
      };
    }
    
    const user = data.data.user;
    
    return {
      title: `${user.name} (@${user.username}) | SnapLove`,
      description: user.bio || `Check out ${user.name}'s profile on SnapLove`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'User Profile | SnapLove',
    };
  }
}

export default function UserLayout({ children }) {
  return children;
}