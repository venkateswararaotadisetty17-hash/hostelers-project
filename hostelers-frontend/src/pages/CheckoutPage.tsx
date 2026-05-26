import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Locate } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useStore } from "../context/StoreContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { playOrderSound } from "@/hooks/useOrderSound";
import { API_URL } from "../config";
declare global {
  interface window {
    Razorpay: unknown;
  }
}

const CheckoutPage = () => {
  const [payment, setPayment] = useState("upi");
  const [upiId, setUpiId] = useState("");


  // existing code
  const navigate = useNavigate();
  const { items, subtotal, gst, totalDelivery, total, clearCart } = useCart();
  const { addOrder } = useStore();
  const [form, setForm] = useState({ name: "", phone: "", address: "", location: "" });
  const [detectingLocation, setDetectingLocation] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const addr = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setForm(p => ({ ...p, address: addr, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
          toast.success("Location detected!");
        } catch {
          setForm(p => ({ ...p, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
          toast.success("GPS coordinates captured");
        }
        setDetectingLocation(false);
      },
      () => {
        toast.error("Could not get your location");
        setDetectingLocation(false);
      }
    );
  };
  
  const handleRazorpay = async() => {
  // validation
  if (!form.name || !form.phone || !form.address) {
    toast.error("Please fill all required fields");
    return;
  }
  // order create
const order = {
  id: "ORD-" + Date.now(),
  customerName: form.name,
  phone: form.phone,
  address: form.address,
  location: form.location,
  upiId: upiId,

  items: items.map(i => ({
    name: i.name,
    quantity: i.quantity,
    price: i.price
  })),

  subtotal,
  gst,
  delivery: totalDelivery,
  total,
  status: "placed",
  timestamp: Date.now(),
};

try {
  // create razorpay order from backend
  const res = await fetch(`${API_URL}/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(total * 100)
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create order on backend");
  }

  const data = await res.json();
  console.log("SUCCESS:", data);

// razorpay options
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SiTQSfwJUiF3S7",
  amount: data.amount,
  currency: data.currency,
  order_id: data.id,
  name: "Hostelers",

  handler: async function (response: any) {

    addOrder(order);

    const itemsText = items.map(i => `${i.name} (x${i.quantity})`).join(", ");
    const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);

    try {
      // Verify Payment
      const verifyRes = await fetch(`${API_URL}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        toast.error("Payment verification failed!");
        return;
      }

      // Save Order to Database (Backend will automatically trigger WhatsApp notification)
      await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.id,
          user_id: 1, // Optional: add user ID logic here
          customer_name: form.name,
          phone: form.phone,
          address: form.address,
          item_name: itemsText,
          quantity: totalQuantity,
          total_amount: total,
          status: "Paid",
          items: order.items // Send full items array for the WhatsApp message
        })
      });

      clearCart();
      toast.success("Payment success and order saved!");
    } catch (err: any) {
      console.error("Failed to complete order workflow", err);
      toast.error("Order processed with some errors: " + err.message);
    }
  }
};

  // Dynamically load Razorpay if missing
  if (!(window as any).Razorpay) {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error.description || "Payment failed");
      });
      rzp.open();
    };
    document.body.appendChild(script);
  } else {
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      toast.error(response.error.description || "Payment failed");
    });
    rzp.open();
  }
} catch (error: any) {
  console.error("Error initiating payment:", error);
  toast.error(error.message || "Failed to initiate payment. Please try again.");
}
};

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">Checkout</h1>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-card rounded-xl p-4 border border-border space-y-3">
          <h3 className="font-bold text-foreground">Delivery Details</h3>
          <div>
            <Label className="text-muted-foreground text-xs">Name *</Label>
            <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Phone *</Label>
            <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone number" type="tel" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Address *</Label>
            <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Delivery address" />
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">GPS Location</Label>
            <div className="flex gap-2">
              <Input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Near landmark or GPS coords" className="flex-1" />
              <Button type="button" variant="outline" size="sm" onClick={detectLocation} disabled={detectingLocation} className="flex items-center gap-1 shrink-0">
                <Locate className={`h-4 w-4 ${detectingLocation ? "animate-spin" : ""}`} />
                {detectingLocation ? "..." : "Detect"}
              </Button>
            </div>
           
          </div>
        </div>
         <Button onClick={handleRazorpay}>Place Now</Button>

        {/* UPI Payment */}
        <div className="bg-card rounded-xl p-4 border border-border space-y-3">
      
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Payment Method</h3>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg border border-primary bg-primary/5">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">UPI Payment</p>
              <p className="text-xs text-muted-foreground">Pay via any UPI app</p>
            </div>
            <span className="ml-auto text-xs font-semibold text-primary">Selected ✓</span>
          {payment === "upi" && (
  <input
    type="text"
    placeholder="Enter UPI ID"
    value={upiId}
    onChange={(e) => setUpiId(e.target.value)}
    className="w-full mt-3 p-2 border rounded-md"
  />
)}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-4 border border-border space-y-2">
          <h3 className="font-bold text-foreground mb-2">Payment Summary</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Item Total</span>
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
          <div className="border-t border-border pt-2 flex justify-between font-bold text-lg">
            <span className="text-foreground">Total</span>
            <span className="text-primary">₹{total.toFixed(2)}</span>
          </div>
        </div>
       <Button className="w-full h-12 text-base" onClick={handleRazorpay}>
 Pay via UPI - ₹{total.toFixed(2)}
</Button>

<Button className="w-full h-12 text-base mt-3" onClick={handleRazorpay}>
 Test Order Creation
</Button>
      </div>
    </div>
  );
};

export default CheckoutPage;