import React, { useState, useEffect } from 'react';
import { FACULTIES } from '../constants';
import { facultiesApi } from '../api';
import { Users, GraduationCap, BarChart3, Building2, Plus } from 'lucide-react';
import { Faculty } from '../types';

interface FacultyGridProps {
  onSelectFaculty: (id: string) => void;
  onManageAcademicStructure?: () => void;
}

const FacultyGrid: React.FC<FacultyGridProps> = ({ onSelectFaculty, onManageAcademicStructure }) => {
  const [allFaculties, setAllFaculties] = useState<Faculty[]>(FACULTIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFaculties = async () => {
      try {
        setLoading(true);
        // Fetch from DB
        const dbFaculties = await facultiesApi.list();
        
        // Map API response to Faculty type
        const mappedFaculties: Faculty[] = dbFaculties.map(f => ({
          id: f.id,
          name: f.name,
          icon: f.icon || '🎓',
          studentCount: f.student_count || 0,
          staffCount: f.staff_count || 0,
          color: f.color || 'bg-primary-600'
        }));

        // If API returned nothing, fallback to constants
        if (mappedFaculties.length === 0) {
          setAllFaculties(FACULTIES);
        } else {
          setAllFaculties(mappedFaculties);
        }
      } catch (error) {
        console.error('Failed to load faculties:', error);
        // Fallback to constants on error
        setAllFaculties(FACULTIES);
      } finally {
        setLoading(false);
      }
    };
    
    loadFaculties();
  }, []);
  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">تحليل وإحصائيات الكليات</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
             نظرة عامة على إحصائيات الكليات والمعاهد - للعرض والتحليل فقط
          </p>
        </div>
        {onManageAcademicStructure && (
          <div className="flex justify-center mb-6">
            <button
              onClick={onManageAcademicStructure}
              className="flex items-center gap-3 px-6 py-3 bg-primary-700 text-white rounded-xl hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">إدارة الكليات / التخصصات / البرامج / المقررات</span>
              <Plus className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 container mx-auto">
        {allFaculties.map((faculty) => (
          <button
            key={faculty.id}
            onClick={() => onSelectFaculty(faculty.id)}
            className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden group text-right flex flex-col h-full cursor-pointer"
          >
            {/* Icon Section */}
            <div className="p-6 pb-4 flex justify-center">
              <div className={`w-24 h-24 rounded-2xl ${faculty.color} bg-gradient-to-br flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {faculty.icon}
              </div>
            </div>
            
            {/* Faculty Name */}
            <div className="px-6 pb-4">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors text-center">
                {faculty.name}
              </h3>
            </div>
            
            {/* Statistics */}
            <div className="px-6 pb-4 flex gap-6 justify-center text-sm">
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-500 text-xs font-medium">عضو هيئة</span>
                <span className="font-bold text-gray-900 text-lg">{faculty.staffCount.toLocaleString()}</span>
              </div>
              <div className="w-px bg-gray-300"></div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-gray-500 text-xs font-medium">طالب</span>
                <span className="font-bold text-gray-900 text-lg">{faculty.studentCount.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Analytics Badge */}
            <div className="mt-auto p-4 border-t border-gray-100 bg-gradient-to-r from-primary-50 to-gold-50 flex items-center justify-center gap-2 group-hover:from-primary-100 group-hover:to-gold-100 transition-colors">
              <BarChart3 className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">عرض الإحصائيات التفصيلية</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FacultyGrid;