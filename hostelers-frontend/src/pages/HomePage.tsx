import { useNavigate } from "react-router-dom";
import { categories } from "../data/products";
import { MapPin } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-8 pb-12 rounded-b-[2rem]">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="h-4 w-4 text-primary-foreground/70" />
          <span className="text-primary-foreground/70 text-sm">Delivering to</span>
          <span className="text-primary-foreground font-semibold text-sm">Your Location</span>
        </div>
        <h1 className="text-3xl font-bold text-primary-foreground leading-tight">
          What are you<br />craving today?
        </h1>
      </div>

      {/* Categories */}
      <div className="px-4 -mt-6">
        <div className="bg-card rounded-2xl shadow-lg p-4 border border-border">
          <div className="grid grid-cols-4 gap-3">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() =>
                  cat.id === "groceries"
                    ? navigate("/groceries")
                    : navigate(`/category/${cat.id}`)
                }
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-secondary hover:bg-primary/10 transition-colors"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-[11px] font-medium text-secondary-foreground text-center leading-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Popular section */}
      <div className="px-4 mt-6">
        <h2 className="text-xl font-bold text-foreground mb-3">🔥 Popular Right Now</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {["Chicken Biryani", "Pani Puri", "Dosa", "Chocolate Cake"].map((name, i) => (
            <div key={i} className="min-w-[140px] bg-card rounded-xl overflow-hidden shadow-sm border border-border card-hover">
              <div className="h-24 bg-muted flex items-center justify-center text-3xl">
                {["🍛", "🍟", "🥞", "🎂"][i]}
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold text-card-foreground">{name}</p>
                <p className="text-[10px] text-muted-foreground">30 min delivery</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick banner */}
      <div className="px-4 mt-6">
        <div className="bg-accent rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-accent-foreground font-bold text-lg">Groceries in 15 min</p>
            <p className="text-accent-foreground/80 text-sm">Fresh vegetables & daily essentials</p>
            <button
              onClick={() => navigate("/groceries")}
              className="mt-2 bg-card text-accent font-semibold text-sm px-4 py-1.5 rounded-full"
            >
              Order Now
            </button>
          </div>
          <span className="text-5xl">🛒</span>
        </div>
      </div>

      {/* Admin link */}
      <div className="px-4 mt-6 mb-4">
        <button
          onClick={() => navigate("/admin")}
          className="w-full text-center text-xs text-muted-foreground py-2 hover:text-primary transition-colors"
        >
          🔒 Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default HomePage;
