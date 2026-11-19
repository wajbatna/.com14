# سجل التغييرات

## 2026-10-20 — نسخة محسّنة (أداء + SEO + PWA + تنظيم)

### أُضيف
- `manifest.webmanifest` + `sw.js`: تثبيت كتطبيق، فتح أسرع، وعمل جزئي بلا إنترنت.
- `robots.txt`, `sitemap.xml`, `404.html`, `img/og-cover.jpg`, أيقونات PWA وfavicon.
- خط Tajawal محلياً فـ `fonts/` (woff2، 5 أوزان) + رخصة OFL.
- `css/main.css`, `css/admin.css`, `js/utils.js` (دوال مشتركة صافية).
- JSON-LD (`Restaurant` + `WebSite`)، Open Graph، Twitter Card، `hreflang`، ودعم `?lang=fr`.
- سلة محفوظة فـ localStorage + تنظيف تلقائي للأطباق المحذوفة.
- تخزين Firestore دائم (IndexedDB) للعمل بلا إنترنت.
- زر عودة لأعلى، ظهور تدريجي للأقسام، حبس التركيز فالنوافذ.

### تبدّل
- Firebase Analytics ولا كيتحمّل مؤجل بعد `load`.
- `choosePlan` و`add/remove` كيحدّثو غير اللي تبدّل (بلا إعادة رسم القائمة كاملة).
- `firebase.json`: `public: "."` (كان كيشير لمجلد غير موجود) + رؤوس كاش وأمان.
- تحديث موضعي لبطاقة الطبق عند تغيير الكمية.

### تصلّح
- تواريخ التوصيل: استعمال التوقيت المحلي بدل UTC (`toISOString` كان كيغلط بين 00:00 و01:00).
- منع إرسال الطلب مرتين عند تكرار الضغط.
- فشل العمليات الجانبية (النقاط/العضوية) ما بقاش كيبان كخطأ فطلبنجح.
- حقن HTML محتمل عبر معرّفات Firestore داخل `onclick` (`jsArg`).
- `src=""` فصورة وجبة اليوم، أزرار بلا `type`، و`autocomplete` ناقص فلوحة التحكم.
- `aria-hidden` على عناصر قابلة للتركيز (ولا `inert`).
