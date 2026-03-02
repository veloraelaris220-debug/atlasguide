
-- Drop and recreate policies with explicit TO authenticated
DROP POLICY IF EXISTS "Users can view their own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Users can add to their own wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Users can remove from their own wishlists" ON public.wishlists;

CREATE POLICY "Users can view their own wishlists"
ON public.wishlists FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlists"
ON public.wishlists FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlists"
ON public.wishlists FOR DELETE TO authenticated
USING (auth.uid() = user_id);
