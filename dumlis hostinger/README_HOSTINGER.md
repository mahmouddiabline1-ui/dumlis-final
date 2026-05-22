# دليل رفع المشروع على Hostinger

## خطوات الرفع:

1. **افتح File Manager في Hostinger Dashboard**
2. **اذهب إلى مجلد `public_html`**
3. **احذف جميع الملفات الموجودة (إن وجدت)**
4. **ارفع جميع محتويات مجلد `public` من هذا المشروع إلى `public_html`**
   - index.html
   - assets/
   - logo.PNG
5. **ارفع ملف `.htaccess` إلى `public_html`**

## ملاحظات مهمة:

- ✅ المشروع جاهز للعمل مباشرة بعد الرفع
- ✅ جميع المسارات نسبية (relative paths)
- ✅ ملف `.htaccess` جاهز لدعم React Router
- ✅ تم تفعيل الضغط والكاش للتحسين

## هيكل الملفات المطلوب على Hostinger:

```
public_html/
├── index.html
├── .htaccess
├── logo.PNG
└── assets/
    ├── index-ClUjGu1p.css
    └── index-CVZ3HapU.js
```

## التحقق من العمل:

بعد الرفع، افتح الدومين في المتصفح. يجب أن يعمل الموقع مباشرة بدون أي تعديلات.






