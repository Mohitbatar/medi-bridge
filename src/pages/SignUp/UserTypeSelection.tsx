import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Building2, Ambulance } from "lucide-react";
const UserTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const handleContinue = () => {
    if (selectedType === 'public') {
      navigate('/signup/public');
    } else if (selectedType === 'hospital') {
      navigate('/signup/hospital');
    } else if (selectedType === 'ambulance') {
      navigate('/signup/ambulance');
    }
  };
  return <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
      <Card className="w-full max-w-3xl shadow-lg animate-fade-in bg-slate-200">
        <CardHeader className="space-y-1 bg-transparent">
          <CardTitle className="text-2xl font-bold text-center">Create your MediBridge Account</CardTitle>
          <CardDescription className="text-center">
            Select your user type to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 mt-4 md:grid-cols-3">
            {/* Public User Option */}
            <div className={`flex flex-col items-center p-6 cursor-pointer border rounded-xl transition-all ${selectedType === 'public' ? 'border-mediBridge-teal bg-mediBridge-light shadow-md' : 'border-gray-200 hover:border-mediBridge-teal hover:shadow-md'}`} onClick={() => setSelectedType('public')}>
              <div className={`p-3 rounded-full ${selectedType === 'public' ? 'bg-mediBridge-teal text-white' : 'bg-gray-100 text-gray-600'}`}>
                <User size={28} />
              </div>
              <h3 className="mt-4 text-lg font-medium">Public User</h3>
              <p className="mt-2 text-sm text-center text-gray-500">
                Create an account to access emergency services
              </p>
            </div>

            {/* Hospital Option */}
            <div className={`flex flex-col items-center p-6 cursor-pointer border rounded-xl transition-all ${selectedType === 'hospital' ? 'border-mediBridge-teal bg-mediBridge-light shadow-md' : 'border-gray-200 hover:border-mediBridge-teal hover:shadow-md'}`} onClick={() => setSelectedType('hospital')}>
              <div className={`p-3 rounded-full ${selectedType === 'hospital' ? 'bg-mediBridge-teal text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Building2 size={28} />
              </div>
              <h3 className="mt-4 text-lg font-medium">Hospital</h3>
              <p className="mt-2 text-sm text-center text-gray-500">
                Register your hospital to connect with emergency cases
              </p>
            </div>

            {/* Ambulance Option */}
            <div className={`flex flex-col items-center p-6 cursor-pointer border rounded-xl transition-all ${selectedType === 'ambulance' ? 'border-mediBridge-teal bg-mediBridge-light shadow-md' : 'border-gray-200 hover:border-mediBridge-teal hover:shadow-md'}`} onClick={() => setSelectedType('ambulance')}>
              <div className={`p-3 rounded-full ${selectedType === 'ambulance' ? 'bg-mediBridge-teal text-white' : 'bg-gray-100 text-gray-600'}`}>
                <Ambulance size={28} />
              </div>
              <h3 className="mt-4 text-lg font-medium">Ambulance</h3>
              <p className="mt-2 text-sm text-center text-gray-500">
                Register your ambulance service for emergency dispatches
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button onClick={handleContinue} disabled={!selectedType} className="w-full bg-mediBridge-navy hover:bg-mediBridge-navy/90">
            Continue
          </Button>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Button variant="link" className="p-0 h-auto text-mediBridge-teal" onClick={() => navigate("/login")}>
              Sign in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>;
};
export default UserTypeSelection;