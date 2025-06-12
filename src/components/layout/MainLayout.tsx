import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
export default function MainLayout() {
  return <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-16 bg-zinc-400">
        <Outlet />
      </main>
      <Footer />
    </div>;
}