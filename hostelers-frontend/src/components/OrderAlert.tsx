import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_URL } from "../config";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

const OrderAlert = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // 1. Initialize Audio
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audio.loop = true;
    audioRef.current = audio;

    // 2. Initialize Socket
    socketRef.current = io(API_URL);

    socketRef.current.on("new-order", (order: any) => {
      console.log("New order received via socket:", order);
      setIsPlaying(true);
      toast.success(`New Order Received! 🍔 Order ID: ${order.id || order.order_id}`, {
        duration: Infinity, // Keep toast until manual dismissal if needed
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.warn("Autoplay blocked. User must interact with the page first.", err);
      });
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isPlaying]);

  const stopSound = () => {
    setIsPlaying(false);
  };

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[9999] animate-bounce">
      <button
        onClick={stopSound}
        className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-red-700 transition-all font-bold border-4 border-white"
      >
        <BellOff className="h-6 w-6 animate-pulse" />
        STOP BELL
      </button>
    </div>
  );
};

export default OrderAlert;
