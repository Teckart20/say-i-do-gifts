import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Lock, User, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    brideName: '',
    groomName: '',
    weddingDate: ''
  });
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } else {
        const metadata = {
          bride_name: formData.brideName,
          groom_name: formData.groomName,
          wedding_date: formData.weddingDate
        };
        const { error } = await signUp(formData.email, formData.password, metadata);
        // Se não houver erro, o usuário receberá um email de confirmação
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wedding-cream to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md wedding-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <span className="font-playfair text-2xl font-bold">Say I Do Gifts</span>
          </div>
          
          <CardTitle className="font-playfair text-2xl">
            {isLogin ? 'Entrar na Conta' : 'Criar Conta'}
          </CardTitle>
          
          <CardDescription className="text-lg">
            {isLogin 
              ? 'Acesse seu painel de presentes de casamento'
              : 'Crie sua lista de presentes dos sonhos'
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brideName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome da Noiva
                    </Label>
                    <Input
                      id="brideName"
                      name="brideName"
                      type="text"
                      value={formData.brideName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder="Maria"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="groomName" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome do Noivo
                    </Label>
                    <Input
                      id="groomName"
                      name="groomName"
                      type="text"
                      value={formData.groomName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      placeholder="João"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weddingDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Data do Casamento
                  </Label>
                  <Input
                    id="weddingDate"
                    name="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={handleInputChange}
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="seu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full primary-gradient hover:scale-105 romantic-transition"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </div>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2" />
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-3 text-sm text-muted-foreground">ou</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Ainda não tem conta? Criar agora' : 'Já tem conta? Entrar'}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => navigate('/')}
            >
              ← Voltar ao início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;