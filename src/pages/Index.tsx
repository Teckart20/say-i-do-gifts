import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Gift, Users, Sparkles, ShieldCheck, Palette } from "lucide-react";
import weddingHero from "@/assets/wedding-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-wedding-cream to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${weddingHero})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-3 mb-8">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Say I Do Gifts</span>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              A Lista de Presentes
              <span className="text-transparent bg-clip-text primary-gradient block">
                Perfeita Para Seu
              </span>
              <span className="text-transparent bg-clip-text romantic-gradient">
                Grande Dia
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
              Crie uma experiência única e memorável para seus convidados. 
              Gerencie sua lista de presentes com elegância, receba contribuições via Pix 
              e personalize tudo do seu jeito.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-8 py-6 text-lg font-semibold primary-gradient hover:scale-105 romantic-transition glow-effect"
              >
                <Heart className="w-5 h-5 mr-2" />
                Começar Agora
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5 romantic-transition"
              >
                <Gift className="w-5 h-5 mr-2" />
                Ver Exemplo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-wedding-cream/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              Tudo o que Vocês Precisam
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa pensada especialmente para casais modernos
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="wedding-card hover:scale-105 romantic-transition">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 primary-gradient rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="font-playfair text-2xl">Lista Inteligente</CardTitle>
                <CardDescription className="text-lg">
                  Gerencie presentes, cotas e experiências com controle total de estoque
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="wedding-card hover:scale-105 romantic-transition">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 romantic-gradient rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-playfair text-2xl">Pix Integrado</CardTitle>
                <CardDescription className="text-lg">
                  QR Code automático para contribuições e confirmação em tempo real
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="wedding-card hover:scale-105 romantic-transition">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-wedding-sage rounded-full flex items-center justify-center">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-playfair text-2xl">Personalização</CardTitle>
                <CardDescription className="text-lg">
                  Temas, cores, fontes e fotos - tudo do jeito que vocês sonharam
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="wedding-card hover:scale-105 romantic-transition">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-wedding-gold rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-playfair text-2xl">RSVP Integrado</CardTitle>
                <CardDescription className="text-lg">
                  Confirmação de presença e gestão completa de convidados
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="wedding-card hover:scale-105 romantic-transition">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-wedding-rose rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="font-playfair text-2xl">Segurança Total</CardTitle>
                <CardDescription className="text-lg">
                  Dados protegidos, autenticação segura e backup automático
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="wedding-card hover:scale-105 romantic-transition">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 primary-gradient rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="font-playfair text-2xl">Relatórios</CardTitle>
                <CardDescription className="text-lg">
                  Acompanhe tudo em tempo real com dashboards completos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-primary/5 via-background to-wedding-rose/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-6">
              Pronto Para Começar?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Crie sua lista de presentes em poucos minutos e deixe seu casamento ainda mais especial
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="px-12 py-6 text-xl font-semibold primary-gradient hover:scale-105 romantic-transition glow-effect"
              >
                <Heart className="w-6 h-6 mr-3" />
                Criar Minha Lista
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">
              ✨ Gratuito para começar • 💝 Sem taxas ocultas • 🎉 Suporte completo
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-playfair text-2xl font-bold">Say I Do Gifts</span>
          </div>
          <p className="text-muted-foreground">
            Feito com 💝 para casais que sonham com o dia perfeito
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
