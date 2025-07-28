-- Criar enums para status e categorias
CREATE TYPE public.gift_category AS ENUM (
  'eletrodomesticos',
  'decoracao',
  'experiencias',
  'cotas',
  'doacao',
  'cozinha',
  'banho',
  'quarto',
  'sala',
  'outros'
);

CREATE TYPE public.gift_status AS ENUM (
  'disponivel',
  'parcialmente_comprado',
  'esgotado'
);

CREATE TYPE public.rsvp_status AS ENUM (
  'pendente',
  'confirmado',
  'recusado'
);

CREATE TYPE public.wedding_theme AS ENUM (
  'classico',
  'moderno',
  'rustico',
  'minimalista',
  'romantico',
  'boho',
  'vintage'
);

-- Tabela de perfis de casal (usuários da plataforma)
CREATE TABLE public.couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  ceremony_address TEXT,
  ceremony_time TIME,
  reception_address TEXT,
  reception_time TIME,
  google_maps_link TEXT,
  welcome_message TEXT,
  slug TEXT UNIQUE NOT NULL,
  theme wedding_theme DEFAULT 'classico',
  primary_color TEXT DEFAULT '#e76e6e',
  secondary_color TEXT DEFAULT '#f5e6e8',
  accent_color TEXT DEFAULT '#d4af37',
  font_titles TEXT DEFAULT 'Playfair Display',
  font_body TEXT DEFAULT 'Inter',
  cover_photo_url TEXT,
  background_image_url TEXT,
  pix_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de presentes
CREATE TABLE public.gifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category gift_category NOT NULL,
  suggested_value DECIMAL(10,2),
  desired_quantity INTEGER NOT NULL DEFAULT 1,
  purchased_quantity INTEGER NOT NULL DEFAULT 0,
  collected_amount DECIMAL(10,2) DEFAULT 0,
  purchase_link TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  status gift_status GENERATED ALWAYS AS (
    CASE 
      WHEN purchased_quantity = 0 AND collected_amount = 0 THEN 'disponivel'
      WHEN purchased_quantity >= desired_quantity OR (suggested_value IS NOT NULL AND collected_amount >= suggested_value) THEN 'esgotado'
      ELSE 'parcialmente_comprado'
    END
  ) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de contribuições dos convidados
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_id UUID REFERENCES public.gifts(id) ON DELETE CASCADE NOT NULL,
  contributor_name TEXT,
  contributor_email TEXT,
  amount DECIMAL(10,2),
  quantity INTEGER DEFAULT 1,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_confirmed BOOLEAN DEFAULT false,
  payment_method TEXT, -- 'pix', 'link', 'manual'
  pix_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de convidados
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  rsvp_status rsvp_status DEFAULT 'pendente',
  companions_count INTEGER DEFAULT 0,
  rsvp_message TEXT,
  rsvp_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de galeria de fotos
CREATE TABLE public.photo_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de sugestões de presentes dos convidados
CREATE TABLE public.gift_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  suggested_gift TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'recusado'
  couple_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de mensagens do mural
CREATE TABLE public.guest_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_messages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para couples (apenas o próprio casal pode gerenciar)
CREATE POLICY "Couples can view their own profile" ON public.couples
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Couples can update their own profile" ON public.couples
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Couples can insert their own profile" ON public.couples
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view couples by slug" ON public.couples
  FOR SELECT USING (true);

-- Políticas RLS para gifts
CREATE POLICY "Couples can manage their gifts" ON public.gifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples 
      WHERE couples.id = gifts.couple_id 
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view available gifts" ON public.gifts
  FOR SELECT USING (status != 'esgotado');

-- Políticas RLS para contributions
CREATE POLICY "Couples can view their contributions" ON public.contributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.gifts g
      JOIN public.couples c ON c.id = g.couple_id
      WHERE g.id = contributions.gift_id 
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert contributions" ON public.contributions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Couples can update contributions" ON public.contributions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.gifts g
      JOIN public.couples c ON c.id = g.couple_id
      WHERE g.id = contributions.gift_id 
      AND c.user_id = auth.uid()
    )
  );

-- Políticas RLS para guests
CREATE POLICY "Couples can manage their guests" ON public.guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples 
      WHERE couples.id = guests.couple_id 
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can update RSVP" ON public.guests
  FOR UPDATE USING (true);

-- Políticas RLS para photo_gallery
CREATE POLICY "Couples can manage their gallery" ON public.photo_gallery
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples 
      WHERE couples.id = photo_gallery.couple_id 
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view gallery" ON public.photo_gallery
  FOR SELECT USING (true);

-- Políticas RLS para gift_suggestions
CREATE POLICY "Couples can view their suggestions" ON public.gift_suggestions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.couples 
      WHERE couples.id = gift_suggestions.couple_id 
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert suggestions" ON public.gift_suggestions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Couples can update suggestions" ON public.gift_suggestions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.couples 
      WHERE couples.id = gift_suggestions.couple_id 
      AND couples.user_id = auth.uid()
    )
  );

-- Políticas RLS para guest_messages
CREATE POLICY "Couples can manage messages" ON public.guest_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.couples 
      WHERE couples.id = guest_messages.couple_id 
      AND couples.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view approved messages" ON public.guest_messages
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can insert messages" ON public.guest_messages
  FOR INSERT WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_couples_updated_at
  BEFORE UPDATE ON public.couples
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gifts_updated_at
  BEFORE UPDATE ON public.gifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guests_updated_at
  BEFORE UPDATE ON public.guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gift_suggestions_updated_at
  BEFORE UPDATE ON public.gift_suggestions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para gerar slug único automaticamente
CREATE OR REPLACE FUNCTION public.generate_unique_slug(bride_name TEXT, groom_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Criar slug base removendo acentos e caracteres especiais
  base_slug := lower(
    regexp_replace(
      translate(
        bride_name || '-e-' || groom_name,
        'áàâãäéèêëíìîïóòôõöúùûüçñ',
        'aaaaaeeeeiiiioooooouuuucn'
      ),
      '[^a-z0-9-]', '-', 'g'
    )
  );
  
  -- Remover hífens duplos e limpar
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(both '-' from base_slug);
  
  final_slug := base_slug;
  
  -- Verificar se o slug já existe e adicionar número se necessário
  WHILE EXISTS (SELECT 1 FROM public.couples WHERE slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo
INSERT INTO public.couples (
  user_id,
  bride_name,
  groom_name,
  wedding_date,
  ceremony_address,
  ceremony_time,
  reception_address,
  reception_time,
  welcome_message,
  slug,
  pix_key
) VALUES (
  gen_random_uuid(), -- Você precisará substituir por um user_id real após autenticação
  'Maria Silva',
  'João Santos',
  '2024-12-15',
  'Igreja São João Batista - Rua das Flores, 123, Centro',
  '16:00',
  'Salão de Festas Elegance - Av. Principal, 456, Jardins',
  '19:00',
  'Com muito amor e carinho, convidamos vocês para celebrar conosco o nosso grande dia! Sua presença é o presente mais importante, mas se desejarem nos presentear, preparamos esta lista com muito carinho.',
  'maria-e-joao',
  'maria.joao@email.com'
);