export default function Favorites({ favorites, chains }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">❤️ Твой Mimi</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold mb-2">⭐ Избранные каналы</h2>
          {favorites.size === 0 ? (
            <div className="p-4 bg-[#1b1b2f] rounded-xl text-gray-400">Пока пусто</div>
          ) : (
            <div className="p-3 bg-[#1b1b2f] rounded-xl text-gray-300">{Array.from(favorites).join(", ")}</div>
          )}
        </div>
        <div>
          <h2 className="font-semibold mb-2">🔗 Сохранённые цепочки</h2>
          {chains.length === 0 ? (
            <div className="p-4 bg-[#1b1b2f] rounded-xl text-gray-400">Пока пусто</div>
          ) : (
            <ul className="space-y-2">
              {chains.map(ch => (
                <li key={ch.id} className="p-3 bg-[#1b1b2f] rounded-xl">
                  <div className="font-semibold">{ch.title}</div>
                  <div className="text-xs text-gray-400">Шагов: {ch.steps?.length || 0}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
