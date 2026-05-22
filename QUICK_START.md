# 🚀 دليل الإطلاق السريع
## Quick Start Guide - DUMLIS System

---

## 📝 ملخص سريع | Quick Summary

هذا الدليل يشرح كيفية تشغيل نظام DUMLIS كاملاً في 10 دقائق فقط!

This guide explains how to launch the complete DUMLIS system in just 10 minutes!

---

## ✅ المتطلبات | Requirements

**قبل البدء، تأكد من تثبيت**:
- ✅ Python 3.8+
- ✅ Node.js 14+
- ✅ PostgreSQL 12+
- ✅ npm أو yarn

**التحقق من التثبيت**:
```bash
python --version
node --version
psql --version
npm --version
```

---

## 🔧 الخطوة 1: إعداد قاعدة البيانات
## Step 1: Database Setup

### 1.1 إنشاء قاعدة البيانات
```bash
# إنشاء المستخدم والقاعدة
psql -U postgres -c "CREATE USER dumlis_user WITH PASSWORD 'dumlis_password';"
psql -U postgres -c "CREATE DATABASE dumlis OWNER dumlis_user;"
psql -U postgres -c "ALTER USER dumlis_user CREATEDB;"
```

### 1.2 تحديث متغيرات البيئة للخادم الخلفي
```bash
cd backend

# انسخ ملف البيئة
cp .env.example .env

# حرّر .env وتأكد من:
nano .env
# DATABASE_URL=postgresql://dumlis_user:dumlis_password@localhost:5432/dumlis
```

### 1.3 تطبيق الهجرات
```bash
cd backend
alembic upgrade head
```

### 1.4 ملء البيانات
```bash
cd backend
python seed_multi_faculty.py
```

**النتيجة المتوقعة**:
```
✅ DATABASE SEEDING COMPLETE!
==================================================
📚 Faculties: 3
👥 Students: 500
📖 Courses: 25
... إلخ
```

---

## 🖥️ الخطوة 2: تشغيل الخادم الخلفي
## Step 2: Start Backend Server

### في Terminal جديد:
```bash
cd backend

# تثبيت المكتبات (إن لم تكن مثبتة)
pip install -r requirements.txt

# تشغيل الخادم
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**عندما ترى هذا، الخادم يعمل** ✅:
```
Uvicorn running on http://0.0.0.0:8000
Press CTRL+C to quit
```

### اختبر أن الخادم يعمل:
```bash
# في Terminal آخر
curl http://localhost:8000/health

# يجب أن ترد:
{"status":"healthy","version":"1.0.0"}
```

---

## 🎨 الخطوة 3: تشغيل الواجهة الأمامية
## Step 3: Start Frontend

### في Terminal جديد:
```bash
cd frontend (أو الجذر الرئيسي)

# تأكد من وجود .env.local
cat .env.local
# يجب أن يحتوي:
# VITE_API_URL=http://localhost:8000

# تثبيت المكتبات (إن لم تكن مثبتة)
npm install

