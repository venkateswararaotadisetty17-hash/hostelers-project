import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../config";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Phone, ArrowLeft, KeyRound } from "lucide-react";

type AuthState = "login" | "signup" | "forgot_password" | "verify_otp" | "reset_password";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  
  const [authState, setAuthState] = useState<AuthState>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (authState === "login") {
        if (!email || !password) return toast.error("Please fill all fields");
        const { error } = await signIn(email, password);
        if (error) throw new Error(error.message);
        toast.success("Welcome back!");
        localStorage.setItem("customer_name", email);
        navigate("/");
      } else if (authState === "signup") {
        if (!email || !password || !phone) return toast.error("Please fill all fields");
        const { error } = await signUp(email, password, phone);
        if (error) throw new Error(error.message);
        toast.success("Account created! Please log in.");
        setAuthState("login");
      } else if (authState === "forgot_password") {
        if (!phone) return toast.error("Please enter your phone number");
        const res = await fetch(`${API_URL}/forgot-password`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success("OTP sent to your phone!");
        setAuthState("verify_otp");
      } else if (authState === "verify_otp") {
        if (!otp) return toast.error("Please enter the OTP");
        const res = await fetch(`${API_URL}/verify-otp`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, otp })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success("OTP Verified! Please enter a new password.");
        setAuthState("reset_password");
      } else if (authState === "reset_password") {
        if (!newPassword) return toast.error("Please enter a new password");
        const res = await fetch(`${API_URL}/reset-password`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        toast.success("Password reset successful! Please log in.");
        setAuthState("login");
        setPassword("");
        setNewPassword("");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="bg-card rounded-2xl p-6 border border-border w-full max-w-sm space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">🍔 Hostelers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {authState === "login" && "Sign in to your account"}
            {authState === "signup" && "Create a new account"}
            {authState === "forgot_password" && "Reset your password"}
            {authState === "verify_otp" && "Verify OTP"}
            {authState === "reset_password" && "Enter new password"}
          </p>
        </div>

        <div className="space-y-3">
          {(authState === "login" || authState === "signup") && (
            <div>
              <Label className="text-muted-foreground text-xs">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
              </div>
            </div>
          )}

          {authState === "signup" && (
            <div>
              <Label className="text-muted-foreground text-xs">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className="pl-10" />
              </div>
            </div>
          )}

          {(authState === "login" || authState === "signup") && (
            <div>
              <Label className="text-muted-foreground text-xs">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
            </div>
          )}

          {authState === "forgot_password" && (
            <div>
              <Label className="text-muted-foreground text-xs">Registered Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" className="pl-10" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
            </div>
          )}

          {authState === "verify_otp" && (
            <div>
              <Label className="text-muted-foreground text-xs">Enter 6-digit OTP</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="pl-10 tracking-widest text-center" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
            </div>
          )}

          {authState === "reset_password" && (
            <div>
              <Label className="text-muted-foreground text-xs">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" className="pl-10" onKeyDown={e => e.key === "Enter" && handleSubmit()} />
              </div>
            </div>
          )}
        </div>

        {authState === "login" && (
          <div className="flex justify-end">
            <button onClick={() => setAuthState("forgot_password")} className="text-xs text-primary hover:underline">
              Forgot Password?
            </button>
          </div>
        )}

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          {loading ? "Please wait..." : 
            authState === "login" ? "Sign In" : 
            authState === "signup" ? "Sign Up" : 
            authState === "forgot_password" ? "Send OTP" : 
            authState === "verify_otp" ? "Verify OTP" : "Reset Password"}
        </Button>

        {authState === "login" && (
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button onClick={() => setAuthState("signup")} className="text-primary font-medium">Sign Up</button>
          </p>
        )}
        
        {authState === "signup" && (
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => setAuthState("login")} className="text-primary font-medium">Sign In</button>
          </p>
        )}

        {(authState === "forgot_password" || authState === "verify_otp" || authState === "reset_password") && (
          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <button onClick={() => setAuthState("login")} className="text-primary font-medium">Sign In</button>
          </p>
        )}

        <button onClick={() => navigate("/")} className="text-sm text-muted-foreground w-full text-center flex items-center justify-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
