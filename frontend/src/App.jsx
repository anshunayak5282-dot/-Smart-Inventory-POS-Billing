import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <MainLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}