# تشغيل الواجهة
npm run dev
```

**عندما ترى هذا، الواجهة تعمل** ✅:
```
VITE v5.x.x  build ready in XXXms
➜  Local:   http://localhost:5173/
```

---

## 🔐 الخطوة 4: الدخول إلى النظام
## Step 4: Login to System

### افتح المتصفح:
```
http://localhost:5173
```

### حسابات الاختبار المدمجة:

#### Super Admin (رئيس الجامعة)
```
Username: admin
Password: admin123
Role: super_admin
```

#### Faculty Admin - FCAI (مدير كلية الحاسبات)
```
Username: fcai_admin
Password: fcai123
Role: faculty_admin
Faculty: FCAI
```

#### Faculty Admin - FSC (مدير كلية العلوم)
```
Username: fsc_admin
Password: fsc123
Role: faculty_admin
Faculty: FSC
```

#### Student Affairs (موظف شؤون الطلاب)
```
Username: student_affairs
Password: sa123
Role: student_affairs
Faculty: FCAI
```

---

## ✨ الخطوة 5: اختبر الميزات الأساسية
## Step 5: Test Core Features

### ✅ اختبار 1: عرض قائمة الطلاب
1. سجل دخول كـ super_admin
2. اذهب إلى **الطلاب** → **قائمة الطلاب**
3. يجب أن ترى 500+ طالب
4. تصفية حسب الكلية → يجب أن تعمل

### ✅ اختبار 2: إضافة طالب جديد
1. اذهب إلى **إدارة الطلاب**
2. انقر على "إضافة طالب جديد"
3. ملء البيانات:
   - كود الطالب: `20251001`
   - الاسم: `أحمد محمد`
   - الرقم القومي: أي رقم
   - الكلية: `كلية الحاسبات والمعلومات`
   - القسم: `علوم الحاسب`
   - المستوى: `1`
4. حفظ
5. بحث عن الطالب الجديد ✅

### ✅ اختبار 3: عزل البيانات حسب الكلية
1. سجل دخول كـ fcai_admin (كلية الحاسبات)
2. اذهب إلى الطلاب → يجب أن ترى طلاب FCAI فقط
3. اذهب إلى المقررات → يجب أن ترى مقررات FCAI فقط
4. سجل خروج
5. سجل دخول كـ fsc_admin (كلية العلوم)
6. اذهب إلى الطلاب → يجب أن ترى طلاب FSC فقط
7. **اختبار ناجح** ✅

### ✅ اختبار 4: تحميل القوائم المنسدلة ديناميكياً
1. افتح أي نموذج إضافة طالب
2. افتح **DevTools** (F12)
3. اذهب إلى علامة **Network**
4. ابحث عن طلب `/faculties/`
5. يجب أن ترى 3 كليات في الاستجابة
6. ابحث عن طلب `/departments/`
7. يجب أن ترى الأقسام في الاستجابة
8. **اختبار ناجح** ✅

### ✅ اختبار 5: بيانات حية
1. أضف طالب جديد
2. في نفس الوقت (في متصفح آخر):
   - سجل دخول كـ super_admin
   - اذهب إلى قائمة الطلاب
3. يجب أن تشاهد الطالب الجديد فوراً ✅

---

## 🐛 استكشاف الأخطاء
## Troubleshooting

### ❌ خطأ: "Cannot connect to database"
```
المشكلة: لا يمكن الاتصال بقاعدة البيانات
الحل:
1. تأكد من تشغيل PostgreSQL
2. تحقق من DATABASE_URL في .env
3. جرب الاتصال مباشرة:
   psql -U dumlis_user -d dumlis
```

### ❌ خطأ: "CORS error"
```
المشكلة: خطأ CORS عند استدعاء API
الحل:
1. تأكد من أن الخادم يعمل على :8000
2. تحقق من VITE_API_URL في .env.local
3. أعد تحميل الصفحة (Ctrl+Shift+R)
4. امسح ذاكرة التخزين المؤقت للمتصفح
```

### ❌ خطأ: "API request failed"
```
المشكلة: فشلت طلبات API
الحل:
1. اختبر الخادم:
   curl http://localhost:8000/health
2. تحقق من سجلات الخادم في Terminal
3. تأكد من أن جميع المكتبات مثبتة:
   cd backend && pip install -r requirements.txt
```

### ❌ خطأ: "Empty dropdowns"
```
المشكلة: القوائم المنسدلة فارغة
الحل:
1. تأكد من تشغيل سكريبت البذر:
   python seed_multi_faculty.py
2. تحقق من البيانات في قاعدة البيانات:
   psql -U dumlis_user -d dumlis -c "SELECT COUNT(*) FROM faculties;"
