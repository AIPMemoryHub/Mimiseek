import Button from "./ui/Button.jsx";

export default function Card({ item, buildLink, isFav, onToggleFav, showAdBadge }) {
  const logo = item.logo || (item.link ? `https://unavatar.io/${item.link}` : item.img || "");
  return (
    <div className="relative bg-[#1b1b2f] rounded-xl p-3 shadow hover:bg-[#24244a] transition">
      {showAdBadge && (
        <span className="absolute top-2 left-2 text-[10px] px-2 py-1 bg-amber-400/20 text-amber-300 rounded">🎯 Реклама</span>
      )}
      <div className="flex items-start gap-3">
        {logo && <img src={logo} alt={item.title} className="w-12 h-12 rounded-full object-cover border border-white/10" />}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-base mr-3 truncate" title={item.title}>{item.title}</div>
            <button onClick={onToggleFav} className={`text-lg ${isFav ? "text-yellow-300" : "text-gray-400"} hover:scale-110`}>⭐</button>
          </div>
          <div className="text-xs text-gray-400">{item.cat}</div>
          <p className="text-sm opacity-80 mt-1 line-clamp-2">{item.desc}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">👁 {item.views || 0}</span>
            {item.link && (
              <a href={buildLink(item.id, item.link)} target="_blank" className="text-sm underline text-[#9aa0ff]">Перейти</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
