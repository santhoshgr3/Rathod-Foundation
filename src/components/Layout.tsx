import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import Footer from "./Footer";
import EmergencyButton from "./EmergencyButton";
import MobileBottomNav from "./MobileBottomNav";
import WhatsAppFAB from "./WhatsAppFAB";
import { ScrollProgress } from "./ui";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <Nav />
      <main className="min-h-screen pb-20 lg:pb-0">
        <Outlet />
      </main>
      <EmergencyButton />
      <WhatsAppFAB />
      <Footer />
      <MobileBottomNav />
    </>
  );
}
