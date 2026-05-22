"""
DUMLIS - Pydantic Schemas
Request/Response models for all FastAPI endpoints
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, time
from typing import List, Optional, Any, Dict

from pydantic import BaseModel, EmailStr, Field, field_validator


# ============================================================
# Shared base helpers
# ============================================================
class OrmBase(BaseModel):
    model_config = {"from_attributes": True}


# ============================================================
# Faculty
# ============================================================
class FacultyBase(BaseModel):
    name          : str           = Field(..., max_length=255)
    name_en       : Optional[str] = Field(None, max_length=255)
    icon          : Optional[str] = Field(None, max_length=10)
    student_count : int           = 0
    staff_count   : int           = 0
    color         : Optional[str] = Field(None, max_length=100)

class FacultyCreate(FacultyBase):
    id: str = Field(..., max_length=20, description="e.g. 'FCAI', 'SCI'")

class FacultyUpdate(BaseModel):
    name          : Optional[str] = Field(None, max_length=255)
    name_en       : Optional[str] = Field(None, max_length=255)
    icon          : Optional[str] = None
    student_count : Optional[int] = None
    staff_count   : Optional[int] = None
    color         : Optional[str] = None

class FacultyResponse(FacultyCreate, OrmBase):
    created_at : datetime
    updated_at : datetime


# ============================================================
# Department
# ============================================================
class DepartmentBase(BaseModel):
    faculty_id : str           = Field(..., max_length=20)
    name       : str           = Field(..., max_length=255)
    name_en    : Optional[str] = Field(None, max_length=255)
    code       : str           = Field(..., max_length=20)
    head_name  : Optional[str] = Field(None, max_length=255)

class DepartmentCreate(DepartmentBase):
    id: str = Field(..., max_length=20, description="e.g. 'CS', 'IS'")

class DepartmentUpdate(BaseModel):
    name      : Optional[str] = None
    name_en   : Optional[str] = None
    code      : Optional[str] = None
    head_name : Optional[str] = None

class DepartmentResponse(DepartmentCreate, OrmBase):
    student_count : int = 0
    program_count : int = 0
    course_count  : int = 0
    created_at    : datetime
    updated_at    : datetime


# ============================================================
# User
# ============================================================
class UserBase(BaseModel):
    username   : str           = Field(..., max_length=100)
    email      : EmailStr
    role       : str           = Field(..., pattern="^(super_admin|faculty_admin|student_affairs|student)$")
    faculty_id : Optional[str] = None
    is_active  : bool          = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    email      : Optional[EmailStr] = None
    role       : Optional[str]      = None
    faculty_id : Optional[str]      = None
    is_active  : Optional[bool]     = None

class UserResponse(UserBase, OrmBase):
    id         : uuid.UUID
    created_at : datetime
    updated_at : datetime


# ============================================================
# StudentProfile (detailed)
# ============================================================
class StudentProfileBase(BaseModel):
    name_en             : Optional[str]   = None
    birth_date          : Optional[date]  = None
    birth_place         : Optional[str]   = None
    nationality         : Optional[str]   = "مصري"
    religion            : Optional[str]   = None
    gender              : Optional[str]   = None
    photo_url           : Optional[str]   = None
    address_governorate : Optional[str]   = None
    address_city        : Optional[str]   = None
    address_street      : Optional[str]   = None
    address_building    : Optional[str]   = None
    address_details     : Optional[str]   = None
    guardian_name       : Optional[str]   = None
    guardian_relation   : Optional[str]   = None
    guardian_phone      : Optional[str]   = None
    guardian_job        : Optional[str]   = None
    guardian_national_id: Optional[str]   = Field(None, max_length=14)
    qual_type           : Optional[str]   = None
    qual_year           : Optional[str]   = None
    school_name         : Optional[str]   = None
    seat_number         : Optional[str]   = None
    total_degree        : Optional[float] = None
    percentage          : Optional[float] = None
    division            : Optional[str]   = None
    qual_date           : Optional[date]  = None
    military_status     : Optional[str]   = None
    triple_number       : Optional[str]   = None
    postponement_date   : Optional[date]  = None
    postponement_reason : Optional[str]   = None
    military_notes      : Optional[str]   = None
    mil_edu_status      : Optional[str]   = None
    mil_edu_completion  : Optional[date]  = None
    mil_edu_notes       : Optional[str]   = None
    medical_status      : Optional[str]   = None
    vaccination_status  : Optional[str]   = None
    blood_type          : Optional[str]   = Field(None, max_length=5)

class StudentProfileCreate(StudentProfileBase):
    student_id: str = Field(..., max_length=20)

class StudentProfileUpdate(StudentProfileBase):
    pass

class StudentProfileResponse(StudentProfileCreate, OrmBase):
    id         : uuid.UUID
    created_at : datetime
    updated_at : datetime


# ============================================================
# Student (core)
# ============================================================
class StudentBase(BaseModel):
    name          : str            = Field(..., max_length=255)
    national_id   : Optional[str]  = Field(None, max_length=14)
    faculty_id    : str            = Field(..., max_length=20)
    department_id : Optional[str]  = Field(None, max_length=20)
    level         : int            = Field(..., ge=1, le=7)
    regulation    : str            = Field("لائحة جديدة", max_length=100)  # Accept any regulation value from DB
    gpa           : Optional[float] = Field(None, ge=0.0, le=5.0)
    phone         : Optional[str]  = Field(None, max_length=20)
    email         : Optional[str]  = None
    city          : Optional[str]  = Field(None, max_length=100)
    status        : str            = Field("مقيد")  # Accept any status value from DB
    fees_status   : str            = Field("غير مسدد")  # Accept any fees_status value from DB

class StudentCreate(StudentBase):
    student_id : str = Field(..., max_length=20)

class StudentUpdate(BaseModel):
    name          : Optional[str]   = None
    national_id   : Optional[str]   = None
    faculty_id    : Optional[str]   = None
    department_id : Optional[str]   = None
    level         : Optional[int]   = Field(None, ge=1, le=7)
    regulation    : Optional[str]   = None
    gpa           : Optional[float] = Field(None, ge=0.0, le=5.0)
    phone         : Optional[str]   = None
    email         : Optional[str]   = None
    city          : Optional[str]   = None
    status        : Optional[str]   = None
    fees_status   : Optional[str]   = None

class StudentResponse(StudentCreate, OrmBase):
    faculty_name    : Optional[str] = None
    department_name : Optional[str] = None
    created_at      : datetime
    updated_at      : datetime

class StudentWithProfileResponse(StudentResponse):
    profile : Optional[StudentProfileResponse] = None


# ============================================================
# Course
# ============================================================
class CourseBase(BaseModel):
    name              : str            = Field(..., max_length=255)
    name_en           : Optional[str]  = None
    level             : int            = Field(..., ge=1, le=7)
    department_id     : Optional[str]  = Field(None, max_length=20)
    program_id        : Optional[str]  = Field(None, max_length=30)
    credit_hours      : int            = Field(3, ge=0, le=12)  # Allow 0 for some courses
    course_type       : str            = Field("إجباري", max_length=100)  # Accept any value from DB
    semester          : Optional[str]  = Field(None, max_length=100)  # Accept any semester value
    theoretical_hours : Optional[int]  = None
    practical_hours   : Optional[int]  = None
    max_capacity      : Optional[int]  = None
    faculty_id        : Optional[str]  = Field(None, max_length=20)

class CourseCreate(CourseBase):
    id: str = Field(..., max_length=20, description="e.g. 'CS101'")

class CourseUpdate(BaseModel):
    name          : Optional[str] = None
    level         : Optional[int] = Field(None, ge=1, le=7)
    department_id : Optional[str] = None
    credit_hours  : Optional[int] = None
    course_type   : Optional[str] = None
    semester      : Optional[str] = None
    max_capacity  : Optional[int] = None

class CourseResponse(CourseCreate, OrmBase):
    created_at : datetime
    updated_at : datetime


# ============================================================
# CoursePrerequisite
# ============================================================
class CoursePrerequisiteCreate(BaseModel):
    course_id       : str = Field(..., max_length=20)
    prerequisite_id : str = Field(..., max_length=20)

class CoursePrerequisiteResponse(CoursePrerequisiteCreate, OrmBase):
    pass


# ============================================================
# CourseEquivalence
# ============================================================
class CourseEquivalenceBase(BaseModel):
    student_id           : str = Field(..., max_length=20)
    original_course_id   : str = Field(..., max_length=20)
    equivalent_course_id : str = Field(..., max_length=20)
    status               : str = "قيد المراجعة"

class CourseEquivalenceCreate(CourseEquivalenceBase):
    pass

class CourseEquivalenceResponse(CourseEquivalenceBase, OrmBase):
    id         : int
    created_at : datetime


# ============================================================
# Enrollment
# ============================================================
class EnrollmentBase(BaseModel):
    faculty_id : Optional[str] = Field(None, max_length=20)
    student_id : str = Field(..., max_length=20)
    course_id  : str = Field(..., max_length=20)
    semester   : str = Field(..., max_length=50)
    status     : str = Field("مسجل", pattern="^(مسجل|منسحب|مؤجل|معلق)$")

class EnrollmentCreate(EnrollmentBase):
    pass

class EnrollmentUpdate(BaseModel):
    status: str = Field(..., pattern="^(مسجل|منسحب|مؤجل|معلق)$")

class EnrollmentResponse(EnrollmentBase, OrmBase):
    id          : int
    enrolled_at : datetime
    updated_at  : datetime


# ============================================================
# Grade
# ============================================================
class GradeBase(BaseModel):
    faculty_id   : Optional[str]   = Field(None, max_length=20)
    student_id   : str            = Field(..., max_length=20)
    course_id    : str            = Field(..., max_length=20)
    semester     : str            = Field(..., max_length=50)
    midterm      : Optional[float] = Field(None, ge=0)
    final_exam   : Optional[float] = Field(None, ge=0)
    assignments  : Optional[float] = Field(None, ge=0)
    oral         : Optional[float] = Field(None, ge=0)
    practical    : Optional[float] = Field(None, ge=0)
    total        : Optional[float] = Field(None, ge=0, le=100)
    grade_letter : Optional[str]  = Field(None, max_length=5)
    grade_points : Optional[float] = Field(None, ge=0, le=4.0)

class GradeCreate(GradeBase):
    pass

class GradeUpdate(BaseModel):
    midterm      : Optional[float] = None
    final_exam   : Optional[float] = None
    assignments  : Optional[float] = None
    oral         : Optional[float] = None
    practical    : Optional[float] = None
    total        : Optional[float] = None
    grade_letter : Optional[str]   = None
    grade_points : Optional[float] = None

class GradeResponse(GradeBase, OrmBase):
    id         : int
    created_at : datetime
    updated_at : datetime


# ============================================================
# Room
# ============================================================
class RoomBase(BaseModel):
    faculty_id  : Optional[str]  = Field(None, max_length=20)
    code        : str            = Field(..., max_length=20)
    name        : str            = Field(..., max_length=100)
    room_type   : str            = Field(..., pattern="^(classroom|lab)$")
    capacity    : int            = Field(0, ge=0)
    building    : Optional[str]  = None
    floor       : Optional[int]  = None
    description : Optional[str]  = None
    equipment   : Optional[List[str]] = None
    status      : str            = Field("available", pattern="^(available|maintenance|reserved)$")

class RoomCreate(RoomBase):
    id: str = Field(..., max_length=30, description="e.g. 'room_101b', 'lab_201'")

class RoomUpdate(BaseModel):
    capacity    : Optional[int]        = None
    description : Optional[str]        = None
    equipment   : Optional[List[str]]  = None
    status      : Optional[str]        = None

class RoomResponse(RoomCreate, OrmBase):
    created_at : datetime
    updated_at : datetime


# ============================================================
# CourseSchedule
# ============================================================
class CourseScheduleBase(BaseModel):
    faculty_id    : Optional[str]  = Field(None, max_length=20)
    course_id     : str            = Field(..., max_length=20)
    room_id       : Optional[str]  = Field(None, max_length=30)
    session_type  : str            = Field(..., pattern="^(محاضرة|سكشن|معمل)$")
    day           : str            = Field(..., max_length=20)
    time_label    : Optional[str]  = Field(None, max_length=30)
    instructor    : Optional[str]  = Field(None, max_length=255)
    semester      : Optional[str]  = None
    group_label   : Optional[str]  = Field(None, max_length=10)
    enrolled_count: int            = 0

class CourseScheduleCreate(CourseScheduleBase):
    pass

class CourseScheduleUpdate(BaseModel):
    room_id       : Optional[str] = None
    instructor    : Optional[str] = None
    enrolled_count: Optional[int] = None
    day           : Optional[str] = None
    time_label    : Optional[str] = None

class CourseScheduleResponse(CourseScheduleBase, OrmBase):
    id         : int
    created_at : datetime
    updated_at : datetime


# ============================================================
# Schedule Generation & Conflict Detection
# ============================================================
class ConflictCheckRequest(BaseModel):
    room_id: str = Field(..., max_length=30)
    day: str = Field(..., max_length=20)
    time_start: Optional[str] = Field(None, max_length=10)
    time_end: Optional[str] = Field(None, max_length=10)
    exclude_id: Optional[int] = None

class ScheduleConflict(BaseModel):
    schedule_id: int
    course_id: str
    faculty_id: Optional[str]
    day: str
    time_label: Optional[str]

class ConflictCheckResponse(BaseModel):
    has_conflict: bool
    conflicts: List[ScheduleConflict] = []

class BulkScheduleCreateRequest(BaseModel):
    schedules: List[CourseScheduleCreate] = Field(..., min_length=1)

class BulkScheduleCreateResponse(BaseModel):
    created: int
    rows: List[CourseScheduleResponse] = []

class ScheduleAutoGenerateRequest(BaseModel):
    faculty_id: Optional[str] = None
    semester: Optional[str] = "الفصل الأول 2024/2025"
    academic_year: Optional[str] = None
    dry_run: bool = True


# ============================================================
# AttendanceRecord
# ============================================================
class AttendanceBase(BaseModel):
    faculty_id      : Optional[str]  = Field(None, max_length=20)
    student_id      : str            = Field(..., max_length=20)
    course_id       : str            = Field(..., max_length=20)
    schedule_id     : Optional[int]  = None
    session_type    : Optional[str]  = None
    week_number     : Optional[int]  = Field(None, ge=1, le=20)
    attendance_date : date
    status          : str            = Field(..., pattern="^(حاضر|غائب|متأخر|معذور)$")
    notes           : Optional[str]  = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceBulkCreate(BaseModel):
    records: List[AttendanceCreate]

class AttendanceUpdate(BaseModel):
    status : str = Field(..., pattern="^(حاضر|غائب|متأخر|معذور)$")
    notes  : Optional[str] = None

class AttendanceResponse(AttendanceBase, OrmBase):
    id          : int
    recorded_at : datetime


# ============================================================
# FinancialRecord
# ============================================================
class FinancialRecordBase(BaseModel):
    faculty_id    : Optional[str]  = Field(None, max_length=20)
    student_id    : str            = Field(..., max_length=20)
    fee_type      : str            = Field(..., max_length=100)
    description   : Optional[str]  = None
    semester      : Optional[str]  = None
    academic_year : Optional[str]  = None
    amount        : float          = Field(0, ge=0)
    paid_amount   : float          = Field(0, ge=0)
    due_date      : Optional[date] = None
    payment_date  : Optional[date] = None
    receipt_no    : Optional[str]  = None
    status        : str            = Field("غير مسدد", pattern="^(مسدد|غير مسدد|مسدد جزئياً)$")

class FinancialRecordCreate(FinancialRecordBase):
    pass

class FinancialRecordUpdate(BaseModel):
    paid_amount  : Optional[float] = None
    payment_date : Optional[date]  = None
    receipt_no   : Optional[str]   = None
    status       : Optional[str]   = None

class FinancialRecordResponse(FinancialRecordBase, OrmBase):
    id         : int
    created_at : datetime
    updated_at : datetime


# ============================================================
# Committee
# ============================================================
class CommitteeBase(BaseModel):
    faculty_id        : Optional[str]  = Field(None, max_length=20)
    name              : str            = Field(..., max_length=255)
    course_id         : Optional[str]  = None
    room_id           : str            = Field(..., max_length=30)
    capacity          : int            = Field(..., ge=1)
    exam_date         : Optional[date] = None
    exam_time         : Optional[time] = None
    supervisor        : Optional[str]  = None
    status            : str            = Field("active", pattern="^(active|completed|cancelled)$")
    seating_rows      : Optional[int]  = None
    seating_cols      : Optional[int]  = None
    seating_layout    : Optional[str]  = None
    semester          : Optional[str]  = None

class CommitteeCreate(CommitteeBase):
    pass

class CommitteeUpdate(BaseModel):
    status     : Optional[str]  = None
    supervisor : Optional[str]  = None
    exam_date  : Optional[date] = None
    exam_time  : Optional[time] = None

class CommitteeResponse(CommitteeBase, OrmBase):
    id                : int
    assigned_students : int
    created_at        : datetime
    updated_at        : datetime


# ============================================================
# StudentCommitteeAssignment
# ============================================================
class StudentCommitteeAssignmentBase(BaseModel):
    student_id   : str           = Field(..., max_length=20)
    committee_id : int
    seat_number  : Optional[str] = None
    seat_row     : Optional[int] = None
    seat_column  : Optional[int] = None
    exam_date    : Optional[date] = None
    exam_time    : Optional[time] = None

class StudentCommitteeAssignmentCreate(StudentCommitteeAssignmentBase):
    pass

class StudentCommitteeAssignmentResponse(StudentCommitteeAssignmentBase, OrmBase):
    id         : int
    created_at : datetime


# ============================================================
# RegistrationRequest
# ============================================================
class RegistrationRequestBase(BaseModel):
    faculty_id   : Optional[str]  = Field(None, max_length=20)
    student_id   : str            = Field(..., max_length=20)
    comment      : Optional[str]  = None
    file_path    : Optional[str]  = None

class RegistrationRequestCreate(RegistrationRequestBase):
    id: str = Field(..., max_length=30, description="e.g. 'REQ-2024-001'")

class RegistrationRequestUpdate(BaseModel):
    admin_response : Optional[str] = None
    status         : Optional[str] = Field(None, pattern="^(قيد المراجعة|مقبول|مرفوض)$")

class RegistrationRequestResponse(RegistrationRequestBase, OrmBase):
    id             : str
    request_date   : date
    admin_response : Optional[str] = None
    status         : str
    reviewed_at    : Optional[datetime] = None
    created_at     : datetime
    updated_at     : datetime


# ============================================================
# StudentBlock
# ============================================================
class StudentBlockBase(BaseModel):
    faculty_id   : Optional[str]  = Field(None, max_length=20)
    student_id   : str           = Field(..., max_length=20)
    reason       : str           = Field(..., max_length=255)
    unblock_date : Optional[date] = None
    notes        : Optional[str] = None

class StudentBlockCreate(StudentBlockBase):
    pass

class StudentBlockUpdate(BaseModel):
    status       : Optional[str]  = None
    unblock_date : Optional[date] = None
    notes        : Optional[str]  = None

class StudentBlockResponse(StudentBlockBase, OrmBase):
    id         : int
    block_date : date
    status     : str
    created_at : datetime


# ============================================================
# FeeSetup
# ============================================================
class FeeSetupBase(BaseModel):
    faculty_id    : Optional[str]  = None
    fee_type      : str            = Field(..., max_length=100)
    level         : Optional[str]  = None
    amount        : float          = Field(..., ge=0)
    semester      : Optional[str]  = None
    academic_year : Optional[str]  = None
    status        : str            = Field("نشط", pattern="^(نشط|غير نشط)$")

class FeeSetupCreate(FeeSetupBase):
    pass

class FeeSetupUpdate(BaseModel):
    amount  : Optional[float] = None
    status  : Optional[str]   = None

class FeeSetupResponse(FeeSetupBase, OrmBase):
    id         : int
    created_at : datetime
    updated_at : datetime


# ============================================================
# CourseClose
# ============================================================
class CourseCloseBase(BaseModel):
    course_code   : str            = Field(..., max_length=20)
    academic_year : str            = Field(..., max_length=20)
    semester      : str            = Field(..., max_length=50)
    closure_date  : date
    status        : str            = Field("مكتمل", max_length=50)

class CourseCloseCreate(CourseCloseBase):
    pass

class CourseCloseUpdate(BaseModel):
    course_code   : Optional[str]  = None
    academic_year : Optional[str]  = None
    semester      : Optional[str]  = None
    closure_date  : Optional[date] = None
    status        : Optional[str]  = None

class CourseCloseResponse(CourseCloseBase, OrmBase):
    id           : int
    faculty_id   : Optional[str] = None
    course_name  : Optional[str] = None
    created_at   : datetime
    updated_at   : datetime


# ============================================================
# ReportSignature
# ============================================================
class ReportSignatureBase(BaseModel):
    faculty_id     : Optional[str] = Field(None, max_length=20)
    report_name    : str = Field(..., max_length=255)
    signatory_name : str = Field(..., max_length=255)
    title          : str = Field(..., max_length=255)
    order          : int = Field(1, ge=1)
    is_active      : bool = True

class ReportSignatureCreate(ReportSignatureBase):
    id: str = Field(..., max_length=30)

class ReportSignatureUpdate(BaseModel):
    report_name    : Optional[str] = None
    signatory_name : Optional[str] = None
    title          : Optional[str] = None
    order          : Optional[int] = None
    is_active      : Optional[bool] = None

class ReportSignatureResponse(ReportSignatureBase, OrmBase):
    id         : str
    created_at : datetime
    updated_at : datetime


# ============================================================
# SystemSetting
# ============================================================
class SystemSettingBase(BaseModel):
    faculty_id  : Optional[str] = Field(None, max_length=20)
    name        : str = Field(..., max_length=255)
    value       : str = Field(..., max_length=255)
    description : Optional[str] = Field(None, max_length=500)
    category    : str = Field("General", max_length=50)
    status      : str = Field("Active", max_length=50)

class SystemSettingCreate(SystemSettingBase):
    id: str = Field(..., max_length=50)

class SystemSettingUpdate(BaseModel):
    name        : Optional[str] = None
    value       : Optional[str] = None
    description : Optional[str] = None
    category    : Optional[str] = None
    status      : Optional[str] = None

class SystemSettingResponse(SystemSettingBase, OrmBase):
    id         : str
    created_at : datetime
    updated_at : datetime

# Simple alias for router
SystemSetting = SystemSettingResponse


# ============================================================
# AcademicProgram
# ============================================================
class AcademicProgramBase(BaseModel):
    name                    : str            = Field(..., max_length=255)
    name_en                 : Optional[str]  = Field(None, max_length=255)
    code                    : str            = Field(..., max_length=20)
    degree                  : str            = Field("بكالوريوس", max_length=50)
    department_id           : str            = Field(..., max_length=20)
    faculty_id              : str            = Field(..., max_length=20)
    total_hours             : int            = 140
    mandatory_hours         : int            = 0
    elective_hours          : int            = 0
    university_requirements : int            = 0
    tracks                  : Optional[List[Dict[str, Any]]] = None

class AcademicProgramCreate(AcademicProgramBase):
    id: str = Field(..., max_length=30)

class AcademicProgramUpdate(BaseModel):
    name                    : Optional[str] = None
    name_en                 : Optional[str] = None
    code                    : Optional[str] = None
    degree                  : Optional[str] = None
    department_id           : Optional[str] = None
    total_hours             : Optional[int] = None
    mandatory_hours         : Optional[int] = None
    elective_hours          : Optional[int] = None
    university_requirements : Optional[int] = None
    tracks                  : Optional[List[Dict[str, Any]]] = None

class AcademicProgramResponse(AcademicProgramBase, OrmBase):
    id         : str
    created_at : datetime
    updated_at : datetime


# ============================================================
# StudyRegulation
# ============================================================
class StudyRegulationBase(BaseModel):
    name                    : str            = Field(..., max_length=255)
    program_id              : str            = Field(..., max_length=30)
    registration_rules      : Optional[str]  = None
    pass_fail_rules         : Optional[str]  = None
    absence_policy          : Optional[str]  = None
    mandatory_hours         : int            = 0
    elective_hours          : int            = 0
    university_requirements : int            = 0

class StudyRegulationCreate(StudyRegulationBase):
    id: str = Field(..., max_length=30)

class StudyRegulationUpdate(BaseModel):
    name                    : Optional[str]  = None
    program_id              : Optional[str]  = None
    registration_rules      : Optional[str]  = None
    pass_fail_rules         : Optional[str]  = None
    absence_policy          : Optional[str]  = None
    mandatory_hours         : Optional[int]  = None
    elective_hours          : Optional[int]  = None
    university_requirements : Optional[int]  = None

class StudyRegulationResponse(StudyRegulationBase, OrmBase):
    id         : str
    created_at : datetime
    updated_at : datetime


# ============================================================
# AcademicRule
# ============================================================
class AcademicRuleBase(BaseModel):
    faculty_id  : str = Field(..., max_length=20)
    rule_name   : str = Field(..., max_length=255)
    description : Optional[str] = Field(None, max_length=500)
    rules_data  : Dict[str, Any]

class AcademicRuleCreate(AcademicRuleBase):
    id: str = Field(..., max_length=30)

class AcademicRuleUpdate(BaseModel):
    rule_name   : Optional[str] = None
    description : Optional[str] = None
    rules_data  : Optional[Dict[str, Any]] = None

class AcademicRuleResponse(AcademicRuleBase, OrmBase):
    id         : str
    created_at : datetime
    updated_at : datetime


# ============================================================
# StudentRequirement
# ============================================================
class StudentRequirementBase(BaseModel):
    student_id      : str           = Field(..., max_length=20)
    requirement_key : str           = Field(..., max_length=50)
    status          : str           = Field("pending", pattern="^(pending|submitted|verified)$")
    notes           : Optional[str] = None

class StudentRequirementCreate(StudentRequirementBase):
    pass

class StudentRequirementUpdate(BaseModel):
    status : Optional[str] = Field(None, pattern="^(pending|submitted|verified)$")
    notes  : Optional[str] = None

class StudentRequirementResponse(StudentRequirementBase, OrmBase):
    id         : int
    updated_at : datetime


# ============================================================
# StudentDocument
# ============================================================
class StudentDocumentBase(BaseModel):
    student_id : str           = Field(..., max_length=20)
    type       : str           = Field(..., max_length=50)
    title      : str           = Field(..., max_length=255)
    filename   : Optional[str] = None
    mime_type  : Optional[str] = None
    size       : Optional[int] = None
    data_url   : str

class StudentDocumentCreate(StudentDocumentBase):
    pass

class StudentDocumentResponse(StudentDocumentBase, OrmBase):
    id          : int
    uploaded_at : datetime


# ============================================================
# ActivityLog
# ============================================================
class ActivityLogBase(BaseModel):
    user_id      : Optional[uuid.UUID] = None
    faculty_id   : Optional[str]      = None
    entity_type  : str                = Field(..., max_length=50)
    entity_id    : Optional[str]      = None
    action       : str                = Field(..., max_length=100)
    description  : Optional[str]      = None

class ActivityLogCreate(ActivityLogBase):
    pass

class ActivityLogResponse(ActivityLogBase, OrmBase):
    id           : int
    performed_at : datetime


# ============================================================
# Pagination helper
# ============================================================
class PaginatedResponse(BaseModel):
    total   : int
    page    : int
    size    : int
    results : list


# ============================================================
# Staff (Instructors)
# ============================================================
class StaffBase(BaseModel):
    name            : str = Field(..., max_length=255)
    email           : Optional[EmailStr] = None
    phone           : Optional[str] = None
    faculty_id      : str = Field(..., max_length=20)
    department_id   : Optional[str] = None
    specialization  : Optional[str] = None
    title           : Optional[str] = None
    office_location : Optional[str] = None
    status          : str = Field(default='فعال', max_length=50)

class StaffCreate(StaffBase):
    pass

class StaffUpdate(BaseModel):
    name            : Optional[str] = None
    email           : Optional[EmailStr] = None
    phone           : Optional[str] = None
    specialization  : Optional[str] = None
    title           : Optional[str] = None
    office_location : Optional[str] = None
    status          : Optional[str] = None

class StaffResponse(StaffBase, OrmBase):
    id              : str
    created_at      : datetime
    updated_at      : datetime


# ============================================================
# Academic Calendar
# ============================================================
class AcademicCalendarBase(BaseModel):
    event_name      : str = Field(..., max_length=255)
    event_type      : str = Field(..., max_length=50)
    start_date      : date
    end_date        : Optional[date] = None
    faculty_id      : Optional[str] = None
    academic_year   : Optional[str] = None
    description     : Optional[str] = None

class AcademicCalendarCreate(AcademicCalendarBase):
    pass

class AcademicCalendarUpdate(BaseModel):
    event_name      : Optional[str] = None
    event_type      : Optional[str] = None
    start_date      : Optional[date] = None
    end_date        : Optional[date] = None
    academic_year   : Optional[str] = None
    description     : Optional[str] = None

class AcademicCalendarResponse(AcademicCalendarBase, OrmBase):
    id              : uuid.UUID
    created_at      : datetime
    updated_at      : datetime


# ============================================================
# Announcements
# ============================================================
class AnnouncementBase(BaseModel):
    title           : str = Field(..., max_length=255)
    body            : str
    faculty_id      : Optional[str] = None
    role_target     : Optional[str] = None
    priority        : str = Field(default='عادي', max_length=20)
    expires_at      : Optional[datetime] = None

class AnnouncementCreate(AnnouncementBase):
    pass

class AnnouncementUpdate(BaseModel):
    title           : Optional[str] = None
    body            : Optional[str] = None
    priority        : Optional[str] = None
    expires_at      : Optional[datetime] = None
    is_active       : Optional[bool] = None

class AnnouncementResponse(AnnouncementBase, OrmBase):
    id              : uuid.UUID
    is_active       : bool
    created_at      : datetime
    updated_at      : datetime
