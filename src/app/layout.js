import "./globals.css";

export const metadata = {
  title: "SnapLove - Share Your Moments",
  description: "SnapLove is the perfect platform to share and discover amazing moments through photos.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-jakarta antialiased">
        {children}
      </body>
    </html>
  );
}
