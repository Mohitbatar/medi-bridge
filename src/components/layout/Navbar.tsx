
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    logout,
    isAuthenticated
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "public":
        return "/dashboard/public";
      case "hospital":
        return "/dashboard/hospital";
      case "ambulance":
        return "/dashboard/ambulance";
      default:
        return "/";
    }
  };

  return <nav className="fixed top-0 left-0 right-0 z-50 shadow-md bg-slate-200">
      <div className="container flex items-center justify-between h-16 md:px-8 py-0 bg-slate-200 mx-[7px] px-[14px]">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/a520afa9-1902-4608-bd62-5c0108cdb034.png" alt="MediBridge Logo" className="h-24 w-auto object-contain" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-gray-700 hover:text-mediBridge-teal hover:bg-gray-100">
            Home
          </Button>
          <Button variant="ghost" onClick={() => navigate("/about")} className="text-gray-700 hover:text-mediBridge-teal hover:bg-gray-100">
            About
          </Button>
          
          {isAuthenticated ? <>
              <Button variant="ghost" onClick={() => navigate(getDashboardPath())} className="text-gray-700 hover:text-mediBridge-teal hover:bg-gray-100">
                Dashboard
              </Button>
              <Button variant="outline" onClick={handleLogout} className="border-red-500 text-red-500 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </> : <>
              <Button variant="outline" onClick={() => navigate("/login")} className="border-mediBridge-teal text-mediBridge-teal hover:bg-mediBridge-teal hover:text-white">
                Login
              </Button>
              <Button onClick={() => navigate("/signup")} className="bg-mediBridge-navy text-white hover:bg-mediBridge-navy/90">
                Sign Up
              </Button>
            </>}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="px-4 py-3 md:hidden bg-white animate-fade-in">
          <div className="flex flex-col space-y-3">
            <Button variant="ghost" onClick={() => {
          navigate("/");
          setIsMenuOpen(false);
        }} className="justify-start text-gray-700 hover:text-mediBridge-teal hover:bg-gray-100">
              Home
            </Button>
            <Button variant="ghost" onClick={() => {
          navigate("/about");
          setIsMenuOpen(false);
        }} className="justify-start text-gray-700 hover:text-mediBridge-teal hover:bg-gray-100">
              About
            </Button>
            
            {isAuthenticated ? <>
                <Button variant="ghost" onClick={() => {
            navigate(getDashboardPath());
            setIsMenuOpen(false);
          }} className="justify-start text-gray-700 hover:text-mediBridge-teal hover:bg-gray-100">
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleLogout} className="justify-start border-red-500 text-red-500 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </> : <>
                <Button variant="outline" onClick={() => {
            navigate("/login");
            setIsMenuOpen(false);
          }} className="justify-start border-mediBridge-teal text-mediBridge-teal hover:bg-mediBridge-teal hover:text-white">
                  Login
                </Button>
                <Button onClick={() => {
            navigate("/signup");
            setIsMenuOpen(false);
          }} className="justify-start bg-mediBridge-navy text-white hover:bg-mediBridge-navy/90">
                  Sign Up
                </Button>
              </>}
          </div>
        </div>}
    </nav>;
}
