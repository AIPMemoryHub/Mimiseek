export const API_URL =
  (typeof window !== "undefined" && window.__GAS_URL__) ||
  (typeof globalThis !== "undefined" && globalThis.GAS_URL) ||
  "https://script.google.com/macros/s/XXX/exec";

export async function getResources() {
  const r = await fetch(API_URL, { cache: "no-store" });
  try {
    const json = await r.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function postEvent(payload) {
  try {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {}
}
