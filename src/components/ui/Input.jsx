export default function Input({ value, onChange, placeholder, className = "" }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-xl bg-[#1b1b2f] text-white border border-[#2a2a4a] outline-none ${className}`}
    />
  );
}
