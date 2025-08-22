import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, BarChart3, Shield, Check } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Clock,
      title: 'Registro de Ponto',
      description: 'Sistema completo de controle de jornada de trabalho com precisão e facilidade.'
    },
    {
      icon: Users,
      title: 'Gestão de Equipe',
      description: 'Supervisione e gerencie o tempo de trabalho de toda sua equipe em tempo real.'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Detalhados',
      description: 'Analise produtividade e gere relatórios completos para tomada de decisões.'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Dados protegidos com criptografia e controle de acesso baseado em perfis.'
    }
  ];

  const benefits = [
    'Controle preciso de horários',
    'Interface intuitiva e moderna',
    'Relatórios em tempo real',
    'Múltiplos perfis de usuário',
    'Histórico completo de registros',
    'Compatível com dispositivos móveis'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-secondary/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Registro de Ponto
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Controle completo de jornada de trabalho com tecnologia moderna e interface intuitiva
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-transform">
                <Link to="/auth">
                  Começar Agora
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3 hover:scale-105 transition-transform">
                <Link to="/auth">
                  Fazer Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar o tempo de trabalho da sua equipe de forma eficiente
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-muted">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Por que escolher nosso sistema?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Desenvolvido com as melhores práticas de usabilidade e segurança, 
                nosso sistema oferece uma experiência completa para gestão de tempo.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 bg-card/80 backdrop-blur-sm border-primary/20">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl">Começe agora mesmo</CardTitle>
                  <CardDescription>
                    Crie sua conta gratuita e experimente todas as funcionalidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/auth">
                      Criar Conta Gratuita
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Sem compromisso • Configure em minutos
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Registro de Ponto. Sistema completo de controle de jornada.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;