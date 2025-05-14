
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const getCurrentTime = () => {
    return new Date().toLocaleString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const [currentTime, setCurrentTime] = React.useState(getCurrentTime());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to={user?.role === 'employee' ? '/clock' : '/dashboard'} 
              className="text-xl font-bold text-primary"
            >
              Registro de Ponto
            </Link>
            <div className="hidden md:block text-sm text-gray-500">
              {currentTime}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium mr-2">
              {user?.name} ({user?.role === 'employee' ? 'Funcionário' : user?.role === 'supervisor' ? 'Supervisor' : 'Admin'})
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSignOut}
            >
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sistema de Registro de Ponto</p>
          <div className="mt-2 md:hidden text-xs">
            {currentTime}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
