
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Login = () => {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('employee');
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
      
      if (adminCode !== accessCodes[role as 'supervisor' | 'admin']) {
        toast.error('Código de acesso inválido para este perfil');
        return;
      }
    }
    
    await signUp(registerEmail, registerPassword, name, role);
  };

  // Função para obter o nome traduzido do papel
  const getRoleName = (roleType: string) => {
    switch(roleType) {
      case 'employee': return 'Colaborador';
      case 'supervisor': return 'Gestor';
      case 'admin': return 'Administrador';
      default: return roleType;
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Registro de Ponto</h1>
          <p className="text-muted-foreground">Controle de jornada de trabalho</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Acesso ao Sistema</CardTitle>
            <CardDescription>
              Entre com suas credenciais ou crie uma nova conta
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Senha</label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label htmlFor="register-name" className="text-sm font-medium">Nome</label>
                    <Input
                      id="register-name"
                      placeholder="Seu nome completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">Senha</label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="register-role" className="text-sm font-medium">Perfil</label>
                    <Select 
                      value={role} 
                      onValueChange={setRole}
                    >
                      <SelectTrigger id="register-role">
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Colaborador</SelectItem>
                        <SelectItem value="supervisor">Gestor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {role !== 'employee' && (
                    <div className="space-y-2">
                      <label htmlFor="admin-code" className="text-sm font-medium">Código de Acesso</label>
                      <Input
                        id="admin-code"
                        type="password"
                        placeholder="Código para perfis especiais"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Necessário para cadastro como Gestor ou Administrador.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando conta...' : 'Criar conta'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Para teste, você pode criar uma conta ou usar as credenciais de exemplo.</p>
          <p className="mt-2">Se criar uma conta, não é necessário confirmar o e-mail durante o desenvolvimento.</p>
          <p className="mt-2">Códigos de acesso para teste: Gestor (gestor123), Administrador (admin456)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
