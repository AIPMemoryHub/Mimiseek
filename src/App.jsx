import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Button from "./components/ui/Button.jsx";
import GlobalSearch from "./components/GlobalSearch.jsx";
import PremiumModal from "./components/PremiumModal.jsx";

import Home from "./pages/Home.jsx";
import Categories from "./pages/Categories.jsx";
import Navigator from "./pages/Navigator.jsx";
import Favorites from "./pages/Favorites.jsx";
import Settings from "./pages/Settings.jsx";
import { postEvent } from "./services/api.js";

export default function App() {
  const [tab, setTab] = useState("home");
  const [isPremium, setIsPremium] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [openPremium, setOpenPremium] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [favorites, setFavorites] = useState(() => new Set());
  const [chains, setChains] = useState([]);

  const uid = "u_demo_123";
  const buildLink = (resourceId, deeplink) => `/go/${resourceId}?ref=${encodeURIComponent(uid)}&to=${encodeURIComponent(deeplink)}`;

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setGlobalSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      postEvent({ action: next.has(id) ? "favorite_add" : "favorite_remove", item_id: id, context: "" });
      return next;
    });
  };

  const openPremiumModal = () => setOpenPremium(true);
  const closePremiumModal = () => setOpenPremium(false);
  const pickPlan = (plan) => {
    setIsPremium(true);
    setShowAds(false);
    postEvent({ action: `premium_purchase_${plan}`, item_id: "", context: "" });
    setOpenPremium(false);
  };

  return (
    <div className="min-h-screen flex text-white" style={{ background: "#0d0b1a" }}>
      <Sidebar tab={tab} setTab={setTab} onOpenSearch={() => setGlobalSearchOpen(true)} />

      <main className="flex-1 p-6 overflow-y-auto">
        {tab === "home" && (
          <Home
            isPremium={isPremium}
            showAds={showAds && !isPremium}
            openPremiumModal={openPremiumModal}
            buildLink={buildLink}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        )}
        {tab === "categories" && (
          <Categories
            buildLink={buildLink}
            showAds={showAds && !isPremium}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
          />
        )}
        {tab === "navigator" && (
          <Navigator
            buildLink={buildLink}
            onSaveChain={(saved) => setChains((prev) => [saved, ...prev].slice(0, 50))}
          />
        )}
        {tab === "favorites" && (
          <Favorites favorites={favorites} chains={chains} />
        )}
        {tab === "settings" && (
          <Settings isPremium={isPremium} onOpenPremium={openPremiumModal} />
        )}
      </main>

      {openPremium && <PremiumModal onClose={closePremiumModal} onPick={pickPlan} />}
      {globalSearchOpen && <GlobalSearch onClose={() => setGlobalSearchOpen(false)} buildLink={buildLink} chains={chains} />}
    </div>
  );
}
