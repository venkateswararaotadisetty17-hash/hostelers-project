import { Minus, Plus, Users } from "lucide-react";
import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem, items, updateQuantity } = useCart();
  const [selectedUnit, setSelectedUnit] = useState(product.units[0]);
  const [isFamilyPack, setIsFamilyPack] = useState(false);
  const cartItem = items.find(i => i.id === (isFamilyPack ? product.id + "-family" : product.id));
  const qty = cartItem?.quantity || 0;
  const currentPrice = isFamilyPack && product.familyPackPrice ? product.familyPackPrice : product.price;

  const handleAdd = () => {
    const itemId = isFamilyPack ? product.id + "-family" : product.id;
    addItem({
      id: itemId,
      name: isFamilyPack ? `${product.name} (Family Pack)` : product.name,
      price: currentPrice,
      image: product.image,
      category: product.category,
      unit: isFamilyPack ? "family" : selectedUnit,
      deliveryCharge: product.deliveryCharge,
    });
  };

  const itemId = isFamilyPack ? product.id + "-family" : product.id;

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm card-hover border border">
      <div className="aspect-[3/2] overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-card-foreground truncate">{product.name}</h3>
        <p className="text-primary font-bold text-lg mt-1">₹{currentPrice}</p>

        {/* Family pack toggle */}
        {product.familyPackPrice && (
          <button
            onClick={() => setIsFamilyPack(!isFamilyPack)}
            className={`flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              isFamilyPack ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-muted-foreground border-border"
            }`}
          >
            <Users className="h-3 w-3" /> Family Pack
          </button>
        )}

        {!isFamilyPack && product.units.length > 1 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.units.map(unit => (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  selectedUnit === unit
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary"
                }`}
              >
                {unit}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3">
          {qty === 0 ? (
            <Button onClick={handleAdd} size="sm" className="w-full">Add to Cart</Button>
          ) : (
            <div className="flex items-center justify-between bg-primary/10 rounded-lg px-2 py-1">
              <button onClick={() => updateQuantity(itemId, qty - 1)} className="p-1 rounded-full bg-primary text-primary-foreground">
                <Minus className="h-3 w-3" />
              </button>
              <span className="font-semibold text-primary">{qty}</span>
              <button onClick={() => updateQuantity(itemId, qty + 1)} className="p-1 rounded-full bg-primary text-primary-foreground">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
