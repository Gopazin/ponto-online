
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

// Define user types
type UserRole = 'employee' | 'supervisor' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  standard_start_time?: string;
  standard_end_time?: string;
  weekly_hours?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication for now - will be replaced with Supabase when integrated
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Check if the user is logged in via localStorage
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('timeClockUser');
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user', error);
          localStorage.removeItem('timeClockUser');
        }
      }
      
      setIsInitialized(true);
    };

    checkAuth();
  }, []);

  // Mock users for development
  const mockUsers = [
    {
      id: '1',
      email: 'employee@example.com',
      password: 'password123',
      name: 'John Employee',
      role: 'employee' as UserRole,
      standard_start_time: '09:00',
      standard_end_time: '18:00',
      weekly_hours: 40
    },
    {
      id: '2',
      email: 'supervisor@example.com',
      password: 'password123',
      name: 'Jane Supervisor',
      role: 'supervisor' as UserRole
    },
    {
      id: '3',
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      role: 'admin' as UserRole
    }
  ];

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Mock authentication - will be replaced with Supabase
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password before storing
        const { password, ...safeUser } = user;
        localStorage.setItem('timeClockUser', JSON.stringify(safeUser));
        setUser(safeUser);
        toast.success(`Bem-vindo, ${safeUser.name}!`);
      } else {
        toast.error('Email ou senha inválidos');
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('timeClockUser');
    setUser(null);
    toast.info('Sessão encerrada');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isInitialized, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
