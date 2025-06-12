import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigateToDashboard();
    }
  }, [isAuthenticated, user]);

  const navigateToDashboard = () => {
    if (!user) return;
    
    let dashboardPath = "/";
    switch (user.role) {
      case "public":
        dashboardPath = "/dashboard/public";
        break;
      case "hospital":
        dashboardPath = "/dashboard/hospital";
        break;
      case "ambulance":
        dashboardPath = "/dashboard/ambulance";
        break;
      default:
        dashboardPath = "/";
    }
    
    navigate(dashboardPath);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      // Navigation will be handled by the useEffect hook that watches isAuthenticated and user
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return <div className="container flex items-center justify-center min-h-screen px-4 py-12 mx-auto">
      <Card className="w-full max-w-md shadow-lg bg-slate-200">
        <CardHeader className="space-y-1 bg-transparent">
          <CardTitle className="text-2xl font-bold text-center">Login to MediBridge</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to login
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm border rounded-md bg-red-50 text-red-600 border-red-200">
                <div className="flex items-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              </div>}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button type="button" variant="link" className="p-0 h-auto text-xs text-mediBridge-teal" onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full bg-mediBridge-teal hover:bg-mediBridge-teal/90" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Sign In"}
            </Button>
            
            <p className="mt-4 text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Button type="button" variant="link" className="p-0 h-auto text-mediBridge-teal" onClick={() => navigate("/signup")}>
                Sign up
              </Button>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>;
};

export default Login;
