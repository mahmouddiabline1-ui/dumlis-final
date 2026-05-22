import React, { useEffect, useState } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { academicRulesApi } from '../api';

interface SimpleAcademicRulesEditorProps {
  facultyId?: string;
  facultyName?: string;
}

const SimpleAcademicRulesEditor: React.FC<SimpleAcademicRulesEditorProps> = ({ facultyId, facultyName }) => {
  const [rules, setRules] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!facultyId) {
      setLoading(false);
      return;
    }

    const loadRules = async () => {
      try {
        const resp = await academicRulesApi.getByFaculty(facultyId);
        setRules(resp?.rules_data || getDefaultRules());
      } catch (err: any) {
        console.log('Rules not found or access denied, using defaults:', err?.message);
        // Use defaults instead of showing error
        setRules(getDefaultRules());
      }
      setLoading(false);
    };

    loadRules();
  }, [facultyId]);

  const getDefaultRules = () => ({
    max_credit_hours: 18,
    min_credit_hours: 12,
    pass_grade: 50,
    gpa_pass: 2.0,
    graduation_requirements: {
      total_credit_hours: 140,
      minimum_gpa: 2.0,
      minimum_years: 3,
    },
    level_progression: {
      level_2: { required_hours: 30 },
      level_3: { required_hours: 66 },
      level_4: { required_hours: 102 },
    },
    practical_training: {
      credit_hours: 3,
      required_completed_hours: 70,
    },
    graduation_project: {
      credit_hours: 4,
      required_completed_hours: 102,
    },
    honor_ranking: {
      minimum_cgpa: 3.0,
      minimum_semester_gpa: 3.0,
      max_graduation_years: 4,
    },
    practical_training_details: {
      minimum_duration_weeks: 3,
    },
    scientific_trips: {
      maximum_duration: 5,
    },
    academic_advising: true,
    prerequisites_enforced: true,
    specialization: {
      programs: ['علوم الحاسب (CS)', 'تكنولوجيا المعلومات (IT)', 'نظم المعلومات (IS)'],
      start_level: 3,
      shared_levels: [1, 2],
    },
  });

  const handleChange = (field: string, value: any) => {
    setRules((prev: any) => {
      if (!field.includes('.')) {
        return { ...prev, [field]: value };
      }

      const keys = field.split('.');
      const newRules = { ...prev };
      let current: any = newRules;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object') {
          current[key] = {};
        } else {
          current[key] = { ...current[key] };
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return newRules;
    });
  };

  const handleSave = async () => {
    if (!facultyId || !rules) return;

    setSaving(true);
    setMessage(null);

    try {
      const ruleId = `RULE_${facultyId}`;
      const payload = {
        id: ruleId,
        faculty_id: facultyId,
        rule_name: 'اللائحة الأكاديمية',
        description: `القواعد الأكاديمية لـ ${facultyName || facultyId}`,
        rules_data: rules,
      };

      try {
        // Try to update existing rule
        await academicRulesApi.update(ruleId, payload);
        setMessage({ type: 'success', text: '✅ تم حفظ القواعد بنجاح' });
      } catch (updateErr: any) {
        // If not found or access denied, try to create it
        if (updateErr.status === 404 || updateErr.status === 403) {
          try {
            console.log('Creating new academic rules...');
            await academicRulesApi.create(payload);
            setMessage({ type: 'success', text: '✅ تم إنشاء القواعد الجديدة بنجاح' });
          } catch (createErr: any) {
            throw createErr;
          }
        } else {
          throw updateErr;
        }
      }
    } catch (err: any) {
      console.error('Error saving rules:', err);
      let errMsg = '❌ حدث خطأ أثناء الحفظ';
      if (err?.message) {
        // Parse the error message
        if (err.message.includes('already exists')) {
          errMsg = '❌ قاعدة أكاديمية موجودة بالفعل لهذه الكلية';
        } else {
          errMsg = `❌ ${err.message}`;
        }
      }
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  if (!facultyId) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
        <p className="text-gray-600">اختر كلية من القائمة أعلاه</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
        <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">القواعد الأكاديمية - {facultyName}</h3>
        <p className="text-sm text-gray-600">أدناه قوائم إدارة القواعد الأكاديمية للكلية</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Basic Registration Rules */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">قواعد التسجيل الأساسية</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى للساعات المعتمدة
            </label>
            <input
              type="number"
              value={rules?.min_credit_hours || 12}
              onChange={(e) => handleChange('min_credit_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">الحد الأدنى من الساعات المعتمدة للتسجيل</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأقصى للساعات المعتمدة
            </label>
            <input
              type="number"
              value={rules?.max_credit_hours || 18}
              onChange={(e) => handleChange('max_credit_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">الحد الأقصى من الساعات المعتمدة للتسجيل</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              درجة النجاح (من 100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={rules?.pass_grade || 50}
              onChange={(e) => handleChange('pass_grade', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">الحد الأدنى من الدرجات لاعتبار المقرر ناجح</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى للمعدل التراكمي
            </label>
            <input
              type="number"
              step="0.1"
              value={rules?.gpa_pass || 2.0}
              onChange={(e) => handleChange('gpa_pass', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">الحد الأدنى للمعدل التراكمي (GPA)</p>
          </div>
        </div>
      </div>

      {/* Graduation Requirements */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">متطلبات التخرج</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              إجمالي الساعات المعتمدة المطلوبة
            </label>
            <input
              type="number"
              value={rules?.graduation_requirements?.total_credit_hours || 140}
              onChange={(e) => handleChange('graduation_requirements.total_credit_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى للمعدل التراكمي للتخرج
            </label>
            <input
              type="number"
              step="0.1"
              value={rules?.graduation_requirements?.minimum_gpa || 2.0}
              onChange={(e) => handleChange('graduation_requirements.minimum_gpa', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى لسنوات الدراسة
            </label>
            <input
              type="number"
              value={rules?.graduation_requirements?.minimum_years || 3}
              onChange={(e) => handleChange('graduation_requirements.minimum_years', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Level Progression */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">الانتقال بين المستويات</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الساعات المطلوبة للمستوى الثاني
            </label>
            <input
              type="number"
              value={rules?.level_progression?.level_2?.required_hours || 30}
              onChange={(e) => handleChange('level_progression.level_2.required_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الساعات المطلوبة للمستوى الثالث
            </label>
            <input
              type="number"
              value={rules?.level_progression?.level_3?.required_hours || 66}
              onChange={(e) => handleChange('level_progression.level_3.required_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الساعات المطلوبة للمستوى الرابع
            </label>
            <input
              type="number"
              value={rules?.level_progression?.level_4?.required_hours || 102}
              onChange={(e) => handleChange('level_progression.level_4.required_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Practical Training & Graduation Project */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">التدريب العملي ومشروع التخرج</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ساعات التدريب العملي
            </label>
            <input
              type="number"
              value={rules?.practical_training?.credit_hours || 3}
              onChange={(e) => handleChange('practical_training.credit_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الساعات المطلوبة قبل التدريب
            </label>
            <input
              type="number"
              value={rules?.practical_training?.required_completed_hours || 70}
              onChange={(e) => handleChange('practical_training.required_completed_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ساعات مشروع التخرج
            </label>
            <input
              type="number"
              value={rules?.graduation_project?.credit_hours || 4}
              onChange={(e) => handleChange('graduation_project.credit_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الساعات المطلوبة قبل المشروع
            </label>
            <input
              type="number"
              value={rules?.graduation_project?.required_completed_hours || 102}
              onChange={(e) => handleChange('graduation_project.required_completed_hours', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Honor Ranking Requirements */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">قواعد مرتبة الشرف والتقدير</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى للمعدل التراكمي لمرتبة الشرف
            </label>
            <input
              type="number"
              step="0.1"
              value={rules?.honor_ranking?.minimum_cgpa || 3.0}
              onChange={(e) => handleChange('honor_ranking.minimum_cgpa', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأدنى للمعدل الفصلي
            </label>
            <input
              type="number"
              step="0.1"
              value={rules?.honor_ranking?.minimum_semester_gpa || 3.0}
              onChange={(e) => handleChange('honor_ranking.minimum_semester_gpa', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأقصى لسنوات التخرج
            </label>
            <input
              type="number"
              value={rules?.honor_ranking?.max_graduation_years || 4}
              onChange={(e) => handleChange('honor_ranking.max_graduation_years', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
          <strong>ملاحظة:</strong> يجب عدم الرسوب في أي مقرر للحصول على مرتبة الشرف
        </div>
      </div>

      {/* Course Content & Modification Rules */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">قواعس المقررات والمحتوى العلمي</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مدة التدريب العملي (بالأسابيع)
            </label>
            <input
              type="number"
              value={rules?.practical_training_details?.minimum_duration_weeks || 3}
              onChange={(e) => handleChange('practical_training_details.minimum_duration_weeks', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحد الأقصى لمدة الرحلات العلمية (بالأيام)
            </label>
            <input
              type="number"
              value={rules?.scientific_trips?.maximum_duration || 5}
              onChange={(e) => handleChange('scientific_trips.maximum_duration', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Academic Advising */}
      <div>
        <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">الخدمات الأكاديمية</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rules?.academic_advising || false}
              onChange={(e) => handleChange('academic_advising', e.target.checked)}
              className="w-4 h-4 text-primary-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              تفعيل الإرشاد الأكاديمي
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rules?.prerequisites_enforced || false}
              onChange={(e) => handleChange('prerequisites_enforced', e.target.checked)}
              className="w-4 h-4 text-primary-600"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              إلزامية متطلبات المقررات
            </label>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">معلومات إضافية</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>عدد الأقسام العلمية:</strong> {rules?.specialization?.programs?.length || 3} أقسام
            ({rules?.specialization?.programs?.join(', ') || 'علوم الحاسب, تكنولوجيا المعلومات, نظم المعلومات'})
          </p>
          <p>
            <strong>بداية التخصص:</strong> المستوى {rules?.specialization?.start_level || 3}
          </p>
          <p>
            <strong>المستويات المشتركة:</strong> المستويات {rules?.specialization?.shared_levels?.join(', ') || '1, 2'}
          </p>
          <p>
            <strong>نظام التقييم:</strong> من {rules?.grading_system?.max_score || 100} درجة
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </div>
  );
};

export default SimpleAcademicRulesEditor;
