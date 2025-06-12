import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, FileUp, User, ClipboardList, Phone, Ambulance, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import FileUpload from "@/components/FileUpload";
import UploadedFilesList from "@/components/UploadedFilesList";
import ProfileEditor from "@/components/ProfileEditor";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Json } from "@/integrations/supabase/types";

// Define a type for medical history structure
interface MedicalHistory {
  allergies: string;
  medications: string;
  chronicConditions: string;
  surgicalHistory: string;
  notes: string;
}

export default function PublicDashboard() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory>({
    allergies: "",
    medications: "",
    chronicConditions: "",
    surgicalHistory: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('public_users')
          .select('medical_history')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        // Safely parse medical history JSON, providing defaults if not present
        const medicalHistoryData = data?.medical_history as Record<string, unknown> || {};
        
        setMedicalHistory({
          allergies: typeof medicalHistoryData.allergies === 'string' ? medicalHistoryData.allergies : "",
          medications: typeof medicalHistoryData.medications === 'string' ? medicalHistoryData.medications : "",
          chronicConditions: typeof medicalHistoryData.chronicConditions === 'string' ? medicalHistoryData.chronicConditions : "",
          surgicalHistory: typeof medicalHistoryData.surgicalHistory === 'string' ? medicalHistoryData.surgicalHistory : "",
          notes: typeof medicalHistoryData.notes === 'string' ? medicalHistoryData.notes : ""
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load medical history",
          variant: "destructive"
        });
      }
    };

    fetchMedicalHistory();
  }, [user, toast]);

  const handleMedicalHistorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('public_users')
        .update({ 
          medical_history: medicalHistory as unknown as Json 
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Medical History Updated",
        description: "Your medical history has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update medical history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyClick = () => {
    navigate("/emergency");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalHistory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="container flex flex-col items-center justify-center min-h-[80vh]">
        <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
        <h1 className="mb-4 text-2xl font-bold text-center">Authentication Required</h1>
        <p className="mb-6 text-center text-gray-600">
          You need to be logged in to view this dashboard.
        </p>
        <Button 
          onClick={() => setShowAuthModal(true)} 
          className="bg-mediBridge-teal hover:bg-mediBridge-teal/90"
        >
          Login / Sign Up
        </Button>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-mediBridge-navy">Public User Dashboard</h1>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-700">Emergency Assistance</CardTitle>
            <CardDescription>Request immediate medical help</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button 
              onClick={handleEmergencyClick}
              className="flex items-center justify-center h-20 bg-red-600 hover:bg-red-700"
            >
              <Ambulance className="w-6 h-6 mr-2" />
              Emergency Services
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <ProfileEditor />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <FileUpload />
              <hr />
              <UploadedFilesList />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="medical" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" /> Medical History
              </CardTitle>
              <CardDescription>View and update your medical information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMedicalHistorySubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input 
                      id="allergies"
                      name="allergies"
                      value={medicalHistory.allergies}
                      onChange={handleInputChange}
                      placeholder="List your known allergies"
                    />
                  </div>
                  <div>
                    <Label htmlFor="medications">Current Medications</Label>
                    <Input 
                      id="medications"
                      name="medications"
                      value={medicalHistory.medications}
                      onChange={handleInputChange}
                      placeholder="List your current medications"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                  <Input 
                    id="chronicConditions"
                    name="chronicConditions"
                    value={medicalHistory.chronicConditions}
                    onChange={handleInputChange}
                    placeholder="List any chronic medical conditions"
                  />
                </div>
                <div>
                  <Label htmlFor="surgicalHistory">Surgical History</Label>
                  <Input 
                    id="surgicalHistory"
                    name="surgicalHistory"
                    value={medicalHistory.surgicalHistory}
                    onChange={handleInputChange}
                    placeholder="List previous surgeries"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes"
                    name="notes"
                    value={medicalHistory.notes}
                    onChange={handleInputChange}
                    placeholder="Any additional medical information"
                    className="min-h-[100px]"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-mediBridge-teal hover:bg-mediBridge-teal/90"
                >
                  {isLoading ? "Saving..." : "Update Medical History"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
