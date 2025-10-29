import { useEffect, useState } from "react";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { getResources, postEvent } from "../services/api.js";
import { scoreResource } from "../utils/scoreResource.js";

export default function Navigator({ buildLink, onSaveChain }) {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [chain, setChain] = useState([]);
  const [alts, setAlts] = useState([]);

  useEffect(()=>{ getResources().then(setItems); },[]);

  const buildChainFromGoal = async () => {
    if (!goal.trim()) return;
    setLoading(true);

    const ranked = [...items].map(it => ({ ...it, _score: scoreResource(it, goal) }))
      .sort((a,b)=>b._score-a._score).filter(r=>r._score>0);

    const words = goal.trim().split(/\s+/).length;
    const targetLen = Math.max(2, Math.min(5, Math.ceil(words/3)));

    const text = (r) => `${r.title||""} ${r.desc||""}`;
    const pick = {
      research: (pool, exclude=[]) => pool.find(r=>/новост|дайджест|подбор|обзор|референ/i.test(text(r)) && !exclude.includes(r.id)),
      tool:      (pool, exclude=[]) => pool.find(r=>/бот|tool|генера|созда|editor|studio|notion|art|logo|chat/i.test(text(r)) && !exclude.includes(r.id)),
      spread:    (pool, exclude=[]) => pool.find(r=>/маркетинг|smm|комьюнити|канал|сообщество|community|growth|распростран/i.test(text(r)) && !exclude.includes(r.id)),
      support:   (pool, exclude=[]) => pool.find(r=>/faq|вопрос|поддерж|help|чат/i.test(text(r)) && !exclude.includes(r.id)),
      final:     (pool, exclude=[]) => pool.find(r=>/чеклист|гайд|итог|результ/i.test(text(r)) && !exclude.includes(r.id)),
    };

    const take = [];
    const ex = new Set();
    const tryAdd = (fn) => { const x = fn(ranked, Array.from(ex)); if (x) { take.push(x); ex.add(x.id); } };
    tryAdd(pick.research); tryAdd(pick.tool);
    if (targetLen >= 3) tryAdd(pick.spread);
    if (targetLen >= 4) tryAdd(pick.support);
    if (targetLen >= 5) tryAdd(pick.final);

    for (const r of ranked) { if (take.length >= targetLen) break; if (!ex.has(r.id)) { take.push(r); ex.add(r.id); } }

    const built = take.map((r, idx) => ({ idx: idx+1, role: ["Исследование","Инструмент","Сервисы распространения","Поддержка","Итог"][idx] || `Шаг ${idx+1}`, item: r }));
    const alternatives = ranked.filter(r => !ex.has(r.id)).slice(0,12);

    setChain(built); setAlts(alternatives);
    postEvent({ action:"navigator_goal", item_id:"", context:`q:${goal}` });
    setLoading(false);
  };

  const replaceStep = (stepIdx, item) => setChain(prev => prev.map(s => s.idx===stepIdx ? { ...s, item } : s));
  const saveChain = () => {
    const payload = {
      action: "save_chain",
      item_id: chain.map(s=>s.item?.id).filter(Boolean).join(">"),
      context: JSON.stringify({ q: goal, steps: chain.map(s=>({ role:s.role, id:s.item?.id })) }),
    };
    postEvent(payload);
    const saved = { id: `ch_${Date.now()}`, title: goal, steps: chain };
    onSaveChain?.(saved);
    alert("Цепочка сохранена.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">🧭 AI Mimi <span className="text-xs opacity-70 align-middle">beta</span></h1>
      <p className="text-gray-300 mb-3">Опиши цель — я подберу ресурсы и соберу цепочку (2–5 шагов).</p>

      <div className="flex gap-2 mb-3">
        <Input value={goal} onChange={(e)=>setGoal(e.target.value)} placeholder="Например: запустить промо канала о кино и ИИ" />
        <Button onClick={buildChainFromGoal} disabled={loading || !goal.trim()}>{loading ? "Собираю…" : "Собрать"}</Button>
      </div>

      {chain.length>0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">🔗 Цепочка</h2>
          <div className="grid gap-3">
            {chain.map(step => (
              <div key={step.idx} className="p-3 bg-[#1b1b2f] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm opacity-80">Шаг {step.idx} — {step.role}</div>
                  {step.item?.link && (
                    <a href={buildLink(step.item.id || `step${step.idx}`, step.item.link)} target="_blank" rel="noreferrer"><Button size="sm">Открыть</Button></a>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {step.item?.logo && <img src={step.item.logo} className="w-10 h-10 rounded-full border border-white/10" alt="" />}
                  <div>
                    <div className="font-semibold">{step.item?.title || "—"}</div>
                    <div className="text-xs text-gray-400">{step.item?.cat}</div>
                    <div className="text-sm opacity-90 mt-1 line-clamp-2">{step.item?.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="outline" onClick={saveChain}>Сохранить цепочку</Button>
          </div>

          {alts.length>0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">🔁 Альтернативы</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {alts.map(a => (
                  <div key={a.id} className="p-3 bg-[#1b1b2f] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {a.logo && <img src={a.logo} className="w-8 h-8 rounded-full border border-white/10" alt="" />}
                      <div>
                        <div className="text-sm font-semibold">{a.title}</div>
                        <div className="text-xs text-gray-400">{a.cat}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(n => (
                        <Button key={n} size="sm" variant="outline" onClick={()=>replaceStep(n, a)}>{`В шаг ${n}`}</Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {chain.length===0 && (
        <div className="mt-4 text-gray-400 text-sm">
          Примеры целей:
          <span className="ml-2 inline-flex gap-2 flex-wrap">
            {["создать логотип бренда","раскрутить телеграм-канал","найти новости про ИИ","подготовить презентацию"].map(q => (
              <button key={q} className="px-2 py-1 rounded-lg bg-[#1b1b2f] hover:bg-[#24244a]" onClick={()=>setGoal(q)}>{q}</button>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
