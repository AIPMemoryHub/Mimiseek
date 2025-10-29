export default function PremiumModal({ onClose, onPick }) {
  const plans = [
    { id: "day", label: "День", price: "29 ₽" },
    { id: "week", label: "Неделя", price: "99 ₽" },
    { id: "month", label: "Месяц", price: "249 ₽" },
    { id: "year", label: "Год", price: "1990 ₽" },
  ];
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[#1b1b2f] rounded-2xl p-6 w-full max-w-md" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Отключить рекламу</h3>
          <button onClick={onClose} className="text-gray-400">✖</button>
        </div>
        <p className="text-gray-300 text-sm mb-4">Выберите план подписки — реклама исчезнет во всех разделах.</p>
        <div className="grid grid-cols-2 gap-3">
          {plans.map(p => (
            <button key={p.id} onClick={()=>onPick(p.id)} className="p-3 rounded-xl bg-[#24244a] hover:bg-[#2c2c5a] text-left">
              <div className="font-semibold">{p.label}</div>
              <div className="text-sm opacity-80">{p.price}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Оплата заглушка. На бою подключим Telegram Stars/CloudPay/ЮKassa.</p>
      </div>
    </div>
  );
}
