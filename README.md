# وجبتنا — Wajbatna

موقع طلبات أكل بيتي مغربي (عربي/فرنسي) + لوحة تحكم للإدارة، مبني بـ HTML/CSS/JS خام مع Firebase (Firestore + Authentication). بلا أي أداة بناء: كتفتح الملفات مباشرة ومن بعد كتنشرهم على Firebase Hosting.

---

## البنية

```
.
├── index.html              # صفحة الزبون (SEO + PWA + بيانات منظّمة)
├── admin.html              # لوحة التحكم (noindex)
├── 404.html                # صفحة الخطأ
├── css/
│   ├── main.css            # أنماط الموقع
│   └── admin.css           # أنماط لوحة التحكم
├── js/
│   ├── app.js              # منطق الزبون (سلة، طلبات، حساب، نقاط، دعم)
│   ├── admin.js            # منطق لوحة التحكم
│   ├── firebase.js         # تهيئة Firebase + التخزين المحلي الدائم
│   ├── i18n.js             # نصوص عربي/فرنسي
│   └── utils.js            # دالات مساعدة صافية (حماية، تواريخ، أيقونات)
├── fonts/                  # خط Tajawal (woff2، مستضاف محلياً) + رخصة OFL
├── img/                    # الشعار، الأيقونات، صور طرق الأداء، صورة المشاركة
├── manifest.webmanifest    # PWA
├── sw.js                   # Service Worker (تحميل سريع + عمل بلا إنترنت)
├── robots.txt · sitemap.xml
├── firestore.rules         # قواعد أمان Firestore
└── firebase.json           # إعدادات النشر (Hosting + Firestore)
```

---

## التشغيل محلياً

لازم سيرفر HTTP (ماشي `file://`) حيت المشروع كيستعمل ES Modules و Service Worker:

```bash
# أي سيرفر ثابت، مثلاً:
npx serve .
# أو
python3 -m http.server 8080
```

ثم افتح `http://localhost:8080/`. لوحة التحكم على `/admin.html`.
Service Worker كيتسجل غير على HTTPS أو localhost.

---

## إعداد Firebase (مرة وحدة)

