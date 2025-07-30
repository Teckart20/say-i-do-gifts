import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users, Mail, Phone, UserCheck, UserX, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  rsvp_status: 'pendente' | 'confirmado' | 'recusado';
  companions_count: number;
  rsvp_message?: string;
  rsvp_date?: string;
}

interface GuestManagementProps {
  coupleId: string;
}

const GuestManagement: React.FC<GuestManagementProps> = ({ coupleId }) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchGuests();
  }, [coupleId]);

  const fetchGuests = async () => {
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('couple_id', coupleId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Erro ao carregar convidados",
        description: "Ocorreu um erro ao carregar os convidados.",
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
      const guestData = {
        couple_id: coupleId,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
      };

      if (editingGuest) {
        const { error } = await supabase
          .from('guests')
          .update(guestData)
          .eq('id', editingGuest.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('guests')
          .insert([guestData]);

        if (error) throw error;
      }

      toast({
        title: editingGuest ? "Convidado atualizado!" : "Convidado adicionado!",
        description: "O convidado foi salvo com sucesso.",
      });

      setDialogOpen(false);
      resetForm();
      fetchGuests();
    } catch (error) {
      console.error('Error saving guest:', error);
      toast({
        title: "Erro ao salvar convidado",
        description: "Ocorreu um erro ao salvar o convidado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setFormData({
      name: guest.name,
      email: guest.email || '',
      phone: guest.phone || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (guestId: string) => {
    if (!confirm('Tem certeza que deseja remover este convidado?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);

      if (error) throw error;

      toast({
        title: "Convidado removido!",
        description: "O convidado foi removido da lista.",
      });

      fetchGuests();
    } catch (error) {
      console.error('Error deleting guest:', error);
      toast({
        title: "Erro ao remover convidado",
        description: "Ocorreu um erro ao remover o convidado.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingGuest(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
  };

  const getStatusBadge = (status: Guest['rsvp_status']) => {
    const variants = {
      pendente: { variant: 'secondary' as const, text: 'Pendente', icon: Clock },
      confirmado: { variant: 'default' as const, text: 'Confirmado', icon: UserCheck },
      recusado: { variant: 'destructive' as const, text: 'Recusado', icon: UserX },
    };

    const { variant, text, icon: Icon } = variants[status];

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {text}
      </Badge>
    );
  };

  const getStats = () => {
    const confirmed = guests.filter(g => g.rsvp_status === 'confirmado').length;
    const declined = guests.filter(g => g.rsvp_status === 'recusado').length;
    const pending = guests.filter(g => g.rsvp_status === 'pendente').length;
    const totalCompanions = guests
      .filter(g => g.rsvp_status === 'confirmado')
      .reduce((sum, g) => sum + g.companions_count, 0);

    return { confirmed, declined, pending, totalCompanions };
  };

  const stats = getStats();

  if (loading && guests.length === 0) {
    return (
      <Card className="wedding-card">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
            <p className="text-muted-foreground">Carregando convidados...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-3xl font-bold">Lista de Convidados</h2>
          <p className="text-muted-foreground">Gerencie os convidados e RSVP</p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="primary-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Convidado
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGuest ? 'Editar Convidado' : 'Adicionar Convidado'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do convidado
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome completo do convidado"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@exemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="primary-gradient">
                  {loading ? 'Salvando...' : (editingGuest ? 'Atualizar' : 'Adicionar')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Convidados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guests.length}</div>
          </CardContent>
        </Card>

        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmados</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">
              + {stats.totalCompanions} acompanhantes
            </p>
          </CardContent>
        </Card>

        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card className="wedding-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recusados</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
          </CardContent>
        </Card>
      </div>

      {guests.length === 0 ? (
        <Card className="wedding-card">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-playfair text-xl font-semibold mb-2">
              Nenhum convidado na lista
            </h3>
            <p className="text-muted-foreground mb-6">
              Comece adicionando convidados à sua lista
            </p>
            <Button onClick={() => setDialogOpen(true)} className="primary-gradient">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Convidado
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="wedding-card">
          <CardHeader>
            <CardTitle>Lista de Convidados</CardTitle>
            <CardDescription>
              Gerencie seus convidados e acompanhe as confirmações de presença
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{guest.name}</h4>
                      {getStatusBadge(guest.rsvp_status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {guest.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {guest.email}
                        </div>
                      )}
                      {guest.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {guest.phone}
                        </div>
                      )}
                      {guest.rsvp_status === 'confirmado' && guest.companions_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          +{guest.companions_count} acompanhante{guest.companions_count > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                    
                    {guest.rsvp_message && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{guest.rsvp_message}"
                      </p>
                    )}
                    
                    {guest.rsvp_date && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Respondido em {new Date(guest.rsvp_date).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(guest)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(guest.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GuestManagement;