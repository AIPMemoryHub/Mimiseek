import { useEffect, useMemo, useState } from "react";
import { getResources } from "../services/api.js";

export default function GlobalSearch({ onClose, buildLink, chains }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);

  useEffect(()=>{ getResources().then(setItems); },[]);

  const res = useMemo(()=>{
    const query = q.trim().toLowerCase();
    const channels = !query ? [] : items.filter(i =>
      (i.title||"").toLowerCase().includes(query) ||
      (i.desc||"").toLowerCase().includes(query) ||
      (i.cat||"").toLowerCase().includes(query)
    ).slice(0,8);
    const chainsRes = !query ? [] : chains.filter(ch => (ch.title||"").toLowerCase().includes(query)).slice(0,5);
    return { channels, chains: chainsRes };
  }, [q, items, chains]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="w-full max-w-2xl bg-[#121222] rounded-2xl p-4" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <span>🔎</span>
          <input autoFocus value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Глобальный поиск… (каналы, цепочки)" className="flex-1 bg-transparent outline-none text-white" />
          <button onClick={onClose} className="text-gray-400">Esc</button>
        </div>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          <div className="bg-[#1b1b2f] rounded-xl p-3">
            <div className="text-sm opacity-70 mb-2">Каналы</div>
            {res.channels.length===0 ? <div className="text-gray-500 text-sm">Нет результатов</div> : res.channels.map(c => (
              <div key={c.id} className="p-2 rounded-lg hover:bg-[#24244a] flex items-center justify-between">
                <div className="truncate mr-2">
                  <div className="font-semibold text-sm truncate">{c.title}</div>
                  <div className="text-xs opacity-70">{c.cat}</div>
                </div>
                {c.link && <a href={buildLink(c.id, c.link)} target="_blank" className="text-xs underline">Открыть</a>}
              </div>
            ))}
          </div>
          <div className="bg-[#1b1b2f] rounded-xl p-3">
            <div className="text-sm opacity-70 mb-2">Цепочки</div>
            {res.chains.length===0 ? <div className="text-gray-500 text-sm">Нет результатов</div> : res.chains.map(ch => (
              <div key={ch.id} className="p-2 rounded-lg hover:bg-[#24244a]">
                <div className="font-semibold text-sm">{ch.title}</div>
                <div className="text-xs opacity-70">Шагов: {ch.steps?.length||0}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
