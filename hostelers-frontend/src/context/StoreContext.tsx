import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  location: string;
  upiId: string;
  items: { name: string; quantity: number; price: number; image: string }[];
  subtotal: number;
  gst: number;
  delivery: number;
  total: number;
  status: "placed" | "preparing" | "out-for-delivery" | "delivered" | "cancelled";
  timestamp: number;
}

interface StoreContextType {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  setOpenTime: (t: string) => void;
  setCloseTime: (t: string) => void;
  setManualOpen: (v: boolean | null) => void;
  refreshOrders: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [openTime, setOpenTimeState] = useState("08:00");
  const [closeTime, setCloseTimeState] = useState("23:00");
  const [manualOpen, setManualOpenState] = useState<boolean | null>(null);

  const fetchOrders = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) {
      setOrders(data.map((o: any) => ({
        id: o.order_id,
        customerName: o.customer_name,
        phone: o.phone,
        address: o.address,
        location: o.location || "",
        upiId: o.upi_id || "UPI Payment",
        items: o.items as any,
        subtotal: Number(o.subtotal),
        gst: Number(o.gst),
        delivery: Number(o.delivery),
        total: Number(o.total),
        status: o.status as Order["status"],
        timestamp: new Date(o.created_at).getTime(),
      })));
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from("store_settings").select("*").limit(1).single();
    if (data) {
      setOpenTimeState(data.open_time);
      setCloseTimeState(data.close_time);
      if (data.manual_open !== null) setManualOpenState(data.manual_open);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchSettings();

    // Subscribe to realtime orders
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders, fetchSettings]);

  const isOpen = (() => {
    if (manualOpen !== null) return manualOpen;
    const now = new Date();
    const curr = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = openTime.split(":").map(Number);
    const [ch, cm] = closeTime.split(":").map(Number);
    return curr >= oh * 60 + om && curr <= ch * 60 + cm;
  })();

  const addOrder = useCallback(async (order: Order) => {
    await supabase.from("orders").insert({
      order_id: order.id,
      customer_name: order.customerName,
      phone: order.phone,
      address: order.address,
      location: order.location,
      upi_id: order.upiId,
      items: order.items as any,
      subtotal: order.subtotal,
      gst: order.gst,
      delivery: order.delivery,
      total: order.total,
      status: order.status,
    });
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    await supabase.from("orders").update({ status }).eq("order_id", orderId);
  }, []);

  const setOpenTime = useCallback(async (t: string) => {
    setOpenTimeState(t);
    setManualOpenState(null);
    await supabase.from("store_settings").update({ open_time: t, manual_open: null }).not("id", "is", null);
  }, []);

  const setCloseTime = useCallback(async (t: string) => {
    setCloseTimeState(t);
    setManualOpenState(null);
    await supabase.from("store_settings").update({ close_time: t, manual_open: null }).not("id", "is", null);
  }, []);

  const setManualOpen = useCallback(async (v: boolean | null) => {
    setManualOpenState(v);
    await supabase.from("store_settings").update({ manual_open: v }).not("id", "is", null);
  }, []);

  return (
    <StoreContext.Provider value={{ orders, addOrder, updateOrderStatus, isOpen, openTime, closeTime, setOpenTime, setCloseTime, setManualOpen, refreshOrders: fetchOrders }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};
