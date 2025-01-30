-- Adiciona a coluna listing_url à tabela visit_reviews
ALTER TABLE visit_reviews
ADD COLUMN listing_url TEXT;

-- Remove as políticas existentes
DROP POLICY IF EXISTS "Usuários podem criar suas próprias reviews" ON visit_reviews;
DROP POLICY IF EXISTS "Reviews são visíveis para todos" ON visit_reviews;
DROP POLICY IF EXISTS "Usuários podem atualizar suas próprias reviews" ON visit_reviews;

-- Recria as políticas
CREATE POLICY "Usuários podem criar suas próprias reviews" 
ON visit_reviews FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Reviews são visíveis para todos" 
ON visit_reviews FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Usuários podem atualizar suas próprias reviews" 
ON visit_reviews FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id); 