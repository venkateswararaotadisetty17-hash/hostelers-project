import { Clock } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const ClosedOverlay = () => {
  const { isOpen, openTime, closeTime } = useStore();

  if (isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6 text-center">
      <Clock className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-2xl font-bold text-foreground mb-2">We're Currently Closed</h1>
      <p className="text-muted-foreground">
        Our operating hours are <span className="font-semibold text-foreground">{openTime}</span> to{" "}
        <span className="font-semibold text-foreground">{closeTime}</span>.
      </p>
      <p className="text-muted-foreground mt-2">Please come back during our operating hours!</p>
    </div>
  );
};

export default ClosedOverlay;
