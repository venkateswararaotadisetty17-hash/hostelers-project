import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./components/ui/sonner.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { StoreProvider } from "./context/StoreContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import BottomNav from "./components/BottomNav.tsx";
import ClosedOverlay from "./components/ClosedOverlay.tsx";
import OrderAlert from "./components/OrderAlert.tsx";
import HomePage from "./pages/HomePage.tsx";
import CategoryPage from "./pages/CategoryPage.tsx";
import GroceriesPage from "./pages/GroceriesPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import OrdersPage from "./pages/OrdersPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import AuthPage from "./pages/AuthPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="max-w-lg mx-auto relative">
                <ClosedOverlay />
                <OrderAlert />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:id" element={<CategoryPage />} />
                  <Route path="/groceries" element={<GroceriesPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <BottomNav />
              </div>
            </BrowserRouter>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
