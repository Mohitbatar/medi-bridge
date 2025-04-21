
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const HospitalSignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    hospitalName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    registrationNumber: "",
    contactPhone: "",
    contactEmail: "",
    password: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const requiredFields = ['hospitalName', 'address', 'city', 'state', 'zipCode', 'registrationNumber', 'contactPhone', 'contactEmail', 'password', 'confirmPassword'];
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

    // Validate zip code format
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (formData.zipCode && !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
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
      }, 'hospital');
      
      toast({
        title: "Hospital account created successfully",
        description: "Welcome to MediBridge. You are now logged in."
      });
      
      navigate('/dashboard/hospital');
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
            <CardTitle className="text-2xl font-bold">Hospital Registration</CardTitle>
          </div>
          <CardDescription>
            Register your hospital to connect with emergency services
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Hospital Information */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="hospitalName">Hospital Name*</Label>
                <Input id="hospitalName" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="City General Hospital" className={errors.hospitalName ? "border-red-500" : ""} />
                {errors.hospitalName && <p className="text-xs text-red-500">{errors.hospitalName}</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address*</Label>
                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Medical Center Dr" className={errors.address ? "border-red-500" : ""} />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city">City*</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="San Francisco" className={errors.city ? "border-red-500" : ""} />
                {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State*</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleChange} placeholder="California" className={errors.state ? "border-red-500" : ""} />
                {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code*</Label>
                <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="94102" className={errors.zipCode ? "border-red-500" : ""} />
                {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number*</Label>
                <Input id="registrationNumber" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="H-12345-CA" className={errors.registrationNumber ? "border-red-500" : ""} />
                {errors.registrationNumber && <p className="text-xs text-red-500">{errors.registrationNumber}</p>}
              </div>
              
              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone*</Label>
                <Input id="contactPhone" name="contactPhone" type="tel" value={formData.contactPhone} onChange={handleChange} placeholder="1234567890" className={errors.contactPhone ? "border-red-500" : ""} />
                {errors.contactPhone && <p className="text-xs text-red-500">{errors.contactPhone}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email*</Label>
                <Input id="contactEmail" name="contactEmail" type="email" value={formData.contactEmail} onChange={handleChange} placeholder="contact@citygeneral.org" className={errors.contactEmail ? "border-red-500" : ""} />
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
              {isLoading ? "Creating Account..." : "Create Hospital Account"}
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

export default HospitalSignUp;
