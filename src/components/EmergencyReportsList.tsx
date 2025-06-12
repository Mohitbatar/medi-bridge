
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import TransferHospitalDialog from "./TransferHospitalDialog";

interface EmergencyReport {
  id: string;
  person_name: string | null;
  symptoms: string | null;
  report_type: string;
  location_lat: number;
  location_lng: number;
  created_at: string;
  status: string;
  assigned_hospital_id?: string | null;
  hospitals?: { hospital_name: string } | null;
}

interface EmergencyReportsListProps {
  userRole?: string;
}

export default function EmergencyReportsList({ userRole }: EmergencyReportsListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<EmergencyReport | null>(null);

  const { data: reports, isLoading, refetch } = useQuery({
    queryKey: ['emergency-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emergency_reports')
        .select(`
          *,
          hospitals:assigned_hospital_id (
            hospital_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmergencyReport[];
    }
  });

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const effectiveUserRole = userRole || userProfile?.role;
  const isAmbulanceUser = effectiveUserRole === 'ambulance';
  const isHospitalUser = effectiveUserRole === 'hospital';

  const handleTransferClick = (report: EmergencyReport) => {
    setSelectedReport(report);
    setIsTransferDialogOpen(true);
  };

  const handleCompleteEmergency = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('emergency_reports')
        .delete()
        .eq('id', reportId);

      if (error) throw error;
      
      toast({
        title: "Emergency completed",
        description: "The emergency case has been completed and removed from the system.",
        variant: "default",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete the emergency case",
        variant: "destructive",
      });
    }
  };

  const onTransferSuccess = () => {
    refetch();
    setIsTransferDialogOpen(false);
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading emergency reports...</div>;
  }

  if (!reports?.length) {
    return (
      <div className="p-6 text-center bg-gray-100 rounded-lg">
        <p className="text-gray-600">No active emergency cases at the moment.</p>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Person</TableHead>
            <TableHead>Symptoms</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            {isAmbulanceUser && <TableHead>Assigned To</TableHead>}
            {(isAmbulanceUser || isHospitalUser) && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  {report.report_type}
                </div>
              </TableCell>
              <TableCell>{report.person_name || 'Self'}</TableCell>
              <TableCell>{report.symptoms || 'Not specified'}</TableCell>
              <TableCell>
                <a 
                  href={`https://www.google.com/maps?q=${report.location_lat},${report.location_lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on map
                </a>
              </TableCell>
              <TableCell>
                {new Date(report.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  report.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                  'bg-green-100 text-green-800'
                }`}>
                  {report.status}
                </span>
              </TableCell>
              {isAmbulanceUser && (
                <TableCell>
                  {report.hospitals?.hospital_name || 'Not assigned'}
                </TableCell>
              )}
              {(isAmbulanceUser || isHospitalUser) && (
                <TableCell>
                  <div className="flex gap-2">
                    {isAmbulanceUser && report.status !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleTransferClick(report)}
                        disabled={report.status === 'completed'}
                      >
                        Transfer
                      </Button>
                    )}
                    {isHospitalUser && report.status !== 'completed' && (
                      <Button 
                        size="sm" 
                        variant="default"
                        onClick={() => handleCompleteEmergency(report.id)}
                        disabled={report.status === 'completed'}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedReport && (
        <TransferHospitalDialog
          isOpen={isTransferDialogOpen}
          onClose={() => setIsTransferDialogOpen(false)}
          emergencyReport={selectedReport}
          onTransferSuccess={onTransferSuccess}
        />
      )}
    </>
  );
}
