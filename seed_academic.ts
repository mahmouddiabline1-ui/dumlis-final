const BASE_URL = 'http://localhost:8000';

const FCAI_DEPARTMENTS = [
  { code: 'CS', name: 'علوم الحاسب (CS)', nameEn: 'Computer Science' },
  { code: 'IS', name: 'نظم المعلومات (IS)', nameEn: 'Information Systems' },
  { code: 'AI', name: 'الذكاء الاصطناعي (AI)', nameEn: 'Artificial Intelligence' },
  { code: 'IT', name: 'تكنولوجيا المعلومات (IT)', nameEn: 'Information Technology' },
  { code: 'MI', name: 'المعلوماتية الطبية (MI)', nameEn: 'Medical Informatics' },
  { code: 'SEC', name: 'الأمن السيبراني (SEC)', nameEn: 'Cyber Security' }
];

async function seed() {
  console.log('Seeding COMPLETE Academic Structure for FCAI...');
  
  async function post(endpoint: string, data: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
        if (res.status === 409) return; 
        const text = await res.text();
        console.error(`Error at ${endpoint}: ${text}`);
    }
    return res.status === 201 || res.status === 200 ? await res.json() : null;
  }

  // 1. Faculty
  await post('/faculties/', {
    id: "FCAI",
    name: "كلية الحاسبات والذكاء الاصطناعي",
    name_en: "Faculty of Computers and Artificial Intelligence",
    icon: "💻",
    student_count: 2000,
    staff_count: 120,
    color: "bg-primary-600"
  });

  const programsMap: any = {};

  // 2. Departments, Programs, Regulations
  for (const dept of FCAI_DEPARTMENTS) {
    const deptId = dept.code; // Use short code as ID for simplicity if allowed
    const progId = `PROG-${dept.code}`;
    const regId = `REG-${dept.code}`;

    await post('/departments/', {
      id: deptId,
      faculty_id: "FCAI",
      name: dept.name,
      name_en: dept.nameEn,
      code: dept.code,
      head_name: "رأس القسم"
    });

    await post('/programs/', {
      id: progId,
      name: dept.name,
      name_en: dept.nameEn,
      code: dept.code,
      degree: "بكالوريوس",
      department_id: deptId,
      total_hours: 140
    });

    await post('/regulations/', {
      id: regId,
      name: `لائحة ${dept.name}`,
      program_id: progId,
      mandatory_hours: 45,
      elective_hours: 12,
      university_requirements: 10
    });

    // Add to rules map
    programsMap[dept.code] = {
      name: dept.name,
      nameEn: dept.nameEn,
      mandatory: [
        { code: `${dept.code}301`, name: `مقرر تخصص 1 - ${dept.name}`, theoreticalHours: 3, practicalHours: 2, creditHours: 3 },
        { code: `${dept.code}302`, name: `مقرر تخصص 2 - ${dept.name}`, theoreticalHours: 3, practicalHours: 2, creditHours: 3 }
      ],
      elective: [
        { code: `${dept.code}303`, name: `مقرر اختياري - ${dept.name}`, theoreticalHours: 3, practicalHours: 2, creditHours: 3 }
      ]
    };
  }

  // 3. Academic Rules (The most important part for the UI)
  console.log('Upserting Academic Rules with 6 programs...');
  const rulesData = {
    id: "RULE-FCAI-PROD",
    facultyId: "FCAI",
    facultyName: "كلية الحاسبات والذكاء الاصطناعي",
    studySystem: {
      creditHoursSystem: true,
      graduationRequirementsDetails: {
        majorRequirements: {
          programs: programsMap
        }
      }
    }
  };

  // Delete existing if any to refresh
  await fetch(`${BASE_URL}/academic-rules/RULE-FCAI-PROD`, { method: 'DELETE' }).catch(() => {});
  
  await post('/academic-rules/', {
    id: "RULE-FCAI-PROD",
    faculty_id: "FCAI",
    rules_data: rulesData
  });

  console.log('Seeding DONE!');
}

seed().catch(console.error);
