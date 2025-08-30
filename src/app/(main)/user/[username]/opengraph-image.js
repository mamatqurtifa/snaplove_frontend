import { ImageResponse } from 'next/og';

export const alt = 'User Profile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { username } = params;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${username}`);
    const data = await response.json();
    
    if (!data.success) {
      return new ImageResponse(
        (
          <div
            style={{
              display: 'flex',
              fontSize: 128,
              background: 'white',
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            User Not Found
          </div>
        )
      );
    }
    
    const user = data.data.user;
    
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            color: 'black',
            background: 'white',
            width: '100%',
            height: '100%',
            padding: 50,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image_profile || 'https://your-domain.com/images/default-avatar.png'}
              alt={user.name}
              width={200}
              height={200}
              style={{ borderRadius: '50%', marginRight: 40 }}
            />
            <div>
              <div style={{ fontSize: 70, fontWeight: 'bold' }}>{user.name}</div>
              <div style={{ fontSize: 50, color: '#666' }}>@{user.username}</div>
            </div>
          </div>
          <div style={{ fontSize: 40, maxWidth: '80%', textAlign: 'center' }}>
            {user.bio || 'View profile on SnapLove'}
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (e) {
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            fontSize: 128,
            background: 'white',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Error
        </div>
      )
    );
  }
}