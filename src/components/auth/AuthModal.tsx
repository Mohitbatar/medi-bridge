
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  if (!isOpen) return null;

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md p-6 mx-4 rounded-lg animate-fade-in bg-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100">
            <X size={24} />
          </Button>
        </div>
        
        <p className="mb-6 text-gray-600">
          You need to be logged in to access emergency services. Please log in or sign up to continue.
        </p>
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button onClick={() => {
          onClose();
          navigate("/login");
        }} className="flex-1 bg-mediBridge-teal text-white hover:bg-mediBridge-teal/90">
            Login
          </Button>
          <Button onClick={() => {
          onClose();
          navigate("/signup");
        }} className="flex-1 bg-mediBridge-navy text-white hover:bg-mediBridge-navy/90">
            Sign Up
          </Button>
        </div>
      </div>
    </div>;
}
