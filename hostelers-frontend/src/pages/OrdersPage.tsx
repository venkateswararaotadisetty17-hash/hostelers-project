import { ArrowLeft, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const statusSteps = ["placed", "preparing", "out-for-delivery", "delivered"];
const statusLabels: Record<string, string> = {
  placed: "Order Placed",
  preparing: "Preparing",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useStore();

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No orders yet</h2>
          <p className="text-muted-foreground text-center">Your order history will appear here after you place an order.</p>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {orders.map(o => (
            <div key={o.id} className="bg-card rounded-xl p-4 border border-border space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm text-foreground">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.status === "cancelled" ? "bg-destructive/20 text-destructive" : "bg-primary/20 text-primary"}`}>
                  {statusLabels[o.status]}
                </span>
              </div>

              {/* Progress tracker */}
              {o.status !== "cancelled" && (
                <div className="flex items-center gap-1">
                  {statusSteps.map((step, i) => {
                    const currentIdx = statusSteps.indexOf(o.status);
                    const done = i <= currentIdx;
                    return (
                      <div key={step} className="flex-1 flex flex-col items-center">
                        <div className={`h-2 w-full rounded-full ${done ? "bg-primary" : "bg-muted"}`} />
                        <span className={`text-[9px] mt-1 ${done ? "text-primary font-medium" : "text-muted-foreground"}`}>
                          {statusLabels[step]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-border pt-2 space-y-1">
                {o.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                  <span>Total</span>
                  <span className="text-primary">₹{o.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
