import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/contexts/AuthContext";
export default function ProfileEditor() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  const fetchProfile = async () => {
    if (!user) return;
    try {
      // Fetch basic profile information first
      const {
        data: profileData,
        error: profileError
      } = await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single();
      if (profileError) throw profileError;
      if (profileData) {
        setFirstName(profileData.first_name || "");
        setLastName(profileData.last_name || "");
      }

      // Fetch additional data based on user role
      if (user.role === 'public') {
        const {
          data: publicData,
          error: publicError
        } = await supabase.from('public_users').select('phone').eq('id', user.id).single();
        if (!publicError && publicData) {
          setPhone(publicData.phone || "");
        }
      } else if (user.role === 'hospital' || user.role === 'ambulance') {
        const table = user.role === 'hospital' ? 'hospitals' : 'ambulances';
        const {
          data: contactData,
          error: contactError
        } = await supabase.from(table).select('contact_phone').eq('id', user.id).single();
        if (!contactError && contactData) {
          setPhone(contactData.contact_phone || "");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      // Update basic profile information
      const {
        error: profileError
      } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName
      }).eq('id', user.id);
      if (profileError) throw profileError;

      // Update additional data based on user role
      if (user.role === 'public') {
        const {
          error: publicError
        } = await supabase.from('public_users').update({
          phone
        }).eq('id', user.id);
        if (publicError) throw publicError;
      } else if (user.role === 'hospital' || user.role === 'ambulance') {
        const table = user.role === 'hospital' ? 'hospitals' : 'ambulances';
        const {
          error: contactError
        } = await supabase.from(table).update({
          contact_phone: phone
        }).eq('id', user.id);
        if (contactError) throw contactError;
      }
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
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
  return <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
        <p className="text-sm text-gray-600">
          Update your personal information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
          <Input id="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter your first name" />
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
          <Input id="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter your last name" />
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm font-medium">Driving License Number
        </Label>
          <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" />
        </div>
      </div>

      <Button type="submit" disabled={isSaving} className="bg-mediBridge-teal hover:bg-mediBridge-teal/90">
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>;
}