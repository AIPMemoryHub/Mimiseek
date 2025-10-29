import { useEffect, useMemo, useState } from "react";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/Card.jsx";
import { getResources, postEvent } from "../services/api.js";

export default function Home({ isPremium, showAds, openPremiumModal, buildLink, toggleFavorite, favorites }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getResources().then(d => { if (mounted) setItems(d); }).finally(()=>setLoading(false));
    return () => { mounted = false; };
  }, []);

  const hasHistory = false;

  const sponsors = [
    { id:"s_ai_today", title:"AI Today", img:"https://cdn-icons-png.flaticon.com/512/4712/4712100.png", link:"https://t.me/aitoday_ru", partner:true },
    { id:"s_hamster", title:"Hamster Kombat", img:"https://upload.wikimedia.org/wikipedia/en/7/7c/Hamster_Kombat_logo.png", link:"https://t.me/hamster_kombat", partner:true }
  ];

  const trends = useMemo(() => [...items].sort((a,b) => (b.views||0)-(a.views||0)).slice(0,12), [items]);

  const personalizedGroups = useMemo(() => {
    if (!hasHistory) {
      const cats = Array.from(new Set(items.map(i => i.cat).filter(Boolean))).slice(0,3);
      return cats.map(cat => ({ title: `Популярно в «${cat}»`, list: items.filter(i => i.cat === cat).slice(0,8) }));
    }
    return [];
  }, [items, hasHistory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0,24);
    return items.filter(i => (i.title||"").toLowerCase().includes(q) || (i.desc||"").toLowerCase().includes(q) || (i.cat||"").toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Поиск по названию/описанию/категории" />
        <Button variant="outline" onClick={openPremiumModal}>{isPremium ? "Premium активен" : "Отключить рекламу"}</Button>
      </div>

      {showAds && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {sponsors.map(s => (
            <AdPoster key={s.id} item={s} buildLink={(deeplink)=>buildLink(s.id, deeplink)} />
          ))}
        </div>
      )}

      <Section title="🔥 Тренды недели">
        <CardGrid items={trends} buildLink={buildLink} favorites={favorites} toggleFavorite={toggleFavorite} adEvery={5} showAds={showAds} />
      </Section>

      {personalizedGroups.map((g, idx) => (
        <Section key={idx} title={g.title}>
          <CardGrid items={g.list} buildLink={buildLink} favorites={favorites} toggleFavorite={toggleFavorite} adEvery={6} showAds={showAds} />
        </Section>
      ))}

      {filtered.length>0 && (
        <Section title="Для вас">
          <CardGrid items={filtered} buildLink={buildLink} favorites={favorites} toggleFavorite={toggleFavorite} adEvery={8} showAds={showAds} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="mt-6">
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function CardGrid({ items, buildLink, favorites, toggleFavorite, adEvery = 0, showAds = false }) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {items.map((i, idx) => (
        <Card key={i.id || idx} item={i} buildLink={buildLink} isFav={favorites.has(i.id)} onToggleFav={() => toggleFavorite(i.id)} showAdBadge={showAds && adEvery>0 && idx % adEvery === 0} />
      ))}
    </div>
  );
}

function AdPoster({ item, buildLink }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#1b1b2f]">
      <img src={item.img} alt={item.title} className="w-full h-40 object-contain bg-[#0d0d1f]" />
      <div className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30">Спонсор</div>
      <div className="p-3 flex items-center justify-between">
        <div className="font-semibold">{item.title}</div>
        <a href={buildLink(item.link)}><Button size="sm">Перейти</Button></a>
      </div>
    </div>
  );
}
