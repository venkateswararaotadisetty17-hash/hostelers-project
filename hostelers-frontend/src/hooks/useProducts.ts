import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/data/products";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: true });
    if (data) {
      setProducts(data.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        image: p.image,
        category: p.category,
        type: p.type as Product["type"],
        units: p.units || ["piece"],
        deliveryCharge: Number(p.delivery_charge),
        familyPackPrice: p.family_pack_price ? Number(p.family_pack_price) : undefined,
      })));
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, refetch: fetchProducts };
};
