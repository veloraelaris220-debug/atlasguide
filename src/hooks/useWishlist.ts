import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useWishlist() {
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlists = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }
      setUserId(session.user.id);

      const { data, error } = await supabase
        .from('wishlists')
        .select('destination_id')
        .eq('user_id', session.user.id);

      if (!error && data) {
        setWishlistedIds(new Set(data.map((w) => w.destination_id)));
      }
      setLoading(false);
    };

    fetchWishlists();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchWishlists();
      } else {
        setUserId(null);
        setWishlistedIds(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleWishlist = useCallback(async (destinationId: string) => {
    if (!userId) {
      toast.error('Please sign in to save destinations');
      return;
    }

    const isWishlisted = wishlistedIds.has(destinationId);

    // Optimistic update
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (isWishlisted) {
        next.delete(destinationId);
      } else {
        next.add(destinationId);
      }
      return next;
    });

    if (isWishlisted) {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('destination_id', destinationId);

      if (error) {
        // Revert
        setWishlistedIds((prev) => new Set(prev).add(destinationId));
        toast.error('Failed to remove from wishlist');
      } else {
        toast.success('Removed from wishlist');
      }
    } else {
      const { error } = await supabase
        .from('wishlists')
        .insert({ user_id: userId, destination_id: destinationId });

      if (error) {
        // Revert
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(destinationId);
          return next;
        });
        toast.error('Failed to add to wishlist');
      } else {
        toast.success('Added to wishlist ❤️');
      }
    }
  }, [userId, wishlistedIds]);

  const isWishlisted = useCallback((destinationId: string) => {
    return wishlistedIds.has(destinationId);
  }, [wishlistedIds]);

  return { wishlistedIds, isWishlisted, toggleWishlist, loading, isLoggedIn: !!userId };
}
