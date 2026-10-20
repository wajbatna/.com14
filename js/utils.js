// ═══════════════════════════════════════════════════════════════════════
// utils.js — دالات مساعدة صافية (بلا حالة، بلا DOM) مشتركة بين الموقع واللوحة
// ═══════════════════════════════════════════════════════════════════════

/* ---------- الحماية من حقن HTML ---------- */
export function escapeHtml(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[c]));
}
export function escapeAttr(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
// كيحوّل قيمة لنص JavaScript آمن داخل خاصية onclick="..." (كيمنع كسر السلسلة أو حقن كود
// إلا كان معرّف الوثيقة فـ Firestore فيه علامات اقتباس أو رموز خاصة)
export function jsArg(v) {
  return escapeAttr(JSON.stringify(String(v)));
}

/* ---------- التواريخ بالتوقيت المحلي ---------- */
// ملاحظة: toISOString() كيرجع UTC، وفالمغرب (UTC+1) كان يقدر يعطي نهار ناقص/زايد.
export function isoOf(d) {
  const x = d instanceof Date ? d : new Date(d);
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
}
export function todayISO() {
  return isoOf(new Date());
}
export function isoAddDays(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return isoOf(d);
}

/* ---------- الهاتف ---------- */
export function phoneToEmail(phone) {
  return `${phone}@wajbati.app`;
}
// كيحول أي صيغة (+212612345678 / 212612345678 / 0612345678) لنفس الصيغة الموحدة
export function normalizePhone(raw) {
  let p = String(raw || "").replace(/[\s-]/g, "").trim();
  if (p.startsWith("+212")) p = "0" + p.slice(4);
  else if (p.startsWith("212") && p.length === 12) p = "0" + p.slice(3);
  return p;
}
export const PHONE_RE = /^(0[5-7]\d{8}|\+212[5-7]\d{8})$/;

/* ---------- رقم الطلب ---------- */
// رقم مختصر وقابل للقراءة مشتق من معرّف الوثيقة فـ Firestore
export function orderCode(id) {
  return "WJ-" + String(id || "").slice(0, 8).toUpperCase();
}

/* ---------- الأيقونات ---------- */
export function ico(name) {
  return `<img src="img/icons/${name}.webp" alt="" width="24" height="24" style="width:1.35em;height:1.35em;vertical-align:-0.32em;margin-inline-end:.3em;display:inline-block;object-fit:contain" loading="lazy" decoding="async">`;
}
const ICON_EMOJI_RE = /🎫|👤|🎁|💬|📦|⚙/g;
const ICON_BY_EMOJI = { "🎫": "card", "👤": "account", "🎁": "rewards", "💬": "support", "📦": "orders", "⚙": "settings" };
// كيعوض الإيموجي القديمة (مثلا المحفوظة فسجل النقاط) بالأيقونات الجديدة
export function iconize(html) {
  return String(html ?? "").replace(ICON_EMOJI_RE, (m) => ico(ICON_BY_EMOJI[m]));
}

/* ---------- متفرقات ---------- */
// يفصل الإيموجي الأول عن النص (النصوص فالترجمة كلها بصيغة "إيموجي نص")
export function splitIcon(str) {
  const idx = (str || "").indexOf(" ");
  if (idx === -1) return { icon: "", text: str || "" };
  return { icon: str.slice(0, idx), text: str.slice(idx + 1) };
}
// كيخلص CSS.escape إلا ما كانتش مدعومة
export function cssEscape(v) {
  return window.CSS && CSS.escape ? CSS.escape(String(v)) : String(v).replace(/["\\]/g, "\\$&");
}
