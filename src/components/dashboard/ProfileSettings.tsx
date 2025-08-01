import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Save, Palette, Type, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CoupleProfile {
  id: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  slug: string;
  ceremony_address?: string;
  ceremony_time?: string;
  reception_address?: string;
  reception_time?: string;
  welcome_message?: string;
  pix_key?: string;
  google_maps_link?: string;
  theme?: 'classico' | 'moderno' | 'rustico' | 'minimalista' | 'romantico' | 'boho' | 'vintage';
  primary_color?: string;
  secondary_color?: string;
  accent_color?: string;
  font_titles?: string;
  font_body?: string;
  cover_photo_url?: string;
  background_image_url?: string;
}

interface ProfileSettingsProps {
  profile: CoupleProfile;
  onUpdate: (profile: CoupleProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('couples')
        .update(formData)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      onUpdate(data);
      toast({
        title: "Configurações salvas!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações Básicas */}
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="font-playfair">Informações do Casal</CardTitle>
          <CardDescription>
            Informações básicas sobre o casamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bride_name">Nome da Noiva</Label>
              <Input
                id="bride_name"
                value={formData.bride_name}
                onChange={(e) => handleInputChange('bride_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groom_name">Nome do Noivo</Label>
              <Input
                id="groom_name"
                value={formData.groom_name}
                onChange={(e) => handleInputChange('groom_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wedding_date">Data do Casamento</Label>
              <Input
                id="wedding_date"
                type="date"
                value={formData.wedding_date}
                onChange={(e) => handleInputChange('wedding_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Personalizada</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                  /casamento/
                </span>
                <Input
                  id="slug"
                  className="rounded-l-none"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="welcome_message">Mensagem de Boas-Vindas</Label>
            <Textarea
              id="welcome_message"
              value={formData.welcome_message || ''}
              onChange={(e) => handleInputChange('welcome_message', e.target.value)}
              rows={4}
              placeholder="Escreva uma mensagem carinhosa para seus convidados..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Informações do Evento */}
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="font-playfair">Informações do Evento</CardTitle>
          <CardDescription>
            Detalhes sobre cerimônia e recepção
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ceremony_address">Endereço da Cerimônia</Label>
              <Input
                id="ceremony_address"
                value={formData.ceremony_address || ''}
                onChange={(e) => handleInputChange('ceremony_address', e.target.value)}
                placeholder="Igreja, cartório..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ceremony_time">Horário da Cerimônia</Label>
              <Input
                id="ceremony_time"
                type="time"
                value={formData.ceremony_time || ''}
                onChange={(e) => handleInputChange('ceremony_time', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reception_address">Endereço da Recepção</Label>
              <Input
                id="reception_address"
                value={formData.reception_address || ''}
                onChange={(e) => handleInputChange('reception_address', e.target.value)}
                placeholder="Salão de festas..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reception_time">Horário da Recepção</Label>
              <Input
                id="reception_time"
                type="time"
                value={formData.reception_time || ''}
                onChange={(e) => handleInputChange('reception_time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_maps_link">Link do Google Maps</Label>
            <Input
              id="google_maps_link"
              value={formData.google_maps_link || ''}
              onChange={(e) => handleInputChange('google_maps_link', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Pagamento */}
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="font-playfair">Configurações de Pagamento</CardTitle>
          <CardDescription>
            Configuração do Pix para receber contribuições
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pix_key">Chave Pix</Label>
            <Input
              id="pix_key"
              value={formData.pix_key || ''}
              onChange={(e) => handleInputChange('pix_key', e.target.value)}
              placeholder="CPF, e-mail ou chave aleatória"
            />
            <p className="text-sm text-muted-foreground">
              Esta chave será usada para gerar QR Codes automáticos para os convidados
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personalização Visual */}
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="font-playfair flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Personalização Visual
          </CardTitle>
          <CardDescription>
            Customize as cores e fontes da sua página
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Tema</Label>
            <Select
              value={formData.theme || 'classico'}
              onValueChange={(value) => handleInputChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classico">Clássico</SelectItem>
                <SelectItem value="moderno">Moderno</SelectItem>
                <SelectItem value="rustico">Rústico</SelectItem>
                <SelectItem value="minimalista">Minimalista</SelectItem>
                <SelectItem value="romantico">Romântico</SelectItem>
                <SelectItem value="boho">Boho</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Cor Primária</Label>
              <Input
                id="primary_color"
                type="color"
                value={formData.primary_color || '#e76e6e'}
                onChange={(e) => handleInputChange('primary_color', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Cor Secundária</Label>
              <Input
                id="secondary_color"
                type="color"
                value={formData.secondary_color || '#f5e6e8'}
                onChange={(e) => handleInputChange('secondary_color', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accent_color">Cor de Destaque</Label>
              <Input
                id="accent_color"
                type="color"
                value={formData.accent_color || '#d4af37'}
                onChange={(e) => handleInputChange('accent_color', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font_titles">Fonte dos Títulos</Label>
              <Select
                value={formData.font_titles || 'Playfair Display'}
                onValueChange={(value) => handleInputChange('font_titles', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Great Vibes">Great Vibes</SelectItem>
                  <SelectItem value="Dancing Script">Dancing Script</SelectItem>
                  <SelectItem value="Crimson Text">Crimson Text</SelectItem>
                  <SelectItem value="Cormorant Garamond">Cormorant Garamond</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font_body">Fonte do Texto</Label>
              <Select
                value={formData.font_body || 'Inter'}
                onValueChange={(value) => handleInputChange('font_body', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="primary-gradient"
          size="lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Salvando...
            </div>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Salvar Configurações
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;