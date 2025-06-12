
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Hospital {
  id: string;
  hospital_name: string;
}

interface EmergencyReport {
  id: string;
  person_name: string | null;
  symptoms: string | null;
  report_type: string;
}

interface TransferHospitalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyReport: EmergencyReport;
  onTransferSuccess: () => void;
}

export default function TransferHospitalDialog({
  isOpen,
  onClose,
  emergencyReport,
  onTransferSuccess,
}: TransferHospitalDialogProps) {
  const { toast } = useToast();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch registered hospitals
  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["hospitals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("id, hospital_name")
        .order("hospital_name");

      if (error) throw error;
      return data as Hospital[];
    },
  });

  const handleTransfer = async () => {
    if (!selectedHospitalId) {
      toast({
        title: "Error",
        description: "Please select a hospital",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the emergency report with the assigned hospital
      const { error } = await supabase
        .from("emergency_reports")
        .update({
          assigned_hospital_id: selectedHospitalId,
          status: "transferred",
        })
        .eq("id", emergencyReport.id);

      if (error) throw error;

      toast({
        title: "Transfer successful",
        description: "Emergency case has been transferred to the selected hospital",
        variant: "default",
      });

      onTransferSuccess();
      onClose();
      setSelectedHospitalId("");
    } catch (error: any) {
      toast({
        title: "Transfer failed",
        description: error.message || "An error occurred during transfer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedHospitalId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Emergency Case</DialogTitle>
          <DialogDescription>
            Select a hospital to transfer this emergency case to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Emergency Details</h3>
            <div className="rounded-md bg-muted p-3 text-sm">
              <p><strong>Type:</strong> {emergencyReport.report_type}</p>
              <p><strong>Person:</strong> {emergencyReport.person_name || "Self"}</p>
              {emergencyReport.symptoms && (
                <p><strong>Symptoms:</strong> {emergencyReport.symptoms}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Hospital</h3>
            {isLoadingHospitals ? (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading hospitals...</span>
              </div>
            ) : hospitals && hospitals.length > 0 ? (
              <Select onValueChange={setSelectedHospitalId} value={selectedHospitalId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={hospital.id}>
                      {hospital.hospital_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800">
                No registered hospitals found
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleTransfer} disabled={!selectedHospitalId || isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Transfer Case
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
