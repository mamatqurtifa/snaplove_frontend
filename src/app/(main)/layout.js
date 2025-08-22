import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow mt-16">{children}</main>
      <Footer />
    </>
  );
}