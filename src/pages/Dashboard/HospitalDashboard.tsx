
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ClipboardList, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import ProfileEditor from "@/components/ProfileEditor";
import EmergencyReportsList from "@/components/EmergencyReportsList";

export default function HospitalDashboard() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      <h1 className="mb-8 text-3xl font-bold text-mediBridge-navy">Hospital Dashboard</h1>
      
      <Tabs defaultValue="emergency" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emergency">Incoming Emergencies</TabsTrigger>
          <TabsTrigger value="patients">Patient Data</TabsTrigger>
          <TabsTrigger value="profile">Hospital Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" /> Live Emergency Cases
              </CardTitle>
              <CardDescription>View and complete incoming emergency cases</CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyReportsList userRole="hospital" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="patients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ClipboardList className="w-5 h-5 mr-2" /> Patient Medical Records
              </CardTitle>
              <CardDescription>Access shared medical history of patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center bg-gray-100 rounded-lg">
                <p className="text-gray-600">No patient records available.</p>
                <p className="mt-2 text-sm text-gray-500">
                  Patient records are only shared during emergencies to protect privacy.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" /> Hospital Profile
              </CardTitle>
              <CardDescription>Edit hospital information and services</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileEditor />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
