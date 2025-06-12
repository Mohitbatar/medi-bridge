
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  
  return (
    <div className="container px-4 py-16 mx-auto md:py-24">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-mediBridge-navy md:text-5xl">
            About MediBridge
          </h1>
          <p className="text-xl text-gray-600">
            Connecting You to Hospitals and Ambulances in Emergencies
          </p>
        </div>

        <div className="space-y-6 text-gray-700">
          <p className="leading-relaxed">
            MediBridge is a smart, life-saving web platform designed to seamlessly connect the general public, hospitals, and ambulances during emergencies. Our mission is to reduce response times, ensure accurate medical communication, and simplify the way people access emergency healthcare.
          </p>
          
          <p className="leading-relaxed">
            In critical moments, every second counts. MediBridge empowers users to report emergencies either for themselves or on behalf of someone else. When a public user reports an emergency for themselves, the system immediately locates them, notifies the nearest ambulance, and securely shares their medical history with the nearest hospital — enabling fast and informed care on arrival.
          </p>
          
          <p className="leading-relaxed">
            The platform offers separate dashboards for Hospitals, Ambulance Services, and Public Users, each tailored to their roles. Hospitals can view incoming cases and patient data in real time, while ambulances receive live alerts and manage vehicle information. Public users can maintain their medical history, upload prescriptions, and call for help with a single click.
          </p>
          
          <p className="leading-relaxed">
            By combining intuitive design, secure data handling, and location-based emergency routing using Google Maps API, MediBridge is revolutionizing the way emergency healthcare is accessed and managed.
          </p>
          
          <p className="leading-relaxed">
            Whether you're seeking help, providing it, or responding to it — MediBridge is the bridge that connects us all when it matters the most.
          </p>
        </div>
        
        <div className="flex justify-center pt-6">
          <Button 
            onClick={() => navigate("/")}
            className="bg-mediBridge-teal hover:bg-mediBridge-teal/90 text-white"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