1. أنشئ مشروع فـ [Firebase Console](https://console.firebase.google.com).
2. زيد Web App وحط الإعدادات فـ `js/firebase.js`.
3. فعّل **Firestore Database** و **Authentication → Email/Password** (و Google/Apple إلا بغيتي).
4. زيد حساب أدمين من Authentication، ومن بعد زيد وثيقة فمجموعة `admins` بنفس `uid`.
   بلا هاد الخطوة، الحساب ما كيدخلش للوحة التحكم (فحص مزدوج: كود + قواعد الأمان).
5. انشر القواعد:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## النشر

```bash
npm i -g firebase-tools
firebase login
firebase deploy
```

`firebase.json` معدّ باش ينشر من جذر المشروع (`public: "."`) مع استثناء الملفات غير العمومية.
كينضاف أيضاً:
- **Cache-Control** طويل للصور والخطوط، قصير للـ JS/CSS، وبلا كاش لـ `sw.js` و HTML.
- رؤوس أمان: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

> بدّل النطاق فـ `index.html` (canonical / og:url / JSON-LD) و`robots.txt` و`sitemap.xml` إلا خدمتي نطاق آخر من `wajbatna-c83ee.web.app`.

---

## ما تم تحسينه فهاد النسخة

### الأداء
- **الخطوط محلياً**: خط Tajawal (5 أوزان) مقتطع و`woff2` (~18KB لكل وزن) بدل طلب Google Fonts الخارجي → بلا طلب خارجي حاجب للرسم وبلا FOIT.
- `preload` لأوزان الخط الحرجة + `font-display: swap` + `preconnect` لخدمات Firebase.
- **تخزين Firestore دائم (IndexedDB)**: القائمة وبيانات الزبون كيتخزّنو محلياً → فتح فوري فالزيارات القادمة وتزامن تلقائي بعد انقطاع الشبكة.
- **Service Worker**: كاش للقشرة الثابتة، الشبكة أولاً للسكربتات/الصفحات، الكاش أولاً للصور والخطوط.
- تحديث موضعي لبطاقة الطبق عند +/- فالسلة بدل إعادة رسم القائمة كاملة (بلا ما تتقاد الصور).
- `loading="lazy"` + `decoding="async"` + أبعاد محددة للصور (بلا قفزات فالـ layout).
- Analytics كتتحمّل بشكل مؤجل بعد `load`، و`prefers-reduced-motion` محترم.

### SEO
- `title` و`description` ديناميكيين حسب اللغة، و`canonical` + `hreflang` (ar/fr/x-default) + دعم `?lang=fr` فـ الروابط.
- Open Graph + Twitter Card + صورة مشاركة `img/og-cover.jpg` (1200×630).
- **JSON-LD**: `Restaurant` (منطقة الخدمة، المطبخ، الأسعار، طرق الأداء) + `WebSite`.
- `robots.txt` + `sitemap.xml`، ولوحة التحكم `noindex`.
- بنية دلالية: `header/main/section/article/nav/footer`، عنوان واحد `h1`، عناوين أقسام، و`noscript` واضح.

### تجربة الاستخدام والتصميم
- نظام تصميم محدّث (تدرّجات، ظلال ناعمة، زوايا، حالات hover/focus) مع الحفاظ على الهوية (أخضر + ذهبي + Tajawal).
- شرائح ثقة فالواجهة، عنوان قسم للقائمة، ظهور تدريجي عند التمرير، زر عودة لأعلى.
- أعلام المغرب/فرنسا محلياً (SVG) بدل `flagcdn`.
- السلة كتبقى محفوظة بعد إغلاق الصفحة (localStorage) وكتتنقى تلقائياً من الأطباق المحذوفة.
- أزرار كتتأكد من العمليات الجانبية (نقاط/عضوية) بلا ما تفشّل الطلب.

### الإتاحة (a11y)
- `inert` + `aria-hidden` للقائمة الجانبية، حبس التركيز داخل النوافذ (Tab)، إغلاق بـ Escape.
- `aria-label` للنوافذ والأزرار، `aria-pressed` للاختيارات، `aria-busy` للقائمة، `aria-live` للسلة والإشعارات.
- تباين أفضل، حالات `:focus-visible` واضحة، احترام تقليل الحركة.

### الأمان والمتانة
- حماية من حقن HTML فكل المعرّفات الجاية من Firestore داخل `onclick` (دالة `jsArg`).
- منع إرسال الطلب مرتين (double submit) + استرجاع حالة الزر عند الخطأ.
- تواريخ محلية صحيحة (`isoOf`) بدل `toISOString()` اللي كان كيعطي نهار غالط بين منتصف الليل و1 صباحاً (UTC+1).
- `AbortSignal.timeout` لطلب العنوان العكسي حتى ما يعلّقش النموذج.
- إخفاء لوحة التحكم من محركات البحث، ورؤوس أمان فـ Hosting.
- `!` ملاحظة: مجموع الطلب كيتحسب فالمتصفح (كما كان). قواعد Firestore كتتحقق من النوع والمدى ماشي من مطابقة السعر مع قائمة الأطباق — راجع المجموع فلوحة التحكم قبل التأكيد، أو زيد Cloud Function للتحقق الحقيقي.

### الكود
- فصل كامل: CSS فـ `css/`، JS فـ `js/`، ودوال صافية مشتركة فـ `js/utils.js` (مستعملة من الموقع واللوحة).
- حذف التكرار بين `app.js` و`admin.js`، وتعليقات عربية واضحة.
- إصلاحات: `firebase.json` كان كيشير لمجلد `public` غير موجود (النشر كان غادي يفشل)، `src=""` فصورة وجبة اليوم، أزرار بلا `type`/`aria-label`، وأخطاء HTML/A11y اللي كشفها الفحص.

---

## فحص سريع قبل النشر

- [ ] `npx html-validate index.html admin.html 404.html` بلا أخطاء.
- [ ] `node --check js/app.js js/admin.js js/firebase.js js/i18n.js js/utils.js`.
- [ ] جرّب: إضافة/حذف من السلة، تبديل اللغة، إتمام طلب بحساب، الطلب بلا حساب (كيفتح التسجيل)، فتح الدعم والنقاط.
- [ ] فـ Chrome DevTools → Application: Manifest صالح، Service Worker مسجّل، وبلا أخطاء كونسول.
- [ ] افتح الموقع فالموبايل وتأكد من شريط السلة السفلي والهيدر اللاصق.
- [ ] `firebase deploy --only firestore:rules` بعد أي تبديل فـ `firestore.rules`.

---

## رخص

- خط **Tajawal**: SIL Open Font License — `fonts/OFL.txt`.
- أعلام **flag-icons**: MIT — `licenses/flag-icons-LICENSE.txt`.
