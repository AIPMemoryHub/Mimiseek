export default function Sidebar({ tab, setTab, onOpenSearch }) {
  const items = [
    { id: "home", icon: "🏠", label: "Mimi дом" },
    { id: "categories", icon: "📚", label: "Mimi поиск" },
    { id: "navigator", icon: "🧭", label: "AI Mimi (beta)" },
    { id: "favorites", icon: "❤️", label: "Твой Mimi" },
    { id: "settings", icon: "⚙️", label: "Настройки" },
  ];
  return (
    <aside className="w-20 bg-[#080613] border-r border-white/10 flex flex-col items-center py-6 space-y-6">
      <button onClick={onOpenSearch} title="Глобальный поиск (Ctrl/⌘+K)" className="text-xl opacity-70 hover:opacity-100">🔎</button>
      {items.map((it) => (
        <div key={it.id} className="flex flex-col items-center text-xs">
          <button
            onClick={() => setTab(it.id)}
            className={`text-2xl mb-1 transition-transform ${tab === it.id ? "scale-125 text-[#5b6cff]" : "opacity-60 hover:opacity-100"}`}
          >
            {it.icon}
          </button>
          <span className="text-[10px] opacity-70 text-center px-1">{it.label}</span>
        </div>
      ))}
    </aside>
  );
}
