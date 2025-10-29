import Button from "../components/ui/Button.jsx";

export default function Settings({ isPremium, onOpenPremium }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">⚙️ Настройки</h1>
      <div className="bg-[#1b1b2f] rounded-xl p-4 mb-4">
        <p className="mb-2">⭐ Premium</p>
        <Button onClick={onOpenPremium}>{isPremium ? "Premium активен" : "Подключить Premium"}</Button>
        <p className="text-gray-400 text-sm mt-2">Отключает рекламу и открывает ранний доступ к функциям.</p>
      </div>
      <div className="bg-[#1b1b2f] rounded-xl p-4">
        <p className="mb-2">🎨 Тема</p>
        <div className="flex gap-2">
          <Button variant="outline">Тёмная</Button>
          <Button variant="outline">Светлая</Button>
        </div>
        <p className="text-gray-400 text-sm mt-3">📜 Политика конфиденциальности — будет ссылкой на отдельную страницу.</p>
      </div>
    </div>
  );
}
