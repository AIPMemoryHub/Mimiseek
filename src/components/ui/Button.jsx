export default function Button({ children, onClick, variant = "solid", size = "md", className = "", disabled }) {
  const styles = {
    solid: "bg-[#5b6cff] text-white border border-[#5b6cff]",
    outline: "bg-transparent text-[#c9cdfa] border border-[#2a2a4a]",
    ghost: "bg-transparent text-[#c9cdfa] border border-transparent",
  }[variant];
  const sizes = { sm: "px-2 py-1 text-sm", md: "px-3 py-2", lg: "px-4 py-3 text-lg" }[size];
  return (
    <button disabled={disabled} onClick={onClick} className={`rounded-xl font-semibold ${styles} ${sizes} ${disabled ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"} ${className}`}>
      {children}
    </button>
  );
}
