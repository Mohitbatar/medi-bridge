
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EmergencyForm from "@/components/EmergencyForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Ambulance, AlertTriangle } from "lucide-react";

export default function EmergencyPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<'self' | 'other'>('self');

  const handleEmergencyClick = (type: 'self' | 'other') => {
    setFormType(type);
    setIsFormOpen(true);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-center text-mediBridge-navy">
        Emergency Services
      </h1>

      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-3xl">
          <div className="p-6">
            <h3 className="mb-3 text-xl font-semibold text-mediBridge-navy">
              Emergency for Self
            </h3>
            <p className="mb-6 text-gray-600">
              Request immediate medical assistance for yourself. Your medical records will be shared with responders.
            </p>
            <Button
              onClick={() => handleEmergencyClick('self')}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              <Ambulance className="w-5 h-5 mr-2" />
              Call Ambulance
            </Button>
          </div>
        </div>

        <div className="overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-3xl">
          <div className="p-6">
            <h3 className="mb-3 text-xl font-semibold text-mediBridge-navy">
              Report Emergency for Others
            </h3>
            <p className="mb-6 text-gray-600">
              Report an emergency for someone else. Notify the nearest medical services of their situation.
            </p>
            <Button
              onClick={() => handleEmergencyClick('other')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Report Emergency
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <EmergencyForm type={formType} onClose={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
