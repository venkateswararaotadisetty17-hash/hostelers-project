import { ArrowLeft, MapPin, Phone, User, ChevronRight, LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out!");
  };

  const menuItems = [
    { icon: User, label: "Update Profile", desc: "Change name & details" },
    { icon: MapPin, label: "Change Address", desc: "Update delivery address" },
    { icon: Phone, label: "Contact Support", desc: "Get help with orders" },
  ];

  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="bg-primary px-4 pt-8 pb-10 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="h-5 w-5 text-primary-foreground" />
          </button>
          <h1 className="text-lg font-bold text-primary-foreground">Profile</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary-foreground">
              {user ? user.email?.split("@")[0] : "Guest"}
            </h2>
            <p className="text-primary-foreground/70 text-sm">
              {user ? user.email : "Sign in to track your orders"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-3">
        {!user && (
          <Button className="w-full" onClick={() => navigate("/auth")}>
            <LogIn className="h-4 w-4 mr-2" /> Sign In / Sign Up
          </Button>
        )}

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {menuItems.map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors border-b border-border last:border-b-0"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <div className="flex-1 text-left">
                <p className="font-medium text-sm text-card-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        {user && (
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
