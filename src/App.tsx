
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import About from "./pages/About";
import UserTypeSelection from "./pages/SignUp/UserTypeSelection";
import PublicSignUp from "./pages/SignUp/PublicSignUp";
import HospitalSignUp from "./pages/SignUp/HospitalSignUp";
import AmbulanceSignUp from "./pages/SignUp/AmbulanceSignUp";
import PublicDashboard from "./pages/Dashboard/PublicDashboard";
import HospitalDashboard from "./pages/Dashboard/HospitalDashboard";
import AmbulanceDashboard from "./pages/Dashboard/AmbulanceDashboard";
import NotFound from "./pages/NotFound";
import EmergencyPage from "./pages/EmergencyPage";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Index />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<UserTypeSelection />} />
              <Route path="signup/public" element={<PublicSignUp />} />
              <Route path="signup/hospital" element={<HospitalSignUp />} />
              <Route path="signup/ambulance" element={<AmbulanceSignUp />} />
              <Route path="dashboard/public" element={<PublicDashboard />} />
              <Route path="dashboard/hospital" element={<HospitalDashboard />} />
              <Route path="dashboard/ambulance" element={<AmbulanceDashboard />} />
              <Route path="emergency" element={<EmergencyPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
