import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { categories } from "../data/products";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.category === id);

  if (!category) return <div className="p-4">Category not found</div>;

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 bg-card border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <span className="text-2xl">{category.emoji}</span>
        <h1 className="text-lg font-bold text-foreground">{category.name}</h1>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {categoryProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {categoryProducts.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-4xl mb-2">📦</p>
          <p>No items available yet</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
