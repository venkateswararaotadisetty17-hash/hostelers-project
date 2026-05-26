import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Plus, Pencil, Trash2, Save, X, Package, Clock, Power, Bell, TrendingUp, Upload } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { categories, groceryCategories } from "../data/products";
import { useStore, Order } from "../context/StoreContext";
import { useProducts } from "../hooks/useProducts";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";
import { API_URL } from "../config";



const playBellSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    [880, 1108.73, 1318.51].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.6);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.6);
    });
  } catch {}
};

const statusColors: Record<string, string> = {
  placed: "bg-primary/20 text-primary",
  preparing: "bg-accent/20 text-accent-foreground",
  "out-for-delivery": "bg-secondary text-secondary-foreground",
  delivered: "bg-primary/10 text-primary",
  cancelled: "bg-destructive/20 text-destructive",
};

const AdminPage = () => {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, openTime, closeTime, setOpenTime, setCloseTime, setManualOpen, isOpen } = useStore();
  const { products: productList, refetch: refetchProducts } = useProducts();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; price: string }>({ name: "", price: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "fast-food", type: "food" as const, image: "" });
  const [tab, setTab] = useState<"products" | "orders" | "settings" | "earnings">("orders");
  const prevOrderCount = useRef(orders.length);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [editImageId, setEditImageId] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated && orders.length > prevOrderCount.current) {
      playBellSound();
      toast("🔔 New order received!", { duration: 4000 });
    }
    prevOrderCount.current = orders.length;
  }, [orders.length, authenticated]);

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    if (error) { toast.error("Upload failed"); return null; }
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleNewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) setNewProduct(p => ({ ...p, image: url }));
    setUploading(false);
  };

  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editImageId) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (url) {
      await supabase.from("products").update({ image: url }).eq("id", editImageId);
      refetchProducts();
      toast.success("Image updated!");
    }
    setUploading(false);
    setEditImageId(null);
  };

  const getEarningsByDate = () => {
    const earningsMap: Record<string, { total: number; count: number; orders: Order[] }> = {};
    orders.filter(o => o.status !== "cancelled").forEach(o => {
      const date = new Date(o.timestamp).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
      if (!earningsMap[date]) earningsMap[date] = { total: 0, count: 0, orders: [] };
      earningsMap[date].total += o.total;
      earningsMap[date].count += 1;
      earningsMap[date].orders.push(o);
    });
    return earningsMap;
  };

  const todayStr = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
  const earnings = getEarningsByDate();
  const todayEarnings = earnings[todayStr]?.total || 0;
  const todayOrders = earnings[todayStr]?.count || 0;
  const totalEarnings = Object.values(earnings).reduce((s, e) => s + e.total, 0);

  const handleLogin = async () => {

try {

const res = await fetch(`${API_URL}/admin-login`, {
method: "POST",
headers: {
"Content-Type":"application/json"
},
body: JSON.stringify({
password
})
});

const data = await res.json();

if(data.success){
setAuthenticated(true);
toast.success("Welcome Admin");
}
else{
toast.error("Wrong Password");
}

} catch(error){
toast.error("Server Error");
}

};
  const allCategories = [...categories, ...groceryCategories.map(g => ({ ...g, type: "grocery" as const }))];

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-6 border border w-full max-w-sm space-y-4">
          <div className="flex items-center gap-2 justify-center">
            <Lock className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Admin Login</h1>
          </div>
          <p className="text-sm text-muted-foreground text-center">Enter admin password to continue</p>
          <div>
            <Label className="text-muted-foreground text-xs">Password</Label>
           <Input
  type="password"
  name="admin-password"
  autoComplete="new-password"
  spellCheck={false}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter password"
