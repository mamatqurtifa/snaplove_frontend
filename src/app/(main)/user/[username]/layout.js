export async function generateMetadata({ params }) {
  const { username } = params || {};
  
  if (!username) {
    return {
      title: 'User Not Found | SnapLove',
    };
  }
  
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/user/${username}`;
    const response = await fetch(apiUrl, { 
      next: { revalidate: 60 },
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
        'Accept': 'application/json'
      }
    });
    
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