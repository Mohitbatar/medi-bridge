
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Ambulance, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import ProfileEditor from "@/components/ProfileEditor";
import VehicleDetailsEditor from "@/components/VehicleDetailsEditor";
import DocumentUploader from "@/components/DocumentUploader";
import EmergencyReportsList from "@/components/EmergencyReportsList";

export default function AmbulanceDashboard() {
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
      <h1 className="mb-8 text-3xl font-bold text-mediBridge-navy">Ambulance Dashboard</h1>
      
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
          <TabsTrigger value="profile">Profile & Vehicle</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ambulance className="w-5 h-5 mr-2" /> Emergency Requests
              </CardTitle>
              <CardDescription>View and transfer emergency service requests to hospitals</CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyReportsList userRole="ambulance" />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="pt-6">
                <ProfileEditor />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <VehicleDetailsEditor />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileUp className="w-5 h-5 mr-2" /> Documents
              </CardTitle>
              <CardDescription>Upload and manage required documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <DocumentUploader 
                  documentType="Driver ID" 
                  description="Upload your driver's identification or license" 
                />
                
                <DocumentUploader 
                  documentType="Vehicle Registration" 
                  description="Upload your vehicle registration certificate" 
                />
                
                <DocumentUploader 
                  documentType="Insurance Certificate" 
                  description="Upload your ambulance insurance documents" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
