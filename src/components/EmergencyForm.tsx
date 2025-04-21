
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EmergencyFormProps {
  type: 'self' | 'other';
  onClose: () => void;
}

export default function EmergencyForm({ type, onClose }: EmergencyFormProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [personName, setPersonName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your location. Please try again.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('emergency_reports').insert({
        user_id: user.id,
        report_type: type,
        location_lat: location.lat,
        location_lng: location.lng,
        person_name: type === 'other' ? personName : null,
        symptoms: symptoms || null,
        status: 'pending'
      });

      if (error) throw error;

      toast({
        title: "Emergency Reported",
        description: "Help is on the way. Stay calm.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          {type === 'self' ? 'Report Emergency for Self' : 'Report Emergency for Someone Else'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {type === 'self' 
            ? 'Request immediate assistance for yourself' 
            : 'Report an emergency situation for someone else'}
        </p>
      </div>

      {type === 'other' && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Person's Name</label>
          <Input
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Enter the person's name"
          />
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Symptoms or Situation</label>
        <Textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe the emergency situation or symptoms"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        {location ? (
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm">
              Latitude: {location.lat.toFixed(6)}<br />
              Longitude: {location.lng.toFixed(6)}
            </p>
          </div>
        ) : (
          <Button 
            type="button" 
            variant="outline" 
            onClick={getCurrentLocation}
            className="w-full"
          >
            Get Current Location
          </Button>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-red-600 hover:bg-red-700"
          disabled={isLoading || !location}
        >
          {isLoading ? "Submitting..." : "Report Emergency"}
        </Button>
      </div>
    </form>
  );
}
