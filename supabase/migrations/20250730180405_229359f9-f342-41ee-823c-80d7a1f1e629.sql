-- Corrigir problemas de segurança: adicionar search_path às funções

-- Corrigir função get_gift_status
CREATE OR REPLACE FUNCTION public.get_gift_status(
  purchased_qty INTEGER,
  desired_qty INTEGER,
  collected_amt DECIMAL,
  suggested_val DECIMAL
) RETURNS TEXT AS $$
BEGIN
  IF purchased_qty = 0 AND (collected_amt IS NULL OR collected_amt = 0) THEN
    RETURN 'disponivel';
  ELSIF purchased_qty >= desired_qty OR (suggested_val IS NOT NULL AND collected_amt IS NOT NULL AND collected_amt >= suggested_val) THEN
    RETURN 'esgotado';
  ELSE
    RETURN 'parcialmente_comprado';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE SECURITY DEFINER
SET search_path = public;

-- Corrigir função is_couple_owner
CREATE OR REPLACE FUNCTION public.is_couple_owner(couple_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.couples 
    WHERE id = couple_uuid AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

-- Corrigir função update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Corrigir função generate_unique_slug
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;