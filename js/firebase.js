// firebase.js
// -----------------------------------------------------------------------
// خطوات الإعداد (مرة وحدة فقط):
// 1) روح لـ https://console.firebase.google.com وصاوب مشروع جديد
// 2) Project settings ⚙ → General → "Your apps" → أضف Web app → نسخ الإعدادات ولصقها تحت
// 3) فعّل Firestore Database (Build → Firestore Database → Create database)
// 4) فعّل Authentication → Sign-in method → Email/Password
// 5) من Authentication → Users → أضف حساب للأدمين (email + password) يدوياً
// 6) باش يخدم زر "المتابعة عبر Google": Authentication → Sign-in method → فعّل Google
// 7) باش يخدم زر "المتابعة عبر Apple": Authentication → Sign-in method → فعّل Apple
//    (خاصك حساب Apple Developer وتصاوب Service ID + Key من developer.apple.com،
//    وتزيد الـ redirect URI ديال Firebase فإعدادات Apple — التفاصيل فوثائق Firebase)
// -----------------------------------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCLNN2ejx6BDwGgwdkKGLfL3odS2i_V5Rc",
  authDomain: "wajbatna-c83ee.firebaseapp.com",
  databaseURL: "https://wajbatna-c83ee-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wajbatna-c83ee",
  storageBucket: "wajbatna-c83ee.firebasestorage.app",
  messagingSenderId: "825720260240",
  appId: "1:825720260240:web:50b38212905480e883ba15",
  measurementId: "G-RQYEY82MS6",
};

const app = initializeApp(firebaseConfig);

// تخزين محلي دائم (IndexedDB): القائمة كتظهر فوراً فالزيارات القادمة وكتخدم بلا إنترنت،
// والتغييرات كتتزامن وحدها ملي يرجع الاتصال. إلا ما دعمش المتصفح، كنرجعو للتخزين العادي.
export const db = (() => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch (e) {
    return getFirestore(app);
  }
})();
export const auth = getAuth(app);

// Analytics تخدم غير فدومين حقيقي منشور (ماشي فمعاينة/localhost)، فهاد الفحص كيمنع أخطاء فالكونسول.
// كتتحمّل بشكل مؤجل باش ما تأثرش على سرعة أول رسم للصفحة.
const loadAnalytics = () => {
  if (!firebaseConfig.measurementId) return;
  import("https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js")
    .then(({ getAnalytics, isSupported }) => isSupported().then((ok) => ok && getAnalytics(app)))
    .catch(() => {});
};
if (document.readyState === "complete") setTimeout(loadAnalytics, 1200);
else window.addEventListener("load", () => setTimeout(loadAnalytics, 1200), { once: true });
