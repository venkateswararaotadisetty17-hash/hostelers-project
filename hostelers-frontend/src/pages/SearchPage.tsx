import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { Input } from "../components/ui/input";

const SearchPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { products } = useProducts();

  const filtered = query.length >= 2
    ? products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="sticky top-0 bg-card border-b border z-40 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for food, groceries..."
            className="pl-9"
            autoFocus
          />
        </div>
      </div>

      {query.length < 2 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Search className="h-12 w-12 mb-3" />
          <p>Type to search items</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p>No results for "{query}"</p>
        </div>
      ) : (
        <div className="p-4 grid grid-cols-2 gap-3">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