3. أعد تحميل الصفحة
```

---

## 📊 التحقق من البيانات
## Verify Data

### عرض البيانات مباشرة:
```bash
# الكليات
psql -U dumlis_user -d dumlis -c "SELECT * FROM faculties;"

# الأقسام
psql -U dumlis_user -d dumlis -c "SELECT * FROM departments;"

# الطلاب (أول 10 فقط)
psql -U dumlis_user -d dumlis -c "SELECT * FROM students LIMIT 10;"

# المقررات
psql -U dumlis_user -d dumlis -c "SELECT * FROM courses;"

# عدد الطلاب
psql -U dumlis_user -d dumlis -c "SELECT COUNT(*) FROM students;"
```

---

## 🎯 الخطوات التالية
## Next Steps

بعد تشغيل النظام بنجاح:

1. **استكشف الميزات**
   - اذهب إلى جميع الصفحات
   - جرّب جميع الأزرار
   - اختبر البحث والتصفية

2. **أضف بيانات إضافية**
   - أضف طلاباً جدداً
   - أنشئ مقررات جديدة
   - أضف غرفاً جديدة

3. **اختبر كمستخدمين مختلفين**
   - جرّب كـ super_admin
   - جرّب كـ faculty_admin
   - جرّب كـ student_affairs

4. **راجع التوثيق**
   - MIGRATION_STATUS.md - تفاصيل تقنية
   - IMPLEMENTATION_CHECKLIST.md - قائمة اختبار شاملة
   - FINAL_ROADMAP.md - خطة الطريق الكاملة

---

## 🆘 الحصول على الدعم
## Getting Help

إذا واجهت مشكلة:

1. **افحص السجلات**:
   - سجلات الخادم في Terminal
   - سجلات المتصفح (F12 → Console)
   - سجلات قاعدة البيانات

2. **جرّب الحل الموصى به** في قسم استكشاف الأخطاء

3. **اقرأ التوثيق المفصلة**:
   - MIGRATION_STATUS.md
   - IMPLEMENTATION_CHECKLIST.md
   - FINAL_ROADMAP.md

4. **اتصل بفريق الدعم** إذا استمرت المشكلة

---

## 📋 قائمة التحقق النهائية
## Final Checklist

- [ ] تثبيت Python و Node و PostgreSQL
- [ ] إنشاء قاعدة البيانات والمستخدم
- [ ] تطبيق الهجرات
- [ ] تشغيل سكريبت البذر (500 طالب ✅)
- [ ] تشغيل الخادم الخلفي على :8000 ✅
- [ ] تشغيل الواجهة الأمامية على :5173 ✅
- [ ] الدخول بـ super_admin ✅
- [ ] عرض قائمة الطلاب ✅
- [ ] إضافة طالب جديد ✅
- [ ] اختبار عزل البيانات حسب الكلية ✅
- [ ] التحقق من تحميل القوائم المنسدلة ✅
- [ ] اختبار البيانات الحية ✅

---

## 🎉 تم! النظام جاهز للاستخدام
## Done! System Ready to Use

إذا اتبعت جميع الخطوات بنجاح:
- ✅ لديك قاعدة بيانات كاملة بـ 500+ طالب
- ✅ لديك خادم خلفي يعمل بشكل مثالي
- ✅ لديك واجهة أمامية استجابية
- ✅ جميع الميزات تعمل بشكل صحيح
- ✅ البيانات معزولة حسب الكلية
- ✅ القوائم المنسدلة محملة ديناميكياً

**🚀 النظام جاهز للإنتاج!**

---

**للمزيد من المعلومات، راجع**:
- 📖 FINAL_ROADMAP.md - خطة الطريق الشاملة
- ✅ IMPLEMENTATION_CHECKLIST.md - اختبارات شاملة
- 📊 MIGRATION_STATUS.md - تفاصيل تقنية

**تاريخ آخر تحديث**: 21 أبريل 2026  
**الإصدار**: 1.0.0
