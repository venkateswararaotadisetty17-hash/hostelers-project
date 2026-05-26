import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { groceryCategories } from "../data/products";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

const GroceriesPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { products } = useProducts();

  const groceryProducts = products.filter(p => p.type === "grocery");
  const filtered = activeCategory
    ? groceryProducts.filter(p => p.category === activeCategory)
    : groceryProducts;
  const quickItems = groceryProducts.filter(p => ["Milk", "Bread", "Eggs", "Banana"].includes(p.name));

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-2xl">🛒</span>
        <h1 className="text-lg font-bold text-foreground">Groceries</h1>
      </div>

      {/* Quick Delivery */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-warning" />
          <h2 className="font-bold text-foreground">Quick Delivery</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
          {quickItems.map(p => (
            <div key={p.id} className="min-w-[120px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="px-4 pt-2">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
              !activeCategory ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
            }`}
          >
            All
          </button>
          {groceryCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                activeCategory === cat.id ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
              }`}
            >
              <span>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default GroceriesPage;
