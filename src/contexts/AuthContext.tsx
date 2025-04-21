
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import type { User, Session, WeakPassword } from '@supabase/supabase-js';
import { useToast } from "@/hooks/use-toast";

export type UserRole = 'public' | 'hospital' | 'ambulance' | null;

interface AuthUser {
  email: string;
  role: UserRole;
  id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; session: Session; weakPassword?: WeakPassword; } | { user: null; session: null; weakPassword?: null; }>;
  logout: () => Promise<void>;
  signup: (userData: any, role: UserRole) => Promise<{ user: User; session: Session | null; } | { user: null; session: null; }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user profile after a short delay to avoid race conditions
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();

            setUser({
              email: session.user.email!,
              role: profile?.role as UserRole,
              id: session.user.id
            });
            setIsAuthenticated(true);
          }, 0);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .maybeSingle();

          setUser({
            email: session.user.email!,
            role: profile?.role as UserRole,
            id: session.user.id
          });
          setIsAuthenticated(true);
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (userData: any, role: UserRole) => {
    try {
      // Check that we have the email field
      if (!userData.email) {
        throw new Error("Email is required");
      }

      const { error, data } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            role,
            ...userData,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. You are now logged in."
      });

      return data;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
