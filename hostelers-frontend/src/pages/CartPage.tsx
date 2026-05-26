import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Minus, Plus } from "lucide-react";

const CartPage = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalDelivery, gst, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-20 bg-background flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6 text-center">Add some delicious items to get started!</p>
        <Button onClick={() => navigate("/")}>Browse Items</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-bold text-foreground">Your Cart</h1>
        </div>
        <button onClick={clearCart} className="text-destructive text-sm font-medium">Clear</button>
      </div>

      <div className="p-4 space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-card rounded-xl p-3 flex gap-3 border border-border">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-card-foreground truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground">{item.unit}</p>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-destructive p-1">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                <div className="flex items-center gap-2 bg-primary/10 rounded-lg px-2 py-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-0.5 rounded-full bg-primary text-primary-foreground">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-semibold text-primary w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-0.5 rounded-full bg-primary text-primary-foreground">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price summary */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-xl p-4 border border-border space-y-2">
          <h3 className="font-bold text-foreground mb-3">Order Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST (5%)</span>
            <span className="text-foreground">₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Charges</span>
            <span className="text-foreground">₹{totalDelivery.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-bold">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <Button className="w-full h-12 text-base" onClick={() => navigate("/checkout")}>
          Proceed to Checkout — ₹{total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
