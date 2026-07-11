"use client";

import { useState, useEffect } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
  };

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/20 shadow-lg relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-primary/10 blur-2xl"></div>

        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          <div className="bg-white p-4 rounded-2xl shadow-md text-primary shrink-0">
            <Smartphone className="w-10 h-10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              حمل تطبيق الدكان ماركت
            </h3>
            <p className="text-muted-foreground text-sm md:text-base font-medium max-w-md">
              احصل على تجربة تسوق أسرع وأسهل مباشرة من شاشة هاتفك الرئيسية. بدون
              الحاجة لمتجر التطبيقات!
            </p>
          </div>
        </div>

        <Button
          onClick={handleInstallClick}
          size="lg"
          className="z-10 w-full md:w-auto rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-1 transition-all h-14 px-8 text-lg font-bold gap-3"
        >
          <Download className="w-5 h-5 animate-bounce" />
          تثبيت التطبيق الآن
        </Button>
      </div>
    </div>
  );
}
