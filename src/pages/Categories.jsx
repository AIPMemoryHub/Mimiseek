import { useEffect, useMemo, useState } from "react";
import { getResources } from "../services/api.js";
import Card from "../components/Card.jsx";

export default function Categories({ buildLink, showAds, toggleFavorite, favorites }) {
  const [items, setItems] = useState([]);
  const [activeCat, setActiveCat] = useState("");

  useEffect(()=>{ getResources().then(setItems); },[]);
  const cats = useMemo(()=> Array.from(new Set(items.map(i=>i.cat).filter(Boolean))), [items]);
  const list = useMemo(()=> items.filter(i => !activeCat || i.cat === activeCat).slice(0,48), [items, activeCat]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📚 Mimi поиск</h1>
      <div className="flex gap-2 flex-wrap mb-4">
        <button onClick={()=>setActiveCat("")} className={`px-3 py-1 rounded-lg ${!activeCat ? "bg-[#5b6cff]" : "bg-[#1b1b2f]"} border border-white/10`}>Все</button>
        {cats.map(c => (
          <button key={c} onClick={()=>setActiveCat(c)} className={`px-3 py-1 rounded-lg ${activeCat===c ? "bg-[#5b6cff]" : "bg-[#1b1b2f]"} border border-white/10`}>{c}</button>
        ))}
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {list.map((i, idx)=>(
          <Card key={i.id || idx} item={i} buildLink={buildLink} isFav={favorites.has(i.id)} onToggleFav={()=>toggleFavorite(i.id)} showAdBadge={showAds && idx % 6 === 0} />
        ))}
      </div>
    </div>
  );
}
