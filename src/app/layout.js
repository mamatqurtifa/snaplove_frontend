import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { metadata } from './metadata';

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}