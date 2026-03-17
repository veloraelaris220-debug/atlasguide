import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Index from '@/pages/Index';
import Explore from '@/pages/Explore';
import Wishlists from '@/pages/Wishlists';
import Chat from '@/pages/Chat';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import { PageTransition } from './PageTransition';
import { ProtectedRoute } from './ProtectedRoute';

export function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/explore"
          element={
            <PageTransition>
              <Explore />
            </PageTransition>
          }
        />
        <Route
          path="/wishlists"
          element={
            <PageTransition>
              <Wishlists />
            </PageTransition>
          }
        />
        <Route
          path="/auth"
          element={
            <PageTransition>
              <Auth />
            </PageTransition>
          }
        />
        <Route
          path="/chat"
          element={
            <PageTransition>
              <Chat />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
