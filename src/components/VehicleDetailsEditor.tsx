
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function VehicleDetailsEditor() {
  const [companyName, setCompanyName] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.role === 'ambulance') {
      fetchVehicleDetails();
    }
  }, [user]);

  const fetchVehicleDetails = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ambulances')
        .select('company_name, vehicle_model, license_number, registration_number')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setCompanyName(data.company_name || "");
        setVehicleModel(data.vehicle_model || "");
        setLicenseNumber(data.license_number || "");
        setRegistrationNumber(data.registration_number || "");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load vehicle details",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('ambulances')
        .update({
          company_name: companyName,
          vehicle_model: vehicleModel,
          license_number: licenseNumber,
          registration_number: registrationNumber
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Vehicle Details Updated",
        description: "Your vehicle information has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
        <p className="text-sm text-gray-600">
          Update your ambulance details
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <Label htmlFor="vehicleModel" className="text-sm font-medium">Vehicle Model</Label>
          <Input
            id="vehicleModel"
            value={vehicleModel}
            onChange={(e) => setVehicleModel(e.target.value)}
            placeholder="Enter vehicle model"
          />
        </div>

        <div>
          <Label htmlFor="licenseNumber" className="text-sm font-medium">License Number</Label>
          <Input
            id="licenseNumber"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            placeholder="Enter license number"
          />
        </div>

        <div>
          <Label htmlFor="registrationNumber" className="text-sm font-medium">Registration Number</Label>
          <Input
            id="registrationNumber"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Enter registration number"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSaving} className="bg-mediBridge-teal hover:bg-mediBridge-teal/90">
        {isSaving ? "Saving..." : "Save Vehicle Details"}
      </Button>
    </form>
  );
}
