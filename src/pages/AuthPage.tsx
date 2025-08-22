import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from "sonner";

const AuthPage = () => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Registration state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'employee' | 'supervisor' | 'admin'>('employee');
  const [adminCode, setAdminCode] = useState('');
  
  const { signIn, signUp, user, profile, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar o código de acesso para perfis de Gestor e Administrador
    if (role !== 'employee') {
      const accessCodes = {
        supervisor: 'gestor123',
        admin: 'admin456'
      };
      
      if (adminCode !== accessCodes[role]) {
        toast.error('Código de acesso inválido para este perfil');
        return;
      }
    }
    
    await signUp(registerEmail, registerPassword, name, role);
  };

  // Function to handle role changes safely with type checking
  const handleRoleChange = (value: string) => {
    // Only set the role if it matches one of our allowed types
    if (value === 'employee' || value === 'supervisor' || value === 'admin') {
      setRole(value);
    }
  };

  // Redirect if already logged in
  if (user && profile) {
    if (profile.role === 'employee') {
      return <Navigate to="/clock" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home button */}
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="mb-6 hover:bg-muted/50"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Registro de Ponto
          </h1>
          <p className="text-muted-foreground mt-2">Sistema de controle de jornada</p>
        </div>
        
        <Card className="backdrop-blur-sm bg-card/80 border-primary/20 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais ou crie uma nova conta
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mx-6 mb-6">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="transition-all focus:ring-2 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full hover:scale-105 transition-transform" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="register-name" className="text-sm font-medium">
                      Nome Completo
                    </label>
                    <Input
                      id="register-name"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      className="transition-all focus:ring-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showRegisterPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        required
                        className="transition-all focus:ring-2 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-role" className="text-sm font-medium">
                      Perfil de Usuário
                    </label>
                    <Select 
                      value={role} 
                      onValueChange={handleRoleChange}
                    >
                      <SelectTrigger id="register-role" className="transition-all focus:ring-2">
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border border-border">
                        <SelectItem value="employee">👤 Colaborador</SelectItem>
                        <SelectItem value="supervisor">👥 Gestor</SelectItem>
                        <SelectItem value="admin">🔧 Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {role !== 'employee' && (
                    <div className="space-y-2 animate-fade-in">
                      <label htmlFor="admin-code" className="text-sm font-medium">
                        Código de Acesso
                      </label>
                      <Input
                        id="admin-code"
                        type="password"
                        placeholder="Código para perfis especiais"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        required
                        className="transition-all focus:ring-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        💡 Necessário para cadastro como Gestor ou Administrador
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full hover:scale-105 transition-transform" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar Conta'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Help section */}
        <Card className="mt-6 bg-muted/50 border-muted">
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p className="font-medium">💡 Para testes rápidos:</p>
              <p>Crie uma conta - não é necessário confirmar email</p>
              <div className="pt-2 space-y-1">
                <p><strong>Códigos de acesso:</strong></p>
                <p>🏢 Gestor: <code className="bg-muted px-1 rounded">gestor123</code></p>
                <p>⚙️ Administrador: <code className="bg-muted px-1 rounded">admin456</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;