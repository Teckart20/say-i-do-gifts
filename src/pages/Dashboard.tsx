import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Gift, 
  Users, 
  Settings, 
  BarChart3, 
  MessageSquare, 
  Calendar,
  ExternalLink,
  Plus,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import GiftManagement from '@/components/dashboard/GiftManagement';
import GuestManagement from '@/components/dashboard/GuestManagement';
import Analytics from '@/components/dashboard/Analytics';

interface CoupleProfile {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  slug: string;
  ceremony_address?: string;
  reception_address?: string;
  welcome_message?: string;
  pix_key?: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('couples')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!data) {
        // Perfil não existe, criar um novo baseado nos metadados do usuário
        const metadata = user?.user_metadata;
        if (metadata?.bride_name && metadata?.groom_name) {
          await createInitialProfile(metadata);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async (metadata: any) => {
    try {
      // Gerar slug único
      const { data: slugData } = await supabase.rpc('generate_unique_slug', {
        bride_name: metadata.bride_name,
        groom_name: metadata.groom_name
      });

      const newProfile = {
        user_id: user?.id,
        bride_name: metadata.bride_name,
        groom_name: metadata.groom_name,
        wedding_date: metadata.wedding_date,
        slug: slugData,
        welcome_message: `Com muito amor e carinho, ${metadata.bride_name} e ${metadata.groom_name} convidam vocês para celebrar conosco o nosso grande dia! Sua presença é o presente mais importante, mas se desejarem nos presentear, preparamos esta lista com muito carinho.`
      };

      const { data, error } = await supabase
        .from('couples')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error creating initial profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wedding-cream to-background flex items-center justify-center">
        <Card className="wedding-card p-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Carregando seu painel...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-wedding-cream to-background flex items-center justify-center p-4">
        <Card className="wedding-card max-w-md">
          <CardHeader className="text-center">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <CardTitle className="font-playfair text-2xl">Configuração Inicial</CardTitle>
            <CardDescription>
              Vamos configurar seu perfil de casal para começar!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => setActiveTab('settings')} 
              className="w-full primary-gradient"
            >
              Configurar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const publicUrl = `${window.location.origin}/casamento/${profile.slug}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wedding-cream to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-primary" />
              <div>
                <h1 className="font-playfair text-2xl font-bold">
                  {profile.bride_name} & {profile.groom_name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Casamento em {new Date(profile.wedding_date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex"
                onClick={() => window.open(publicUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Página Pública
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Visão Geral</span>
            </TabsTrigger>
            <TabsTrigger value="gifts" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              <span className="hidden sm:inline">Presentes</span>
            </TabsTrigger>
            <TabsTrigger value="guests" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Convidados</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="wedding-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Arrecadado</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 0,00</div>
                  <p className="text-xs text-muted-foreground">
                    +0% desde o último mês
                  </p>
                </CardContent>
              </Card>

              <Card className="wedding-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Presentes na Lista</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Adicione presentes à sua lista
                  </p>
                </CardContent>
              </Card>

              <Card className="wedding-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Convidados Confirmados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Aguardando confirmações
                  </p>
                </CardContent>
              </Card>

              <Card className="wedding-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dias para o Casamento</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.ceil((new Date(profile.wedding_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(profile.wedding_date).toLocaleDateString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="wedding-card">
                <CardHeader>
                  <CardTitle className="font-playfair">Primeiros Passos</CardTitle>
                  <CardDescription>
                    Configure sua lista de presentes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setActiveTab('gifts')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Presentes
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('settings')} 
                      className="w-full justify-start"
                      variant="outline"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Personalizar Página
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="wedding-card">
                <CardHeader>
                  <CardTitle className="font-playfair">Sua Página Pública</CardTitle>
                  <CardDescription>
                    Compartilhe com seus convidados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-mono break-all">{publicUrl}</p>
                    </div>
                    <Button 
                      onClick={() => window.open(publicUrl, '_blank')}
                      className="w-full primary-gradient"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visualizar Página
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gifts">
            <GiftManagement coupleId={profile.id} />
          </TabsContent>

          <TabsContent value="guests">
            <GuestManagement coupleId={profile.id} />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics coupleId={profile.id} />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings profile={profile} onUpdate={setProfile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;