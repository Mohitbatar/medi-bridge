
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const AmbulanceSignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    ownerName: "",
    companyName: "",
    registrationNumber: "",
    vehicleModel: "",
    licenseNumber: "",
    contactPhone: "",
    contactEmail: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    const requiredFields = ['ownerName', 'registrationNumber', 'contactPhone', 'contactEmail', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      newErrors.contactPhone = 'Phone number must be 10 digits';
    }

    // Validate passwords match
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Fix: Pass the correct email field from the form
      await signup({
        ...formData,
        email: formData.contactEmail,
      }, 'ambulance');
      
      toast({
        title: "Ambulance account created successfully",
        description: "Welcome to MediBridge. You are now logged in."
      });
      
      navigate('/dashboard/ambulance');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error creating account",
        description: error.message || "There was a problem creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
      <Card className="w-full max-w-3xl shadow-lg animate-fade-in bg-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('/signup')} className="mr-2">
              <ArrowLeft size={16} />
            </Button>
            <CardTitle className="text-2xl font-bold">Ambulance Registration</CardTitle>
          </div>
          <CardDescription>
            Register your ambulance service for emergency dispatches
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Owner Information */}
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name*</Label>
                <Input id="ownerName" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="John Doe" className={errors.ownerName ? "border-red-500" : ""} />
                {errors.ownerName && <p className="text-xs text-red-500">{errors.ownerName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="City Ambulance Services" />
              </div>
              
              {/* Vehicle Information */}
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Ambulance Registration Number*</Label>
                <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="AMB-12345" className={errors.registrationNumber ? "border-red-500" : ""} />
                {errors.registrationNumber && <p className="text-xs text-red-500">{errors.registrationNumber}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="vehicleModel">Vehicle Model</Label>
                <Input id="vehicleModel" name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Ford Transit" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Plate Number</Label>
                <Input id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} placeholder="XYZ-1234" />
              </div>
              
              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone*</Label>
                <Input id="contactPhone" name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleChange} placeholder="1234567890" className={errors.contactPhone ? "border-red-500" : ""} />
                {errors.contactPhone && <p className="text-xs text-red-500">{errors.contactPhone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email*</Label>
                <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} placeholder="contact@cityambulance.com" className={errors.contactEmail ? "border-red-500" : ""} />
                {errors.contactEmail && <p className="text-xs text-red-500">{errors.contactEmail}</p>}
              </div>
              
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password*</Label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" className={errors.password ? "border-red-500" : ""} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password*</Label>
                <div className="relative">
                  <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={errors.confirmPassword ? "border-red-500" : ""} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
            
            <p className="text-xs text-gray-500">* Required fields</p>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-mediBridge-navy hover:bg-mediBridge-navy/90" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Ambulance Account"}
            </Button>
            
            <p className="mt-4 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Button type="button" variant="link" className="p-0 h-auto text-mediBridge-teal" onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AmbulanceSignUp;
