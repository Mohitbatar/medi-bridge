
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ambulance, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  
  const handleEmergencyClick = () => {
    if (isAuthenticated) {
      navigate("/emergency");
    } else {
      setIsAuthModalOpen(true);
      toast({
        title: "Authentication Required",
        description: "You need to login to request emergency services."
      });
    }
  };

  return (
    <>
      <section className="pt-16 text-white bg-mediBridge-navy py-0 my-[2px]">
        <div className="container flex flex-col items-center px-4 mx-auto text-center md:px-8 md:py-32 py-[28px]">
          <h1 className="mb-6 text-4xl font-bold md:text-6xl">
            MediBridge
          </h1>
          <p className="max-w-2xl mb-8 text-lg md:text-lg">
            Connecting You to Hospitals and Ambulances in Emergencies
          </p>
          <div className="flex flex-col w-full gap-4 max-w-md sm:flex-row sm:justify-center">
          </div>
        </div>
        
        <div className="h-16 bg-white hero-gradient py-0 my-0"></div>
      </section>

      <section className="py-[23px] bg-zinc-400">
        <div className="container px-4 mx-auto md:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-mediBridge-navy">
            Emergency Services
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-3xl">
              <div className="p-6 rounded-2xl bg-gray-400">
                <h3 className="mb-3 text-xl font-semibold text-mediBridge-navy">
                  Emergency for Self
                </h3>
                <p className="mb-6 text-gray-600">
                  Request immediate medical assistance for yourself. Your medical 
                  records will be shared with responders.
                </p>
                <button 
                  onClick={handleEmergencyClick} 
                  className="emergency-button emergency-self text-slate-50 bg-red-700 hover:bg-red-600"
                >
                  <Ambulance size={24} />
                  <span>Call Ambulance</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-3xl">
              <div className="p-6 rounded-2xl py-[24px] px-[30px] bg-gray-400">
                <h3 className="mb-3 text-xl font-semibold text-mediBridge-navy">
                  Report Emergency for Others
                </h3>
                <p className="mb-6 text-gray-600">
                  Report an emergency for someone else. Notify the nearest 
                  medical services of their situation.
                </p>
                <button 
                  onClick={handleEmergencyClick} 
                  className="emergency-button emergency-other"
                >
                  <AlertTriangle size={24} />
                  <span>Report Emergency</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-zinc-400">
        <div className="container px-4 mx-auto md:px-8">
          <h2 className="mb-12 text-3xl font-bold text-center text-mediBridge-navy">
            Why Choose MediBridge?
          </h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 shadow-md rounded-3xl bg-slate-300">
              <h3 className="mb-3 text-xl font-semibold text-mediBridge-teal">Quick Response</h3>
              <p className="text-gray-600">
                Get connected to the nearest medical services instantly during emergencies.
              </p>
            </div>
            
            <div className="p-6 shadow-md rounded-3xl bg-slate-300">
              <h3 className="mb-3 text-xl font-semibold text-mediBridge-teal">Secure Records</h3>
              <p className="text-gray-600">
                Your medical information is securely stored and only shared during emergencies.
              </p>
            </div>
            
            <div className="p-6 shadow-md rounded-3xl bg-slate-300">
              <h3 className="mb-3 text-xl font-semibold text-mediBridge-teal">Coordinated Care</h3>
              <p className="text-gray-600">
                Hospitals and ambulances work together through our platform for better care.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Index;
