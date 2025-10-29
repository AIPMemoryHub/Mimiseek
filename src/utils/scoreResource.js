export function scoreResource(it, q) {
  const t = (it.title || "").toLowerCase();
  const d = (it.desc || "").toLowerCase();
  const c = (it.cat || "").toLowerCase();
  const words = String(q || "")
    .toLowerCase()
    .split(/[^a-zA-Zа-яА-Я0-9#@]+/)
    .filter(Boolean);
  let s = 0;
  for (const w of words) {
    if (t.includes(w)) s += 5;
    if (d.includes(w)) s += 3;
    if (c.includes(w)) s += 2;
  }
  if (String(it.partner).toLowerCase() === "true") s += 2;
  if (/ии|ai|игр/i.test(c)) s += 1;
  return s;
}
