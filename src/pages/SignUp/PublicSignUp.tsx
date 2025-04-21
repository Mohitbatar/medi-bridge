import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
const PublicSignUp = () => {
  const navigate = useNavigate();
  const {
    signup
  } = useAuth();
  const {
    toast
  } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    email: "",
    phone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup', 'email', 'phone', 'password', 'confirmPassword'];
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'This field is required';
      }
    });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
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
      await signup(formData, 'public');
      toast({
        title: "Account created successfully",
        description: "Welcome to MediBridge. Please complete your medical history."
      });
      navigate('/onboarding/public');
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating account",
        description: "There was a problem creating your account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
      <Card className="w-full max-w-3xl shadow-lg animate-fade-in bg-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('/signup')} className="mr-2">
              <ArrowLeft size={16} />
            </Button>
            <CardTitle className="text-2xl font-bold">Public User Registration</CardTitle>
          </div>
          <CardDescription>
            Create your personal account to access emergency services
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Personal Information */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name*</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className={errors.firstName ? "border-red-500" : ""} />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name*</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className={errors.lastName ? "border-red-500" : ""} />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth*</Label>
                <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} className={errors.dateOfBirth ? "border-red-500" : ""} />
                {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender*</Label>
                <Select onValueChange={value => handleSelectChange("gender", value)} defaultValue={formData.gender}>
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group*</Label>
                <Select onValueChange={value => handleSelectChange("bloodGroup", value)} defaultValue={formData.bloodGroup}>
                  <SelectTrigger className={errors.bloodGroup ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bloodGroup && <p className="text-xs text-red-500">{errors.bloodGroup}</p>}
              </div>
              
              {/* Contact Information */}
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" className={errors.email ? "border-red-500" : ""} />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number*</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="1234567890" className={errors.phone ? "border-red-500" : ""} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>
              
              {/* Emergency Contact */}
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                <Input id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} placeholder="Jane Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
                <Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" value={formData.emergencyContactPhone} onChange={handleChange} placeholder="1234567890" />
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
              {isLoading ? "Creating Account..." : "Create Account"}
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
    </div>;
};
export default PublicSignUp;