/>
          </div>
          <Button className="w-full" onClick={handleLogin}>Login</Button>
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground w-full text-center">← Back to Home</button>
        </div>
      </div>
    );
  }

  const saveEdit = async (id: string) => {
    await supabase.from("products").update({ name: editForm.name, price: Number(editForm.price) }).eq("id", id);
    refetchProducts();
    setEditingId(null);
    toast.success("Product updated");
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    refetchProducts();
    toast.success("Product deleted");
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) { toast.error("Fill name and price"); return; }
    await supabase.from("products").insert({
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      type: newProduct.type,
      image: newProduct.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop",
      units: ["piece"],
      delivery_charge: 15,
    });
    setNewProduct({ name: "", price: "", category: "fast-food", type: "food", image: "" });
    setShowAdd(false);
    refetchProducts();
    toast.success("Product added");
  };

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: Bell },
    { id: "earnings" as const, label: "Earnings", icon: TrendingUp },
    { id: "products" as const, label: "Products", icon: Package },
    { id: "settings" as const, label: "Timer", icon: Clock },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleNewImageUpload} />
      <input type="file" accept="image/*" ref={editFileInputRef} className="hidden" onChange={handleEditImageUpload} />

      <div className="sticky top-0 bg-card border-b border z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="p-1"><ArrowLeft className="h-5 w-5 text-foreground" /></button>
          <h1 className="text-lg font-bold text-foreground">🔒 Admin</h1>
        </div>
        {tab === "products" && (
          <Button size="sm" variant="outline" onClick={() => setShowAdd(!showAdd)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
        )}
      </div>

      <div className="flex border-b border bg-card">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${tab === t.id ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}>
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === "products" && (
        <>
          {showAdd && (
            <div className="p-4 bg-card border-b border animate-slide-up">
              <h3 className="font-bold text-foreground mb-3">Add New Product</h3>
              <div className="space-y-2">
                <Input placeholder="Product name" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} />
                <Input placeholder="Price (₹)" type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} />
                <div className="flex gap-2 items-center">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4 mr-1" /> {uploading ? "Uploading..." : "Upload Image"}
                  </Button>
                  {newProduct.image && <img src={newProduct.image} alt="preview" className="h-10 w-10 rounded object-cover" />}
                </div>
                <select className="w-full border border rounded-lg px-3 py-2 text-sm bg-background text-foreground" value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
                  {allCategories.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
                <div className="flex gap-2">
                  <Button onClick={addProduct} size="sm">Save</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          )}
          <div className="p-4 space-y-2">
            <p className="text-sm text-muted-foreground mb-2">{productList.length} products</p>
            {productList.map(p => (
              <div key={p.id} className="bg-card rounded-xl p-3 flex items-center gap-3 border border">
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                  <button
                    onClick={() => { setEditImageId(p.id); editFileInputRef.current?.click(); }}
                    className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5"
                  >
                    <Upload className="h-3 w-3" />
                  </button>
                </div>
                {editingId === p.id ? (
                  <div className="flex-1 flex gap-2 items-center">
                    <Input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="text-sm h-8" />
                    <Input value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} type="number" className="w-20 text-sm h-8" />
                    <button onClick={() => saveEdit(p.id)} className="text-accent p-1"><Save className="h-4 w-4" /></button>
                    <button onClick={() => setEditingId(null)} className="text-muted-foreground p-1"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-card-foreground truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.category} · ₹{p.price}</p>
                    </div>
                    <button onClick={() => { setEditingId(p.id); setEditForm({ name: p.name, price: String(p.price) }); }} className="text-primary p-1"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => deleteProduct(p.id)} className="text-destructive p-1"><Trash2 className="h-4 w-4" /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Orders Tab */}
      {tab === "orders" && (
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-foreground">{orders.length} Orders</h3>
            <p className="text-xs text-muted-foreground">Auto-deletes after 24h</p>
          </div>
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No orders yet</p>
            </div>
          )}
          {orders.map((o: Order) => (
            <div key={o.id} className="bg-card rounded-xl p-4 border border space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm text-foreground">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(o.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[o.status]}`}>{o.status}</span>
              </div>
              <div className="text-sm text-foreground space-y-0.5">
                <p>👤 {o.customerName} · 📞 {o.phone}</p>
                <p>📍 {o.address}</p>
                {o.location && <p className="text-xs text-muted-foreground">GPS: {o.location}</p>}
              </div>
              <div className="border-t border pt-2 space-y-1">
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
              {o.status !== "delivered" && o.status !== "cancelled" && (
                <div className="flex gap-2 pt-2">
                  {o.status === "placed" && <Button size="sm" onClick={() => { updateOrderStatus(o.id, "preparing"); toast.success("Status updated"); }}>Start Preparing</Button>}
                  {o.status === "preparing" && <Button size="sm" onClick={() => { updateOrderStatus(o.id, "out-for-delivery"); toast.success("Status updated"); }}>Out for Delivery</Button>}
                  {o.status === "out-for-delivery" && <Button size="sm" onClick={() => { updateOrderStatus(o.id, "delivered"); toast.success("Order delivered!"); }}>Mark Delivered</Button>}
                  <Button size="sm" variant="destructive" onClick={() => { updateOrderStatus(o.id, "cancelled"); toast.success("Order cancelled"); }}>Cancel</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Earnings Tab */}
      {tab === "earnings" && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-xl p-4 border border">
              <p className="text-xs text-muted-foreground">Today's Earnings</p>
              <p className="text-2xl font-bold text-primary">₹{todayEarnings.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">{todayOrders} orders</p>
            </div>
            <div className="bg-card rounded-xl p-4 border border">
              <p className="text-xs text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-foreground">₹{totalEarnings.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">{orders.filter(o => o.status !== "cancelled").length} orders</p>
            </div>
          </div>
          <h3 className="font-bold text-foreground">Day-by-Day Earnings</h3>
          {Object.keys(earnings).length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No earnings yet</p>
            </div>
          ) : (
            Object.entries(earnings).map(([date, data]) => (
              <div key={date} className="bg-card rounded-xl p-4 border border">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-semibold text-sm text-foreground">{date}</p>
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{data.total.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">{data.count} orders</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {data.orders.map(o => (
                    <div key={o.id} className="flex justify-between text-xs text-muted-foreground">
                      <span>{o.id} · {o.customerName}</span>
                      <span>₹{o.total.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="p-4 space-y-4">
          <div className="bg-card rounded-xl p-4 border border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-foreground">Store Status</h3>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isOpen ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-muted-foreground text-xs">Opening Time</Label>
                <Input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Closing Time</Label>
                <Input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" variant={isOpen ? "outline" : "default"} onClick={() => { setManualOpen(true); toast.success("Store opened manually"); }}>
                <Power className="h-4 w-4 mr-1" /> Open Now
              </Button>
              <Button size="sm" className="flex-1" variant={!isOpen ? "outline" : "destructive"} onClick={() => { setManualOpen(false); toast.success("Store closed manually"); }}>
                <Power className="h-4 w-4 mr-1" /> Close Now
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Orders auto-delete after 24 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
