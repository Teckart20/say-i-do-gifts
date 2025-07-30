import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Gift, DollarSign, ShoppingCart, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Gift {
  id: string;
  name: string;
  description?: string;
  category: string;
  suggested_value?: number;
  desired_quantity: number;
  purchased_quantity: number;
  collected_amount?: number;
  purchase_link?: string;
  image_url?: string;
  display_order: number;
}

interface GiftManagementProps {
  coupleId: string;
}

const GiftManagement: React.FC<GiftManagementProps> = ({ coupleId }) => {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGift, setEditingGift] = useState<Gift | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'eletrodomesticos',
    suggested_value: '',
    desired_quantity: '1',
    purchase_link: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGifts();
  }, [coupleId]);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('couple_id', coupleId)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      toast({
        title: "Erro ao carregar presentes",
        description: "Ocorreu um erro ao carregar os presentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const giftData = {
        couple_id: coupleId,
        name: formData.name,
        description: formData.description || null,
        category: formData.category as any,
        suggested_value: formData.suggested_value ? parseFloat(formData.suggested_value) : null,
        desired_quantity: parseInt(formData.desired_quantity),
        purchase_link: formData.purchase_link || null,
        display_order: gifts.length,
      };

      if (editingGift) {
        const { error } = await supabase
          .from('gifts')
          .update(giftData)
          .eq('id', editingGift.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('gifts')
          .insert([giftData] as any);

        if (error) throw error;
      }

      toast({
        title: editingGift ? "Presente atualizado!" : "Presente adicionado!",
        description: "O presente foi salvo com sucesso.",
      });

      setDialogOpen(false);
      resetForm();
      fetchGifts();
    } catch (error) {
      console.error('Error saving gift:', error);
      toast({
        title: "Erro ao salvar presente",
        description: "Ocorreu um erro ao salvar o presente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (gift: Gift) => {
    setEditingGift(gift);
    setFormData({
      name: gift.name,
      description: gift.description || '',
      category: gift.category,
      suggested_value: gift.suggested_value?.toString() || '',
      desired_quantity: gift.desired_quantity.toString(),
      purchase_link: gift.purchase_link || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (giftId: string) => {
    if (!confirm('Tem certeza que deseja remover este presente?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', giftId);

      if (error) throw error;

      toast({
        title: "Presente removido!",
        description: "O presente foi removido da lista.",
      });

      fetchGifts();
    } catch (error) {
      console.error('Error deleting gift:', error);
      toast({
        title: "Erro ao remover presente",
        description: "Ocorreu um erro ao remover o presente.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingGift(null);
    setFormData({
      name: '',
      description: '',
      category: 'eletrodomesticos',
      suggested_value: '',
      desired_quantity: '1',
      purchase_link: '',
    });
  };

  const getStatusBadge = (gift: Gift) => {
    const status = (() => {
      if (gift.purchased_quantity === 0 && (gift.collected_amount || 0) === 0) {
        return 'disponivel';
      } else if (
        gift.purchased_quantity >= gift.desired_quantity ||
        (gift.suggested_value && (gift.collected_amount || 0) >= gift.suggested_value)
      ) {
        return 'esgotado';
      } else {
        return 'parcialmente_comprado';
      }
    })();

    const variants = {
      disponivel: { variant: 'default' as const, text: 'Disponível' },
      parcialmente_comprado: { variant: 'secondary' as const, text: 'Parcial' },
      esgotado: { variant: 'destructive' as const, text: 'Esgotado' },
    };

    return (
      <Badge variant={variants[status].variant}>
        {variants[status].text}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      eletrodomesticos: 'Eletrodomésticos',
      decoracao: 'Decoração',
      experiencias: 'Experiências',
      cotas: 'Cotas',
      doacao: 'Doação',
      cozinha: 'Cozinha',
      banho: 'Banho',
      quarto: 'Quarto',
      sala: 'Sala',
      outros: 'Outros',
    };
    return labels[category as keyof typeof labels] || category;
  };

  if (loading && gifts.length === 0) {
    return (
      <Card className="wedding-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Carregando presentes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-3xl font-bold">Lista de Presentes</h2>
          <p className="text-muted-foreground">Gerencie os presentes da sua lista</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="primary-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Presente
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingGift ? 'Editar Presente' : 'Adicionar Presente'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do presente
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Nome do Presente *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Liquidificador, Jogo de Panelas..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eletrodomesticos">Eletrodomésticos</SelectItem>
                      <SelectItem value="decoracao">Decoração</SelectItem>
                      <SelectItem value="experiencias">Experiências</SelectItem>
                      <SelectItem value="cotas">Cotas</SelectItem>
                      <SelectItem value="doacao">Doação</SelectItem>
                      <SelectItem value="cozinha">Cozinha</SelectItem>
                      <SelectItem value="banho">Banho</SelectItem>
                      <SelectItem value="quarto">Quarto</SelectItem>
                      <SelectItem value="sala">Sala</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="desired_quantity">Quantidade Desejada *</Label>
                  <Input
                    id="desired_quantity"
                    type="number"
                    min="1"
                    value={formData.desired_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, desired_quantity: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="suggested_value">Valor Sugerido (R$)</Label>
                  <Input
                    id="suggested_value"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.suggested_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, suggested_value: e.target.value }))}
                    placeholder="Opcional"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchase_link">Link de Compra</Label>
                  <Input
                    id="purchase_link"
                    type="url"
                    value={formData.purchase_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchase_link: e.target.value }))}
                    placeholder="https://loja.com/produto"
                  />
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o presente, cor, modelo, etc..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="primary-gradient">
                  {loading ? 'Salvando...' : (editingGift ? 'Atualizar' : 'Adicionar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {gifts.length === 0 ? (
        <Card className="wedding-card">
          <CardContent className="text-center py-12">
            <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-semibold mb-2">
              Nenhum presente na lista
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando presentes à sua lista
            </p>
            <Button onClick={() => setDialogOpen(true)} className="primary-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Presente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gifts.map((gift) => (
            <Card key={gift.id} className="wedding-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{gift.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {getCategoryLabel(gift.category)}
                    </CardDescription>
                  </div>
                  {getStatusBadge(gift)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {gift.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {gift.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <ShoppingCart className="w-4 h-4" />
                    <span>{gift.purchased_quantity}/{gift.desired_quantity}</span>
                  </div>
                  
                  {gift.suggested_value && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>R$ {gift.suggested_value.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                
                {gift.collected_amount && gift.collected_amount > 0 && (
                  <div className="text-sm text-green-600">
                    Arrecadado: R$ {gift.collected_amount.toFixed(2)}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(gift)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  
                  {gift.purchase_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(gift.purchase_link, '_blank')}
                    >
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(gift.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GiftManagement;