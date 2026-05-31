"""
DUMLIS - SQLAlchemy ORM Models
Maps to PostgreSQL schema in schema.sql
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, time
from typing import List, Optional

from sqlalchemy import (
    BigInteger, Boolean, CheckConstraint, Column, Date, DateTime,
    ForeignKey, Index, Integer, Numeric, SmallInteger, String, Text, Time,
    UniqueConstraint, func, ARRAY
)
from sqlalchemy.dialects.postgresql import UUID, INET, CITEXT, JSONB
from sqlalchemy.orm import DeclarativeBase, relationship, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


# ---------------------------------------------------------------------------
# Faculty
# ---------------------------------------------------------------------------
class Faculty(Base):
    __tablename__ = "faculties"

    id            : Mapped[str]              = mapped_column(String(20), primary_key=True)
    name          : Mapped[str]              = mapped_column(String(255), nullable=False)
    name_en       : Mapped[Optional[str]]    = mapped_column(String(255))
    icon          : Mapped[Optional[str]]    = mapped_column(String(10))
    student_count : Mapped[int]              = mapped_column(Integer, default=0)
    staff_count   : Mapped[int]              = mapped_column(Integer, default=0)
    color         : Mapped[Optional[str]]    = mapped_column(String(100))
    created_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # relationships
    departments   : Mapped[List["Department"]]    = relationship(back_populates="faculty", cascade="all, delete-orphan")
    students      : Mapped[List["Student"]]        = relationship(back_populates="faculty")
    users         : Mapped[List["User"]]           = relationship(back_populates="faculty")
    fee_setups    : Mapped[List["FeeSetup"]]       = relationship(back_populates="faculty", cascade="all, delete-orphan")
    staff         : Mapped[List["Staff"]]          = relationship(back_populates="faculty")
    calendar_events : Mapped[List["AcademicCalendar"]] = relationship(back_populates="faculty")
    announcements : Mapped[List["Announcement"]]  = relationship(back_populates="faculty")


# ---------------------------------------------------------------------------
# Department
# ---------------------------------------------------------------------------
class Department(Base):
    __tablename__ = "departments"
    __table_args__ = (
        UniqueConstraint("faculty_id", "code"),
    )

    id          : Mapped[str]              = mapped_column(String(20), primary_key=True)
    faculty_id  : Mapped[str]              = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"), nullable=False)
    name        : Mapped[str]              = mapped_column(String(255), nullable=False)
    name_en     : Mapped[Optional[str]]    = mapped_column(String(255))
    code        : Mapped[str]              = mapped_column(String(20), nullable=False)
    head_name   : Mapped[Optional[str]]    = mapped_column(String(255))
    created_at  : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at  : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    faculty     : Mapped["Faculty"]            = relationship(back_populates="departments")
    courses     : Mapped[List["Course"]]        = relationship(back_populates="department")
    students    : Mapped[List["Student"]]       = relationship(back_populates="department")
    programs    : Mapped[List["AcademicProgram"]] = relationship(back_populates="department", cascade="all, delete-orphan")
    staff       : Mapped[List["Staff"]]         = relationship(back_populates="department")

    @property
    def student_count(self) -> int:
        return len(self.students)

    @property
    def course_count(self) -> int:
        return len(self.courses)

    @property
    def program_count(self) -> int:
        return len(self.programs)


# ---------------------------------------------------------------------------
# AcademicProgram
# ---------------------------------------------------------------------------
class AcademicProgram(Base):
    __tablename__ = "programs"

    id                     : Mapped[str]           = mapped_column(String(30), primary_key=True)
    name                   : Mapped[str]           = mapped_column(String(255), nullable=False)
    name_en                : Mapped[Optional[str]] = mapped_column(String(255))
    code                   : Mapped[str]           = mapped_column(String(20), nullable=False)
    degree                 : Mapped[str]           = mapped_column(String(50), default="بكالوريوس")
    department_id          : Mapped[str]           = mapped_column(String(20), ForeignKey("departments.id", ondelete="CASCADE"), nullable=False)
    faculty_id             : Mapped[Optional[str]] = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    total_hours            : Mapped[int]           = mapped_column(SmallInteger, default=140)
    mandatory_hours        : Mapped[int]           = mapped_column(SmallInteger, default=0)
    elective_hours         : Mapped[int]           = mapped_column(SmallInteger, default=0)
    university_requirements: Mapped[int]           = mapped_column(SmallInteger, default=0)
    tracks                 : Mapped[Optional[dict]]= mapped_column(JSONB)
    created_at             : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())
    updated_at             : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    department : Mapped["Department"] = relationship(back_populates="programs")
    regulations: Mapped[List["StudyRegulation"]] = relationship(back_populates="program", cascade="all, delete-orphan")
    courses    : Mapped[List["Course"]] = relationship(back_populates="program")


# ---------------------------------------------------------------------------
# StudyRegulation
# ---------------------------------------------------------------------------
class StudyRegulation(Base):
    __tablename__ = "study_regulations"

    id                     : Mapped[str]           = mapped_column(String(30), primary_key=True)
    name                   : Mapped[str]           = mapped_column(String(255), nullable=False)
    program_id             : Mapped[str]           = mapped_column(String(30), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False)
    registration_rules     : Mapped[Optional[str]] = mapped_column(Text)
    pass_fail_rules        : Mapped[Optional[str]] = mapped_column(Text)
    absence_policy         : Mapped[Optional[str]] = mapped_column(Text)
    mandatory_hours        : Mapped[int]           = mapped_column(SmallInteger, default=0)
    elective_hours         : Mapped[int]           = mapped_column(SmallInteger, default=0)
    university_requirements: Mapped[int]           = mapped_column(SmallInteger, default=0)
    created_at             : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())
    updated_at             : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    program : Mapped["AcademicProgram"] = relationship(back_populates="regulations")


# ---------------------------------------------------------------------------
# AcademicRule (Faculty-level JSON tree configs)
# ---------------------------------------------------------------------------
class AcademicRule(Base):
    __tablename__ = "academic_rules"

    id          : Mapped[str]           = mapped_column(String(30), primary_key=True)
    faculty_id  : Mapped[str]           = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"), nullable=False)
    rule_name   : Mapped[str]           = mapped_column(String(255), nullable=False)
    description : Mapped[Optional[str]] = mapped_column(String(500))
    rules_data  : Mapped[dict]          = mapped_column(JSONB, nullable=False)
    created_at  : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())
    updated_at  : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("role IN ('super_admin','faculty_admin','student_affairs','student')", name="ck_user_role"),
    )

    id              : Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username        : Mapped[str]              = mapped_column(CITEXT, nullable=False, unique=True)
    email           : Mapped[str]              = mapped_column(CITEXT, nullable=False, unique=True)
    hashed_password : Mapped[str]              = mapped_column(String(255), nullable=False)
    role            : Mapped[str]              = mapped_column(String(30), nullable=False)
    faculty_id      : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="SET NULL"))
    is_active       : Mapped[bool]             = mapped_column(Boolean, default=True)
    created_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    faculty         : Mapped[Optional["Faculty"]]   = relationship(back_populates="users")
    student         : Mapped[Optional["Student"]]   = relationship(back_populates="user")


# ---------------------------------------------------------------------------
# Student (core academic record)
# ---------------------------------------------------------------------------
class Student(Base):
    __tablename__ = "students"

    student_id    : Mapped[str]              = mapped_column(String(20), primary_key=True)
    user_id       : Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    name          : Mapped[str]              = mapped_column(String(255), nullable=False)
    national_id   : Mapped[Optional[str]]    = mapped_column(String(14), unique=True)
    faculty_id    : Mapped[str]              = mapped_column(String(20), ForeignKey("faculties.id"), nullable=False)
    department_id : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("departments.id"))
    level         : Mapped[int]              = mapped_column(SmallInteger, nullable=False)
    regulation    : Mapped[str]              = mapped_column(String(50), default="لائحة جديدة")
    gpa           : Mapped[Optional[float]]  = mapped_column(Numeric(4, 2))
    phone         : Mapped[Optional[str]]    = mapped_column(String(20))
    email         : Mapped[Optional[str]]    = mapped_column(CITEXT)
    city          : Mapped[Optional[str]]    = mapped_column(String(100))
    status        : Mapped[str]              = mapped_column(String(30), default="مقيد")
    fees_status   : Mapped[str]              = mapped_column(String(30), default="غير مسدد")
    graduation_year : Mapped[Optional[int]]  = mapped_column(Integer)
    level_change_date : Mapped[Optional[datetime]] = mapped_column(DateTime)
    gpa_mod_status   : Mapped[Optional[str]]    = mapped_column(String(50))
    gpa_mod_reason   : Mapped[Optional[str]]    = mapped_column(Text)
    level_mod_status : Mapped[Optional[str]]    = mapped_column(String(50))
    level_mod_reason : Mapped[Optional[str]]    = mapped_column(Text)
    survey_status : Mapped[Optional[str]]    = mapped_column(String(50))
    id_card_status : Mapped[Optional[str]]   = mapped_column(String(50))
    created_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    @property
    def faculty_name(self) -> str:
        return self.faculty.name if self.faculty else self.faculty_id

    @property
    def department_name(self) -> Optional[str]:
        return self.department.name if self.department else (self.department_id or "عام")

    user          : Mapped[Optional["User"]]              = relationship(back_populates="student")
    faculty       : Mapped["Faculty"]                      = relationship(back_populates="students")
    department    : Mapped[Optional["Department"]]         = relationship(back_populates="students")
    profile       : Mapped[Optional["StudentProfile"]]     = relationship(back_populates="student", cascade="all, delete-orphan", uselist=False)
    enrollments   : Mapped[List["Enrollment"]]             = relationship(back_populates="student", cascade="all, delete-orphan")
    grades        : Mapped[List["Grade"]]                  = relationship(back_populates="student", cascade="all, delete-orphan")
    attendance    : Mapped[List["AttendanceRecord"]]        = relationship(back_populates="student", cascade="all, delete-orphan")
    financial     : Mapped[List["FinancialRecord"]]         = relationship(back_populates="student", cascade="all, delete-orphan")
    committee_assignments : Mapped[List["StudentCommitteeAssignment"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    registration_requests : Mapped[List["RegistrationRequest"]]       = relationship(back_populates="student", cascade="all, delete-orphan")
    blocks        : Mapped[List["StudentBlock"]]            = relationship(back_populates="student", cascade="all, delete-orphan")
    course_equivalences : Mapped[List["CourseEquivalence"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    requirements        : Mapped[List["StudentRequirement"]] = relationship(back_populates="student", cascade="all, delete-orphan")
    documents           : Mapped[List["StudentDocument"]]    = relationship(back_populates="student", cascade="all, delete-orphan")


# ---------------------------------------------------------------------------
# StudentProfile (detailed personal data - 1:1 with Student)
# ---------------------------------------------------------------------------
class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id                  : Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id          : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False, unique=True)
    name_en             : Mapped[Optional[str]]    = mapped_column(String(255))
    birth_date          : Mapped[Optional[date]]   = mapped_column(Date)
    birth_place         : Mapped[Optional[str]]    = mapped_column(String(100))
    nationality         : Mapped[Optional[str]]    = mapped_column(String(100), default="مصري")
    religion            : Mapped[Optional[str]]    = mapped_column(String(50))
    gender              : Mapped[Optional[str]]    = mapped_column(String(20))
    photo_url           : Mapped[Optional[str]]    = mapped_column(String(500))
    address_governorate : Mapped[Optional[str]]    = mapped_column(String(100))
    address_city        : Mapped[Optional[str]]    = mapped_column(String(100))
    address_street      : Mapped[Optional[str]]    = mapped_column(String(255))
    address_building    : Mapped[Optional[str]]    = mapped_column(String(20))
    address_details     : Mapped[Optional[str]]    = mapped_column(String(500))
    guardian_name       : Mapped[Optional[str]]    = mapped_column(String(255))
    guardian_relation   : Mapped[Optional[str]]    = mapped_column(String(50))
    guardian_phone      : Mapped[Optional[str]]    = mapped_column(String(20))
    guardian_job        : Mapped[Optional[str]]    = mapped_column(String(100))
    guardian_national_id: Mapped[Optional[str]]    = mapped_column(String(14))
    qual_type           : Mapped[Optional[str]]    = mapped_column(String(50))
    qual_year           : Mapped[Optional[str]]    = mapped_column(String(10))
    school_name         : Mapped[Optional[str]]    = mapped_column(String(255))
    seat_number         : Mapped[Optional[str]]    = mapped_column(String(20))
    total_degree        : Mapped[Optional[float]]  = mapped_column(Numeric(6, 2))
    percentage          : Mapped[Optional[float]]  = mapped_column(Numeric(5, 2))
    division            : Mapped[Optional[str]]    = mapped_column(String(50))
    qual_date           : Mapped[Optional[date]]   = mapped_column(Date)
    military_status     : Mapped[Optional[str]]    = mapped_column(String(50))
    triple_number       : Mapped[Optional[str]]    = mapped_column(String(50))
    postponement_date   : Mapped[Optional[date]]   = mapped_column(Date)
    postponement_reason : Mapped[Optional[str]]    = mapped_column(String(255))
    military_notes      : Mapped[Optional[str]]    = mapped_column(Text)
    mil_edu_status      : Mapped[Optional[str]]    = mapped_column(String(30))
    mil_edu_completion  : Mapped[Optional[date]]   = mapped_column(Date)
    mil_edu_notes       : Mapped[Optional[str]]    = mapped_column(Text)
    medical_status      : Mapped[Optional[str]]    = mapped_column(String(30))
    vaccination_status  : Mapped[Optional[str]]    = mapped_column(String(30))
    blood_type          : Mapped[Optional[str]]    = mapped_column(String(5))
    created_at          : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at          : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student    : Mapped["Student"] = relationship(back_populates="profile")


# ---------------------------------------------------------------------------
# Course
# ---------------------------------------------------------------------------
class Course(Base):
    __tablename__ = "courses"

    id               : Mapped[str]              = mapped_column(String(20), primary_key=True)
    name             : Mapped[str]              = mapped_column(String(255), nullable=False)
    name_en          : Mapped[Optional[str]]    = mapped_column(String(255))
    level            : Mapped[int]              = mapped_column(SmallInteger, nullable=False)
    department_id    : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("departments.id"))
    program_id       : Mapped[Optional[str]]    = mapped_column(String(30), ForeignKey("programs.id", ondelete="SET NULL"))
    faculty_id       : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="SET NULL"))
    credit_hours     : Mapped[int]              = mapped_column(SmallInteger, default=3)
    course_type      : Mapped[str]              = mapped_column(String(30), default="إجباري")
    semester         : Mapped[Optional[str]]    = mapped_column(String(30))
    theoretical_hours: Mapped[Optional[int]]    = mapped_column(SmallInteger, default=2)
    practical_hours  : Mapped[Optional[int]]    = mapped_column(SmallInteger, default=1)
    max_capacity     : Mapped[Optional[int]]    = mapped_column(Integer)
    created_at       : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at       : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    department       : Mapped[Optional["Department"]]   = relationship(back_populates="courses")
    program          : Mapped[Optional["AcademicProgram"]] = relationship(back_populates="courses")
    enrollments      : Mapped[List["Enrollment"]]        = relationship(back_populates="course", cascade="all, delete-orphan")
    grades           : Mapped[List["Grade"]]             = relationship(back_populates="course", cascade="all, delete-orphan")
    schedules        : Mapped[List["CourseSchedule"]]    = relationship(back_populates="course", cascade="all, delete-orphan")
    attendance       : Mapped[List["AttendanceRecord"]]  = relationship(back_populates="course", cascade="all, delete-orphan")
    equivalences     : Mapped[List["CourseEquivalence"]] = relationship(back_populates="course", foreign_keys="[CourseEquivalence.original_course_id]", cascade="all, delete-orphan")
    closures         : Mapped[List["CourseClose"]]       = relationship(back_populates="course", cascade="all, delete-orphan")


# ---------------------------------------------------------------------------
# CoursePrerequisite (self-referencing M2M)
# ---------------------------------------------------------------------------
class CoursePrerequisite(Base):
    __tablename__ = "course_prerequisites"

    course_id       : Mapped[str] = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True)
    prerequisite_id : Mapped[str] = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), primary_key=True)


# ---------------------------------------------------------------------------
# CourseEquivalence
# ---------------------------------------------------------------------------
class CourseEquivalence(Base):
    __tablename__ = "course_equivalences"

    id                   : Mapped[int]           = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id           : Mapped[str]           = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    original_course_id   : Mapped[str]           = mapped_column(String(20), ForeignKey("courses.id"), nullable=False)
    equivalent_course_id : Mapped[str]           = mapped_column(String(20), ForeignKey("courses.id"), nullable=False)
    status               : Mapped[str]           = mapped_column(String(30), default="قيد المراجعة")
    created_at           : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now())
    updated_at           : Mapped[datetime]      = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student     : Mapped["Student"] = relationship(back_populates="course_equivalences")
    course      : Mapped["Course"]  = relationship(back_populates="equivalences", foreign_keys=[original_course_id])


# ---------------------------------------------------------------------------
# CourseClose (Track course closures per semester)
# ---------------------------------------------------------------------------
class CourseClose(Base):
    __tablename__ = "course_closures"

    id            : Mapped[int]                            = mapped_column(Integer, primary_key=True, autoincrement=True)
    faculty_id    : Mapped[Optional[str]]                  = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    course_code   : Mapped[str]                            = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    academic_year : Mapped[str]                            = mapped_column(String(20), nullable=False)
    semester      : Mapped[str]                            = mapped_column(String(50), nullable=False)
    closure_date  : Mapped[date]                           = mapped_column(Date, nullable=False)
    status        : Mapped[str]                            = mapped_column(String(50), default="مكتمل")
    created_at    : Mapped[datetime]                       = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at    : Mapped[datetime]                       = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    course        : Mapped["Course"]                       = relationship(back_populates="closures")



# ---------------------------------------------------------------------------
# Enrollment
# ---------------------------------------------------------------------------
class Enrollment(Base):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("student_id", "course_id", "semester"),
    )

    id          : Mapped[int]      = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id  : Mapped[Optional[str]] = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    student_id  : Mapped[str]      = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    course_id   : Mapped[str]      = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    semester    : Mapped[str]      = mapped_column(String(50), nullable=False)
    status      : Mapped[str]      = mapped_column(String(30), default="مسجل")
    enrolled_at : Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at  : Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student     : Mapped["Student"] = relationship(back_populates="enrollments")
    course      : Mapped["Course"]  = relationship(back_populates="enrollments")


# ---------------------------------------------------------------------------
# Grade
# ---------------------------------------------------------------------------
class Grade(Base):
    __tablename__ = "grades"
    __table_args__ = (
        UniqueConstraint("student_id", "course_id", "semester"),
    )

    id           : Mapped[int]             = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id   : Mapped[Optional[str]]   = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    student_id   : Mapped[str]             = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    course_id    : Mapped[str]             = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    semester     : Mapped[str]             = mapped_column(String(50), nullable=False)
    midterm      : Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    final_exam   : Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    assignments  : Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    oral         : Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    practical    : Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    total        : Mapped[Optional[float]] = mapped_column(Numeric(5, 2))
    grade_letter : Mapped[Optional[str]]   = mapped_column(String(5))
    grade_points : Mapped[Optional[float]] = mapped_column(Numeric(3, 1))
    created_at   : Mapped[datetime]        = mapped_column(DateTime, server_default=func.now())
    updated_at   : Mapped[datetime]        = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student      : Mapped["Student"] = relationship(back_populates="grades")
    course       : Mapped["Course"]  = relationship(back_populates="grades")


# ---------------------------------------------------------------------------
# Room (classroom + lab)
# ---------------------------------------------------------------------------
class Room(Base):
    __tablename__ = "rooms"

    id        : Mapped[str]              = mapped_column(String(30), primary_key=True)
    faculty_id: Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    code      : Mapped[str]              = mapped_column(String(20), nullable=False)
    name      : Mapped[str]              = mapped_column(String(100), nullable=False)
    room_type : Mapped[str]              = mapped_column(String(20), nullable=False)
    capacity  : Mapped[int]              = mapped_column(Integer, default=0)
    building  : Mapped[Optional[str]]    = mapped_column(String(10))
    floor     : Mapped[Optional[int]]    = mapped_column(SmallInteger)
    description : Mapped[Optional[str]]  = mapped_column(Text)
    equipment : Mapped[Optional[list]]   = mapped_column(ARRAY(String))
    status    : Mapped[str]              = mapped_column(String(30), default="available")
    created_at: Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    schedules   : Mapped[List["CourseSchedule"]] = relationship(back_populates="room")
    committees  : Mapped[List["Committee"]]       = relationship(back_populates="room")


# ---------------------------------------------------------------------------
# CourseSchedule
# ---------------------------------------------------------------------------
class CourseSchedule(Base):
    __tablename__ = "course_schedules"

    id            : Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id    : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    course_id     : Mapped[str]              = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    room_id       : Mapped[Optional[str]]    = mapped_column(String(30), ForeignKey("rooms.id", ondelete="SET NULL"))
    session_type  : Mapped[str]              = mapped_column(String(30), nullable=False)
    day           : Mapped[str]              = mapped_column(String(20), nullable=False)
    time_start    : Mapped[Optional[time]]   = mapped_column(Time)
    time_end      : Mapped[Optional[time]]   = mapped_column(Time)
    time_label    : Mapped[Optional[str]]    = mapped_column(String(30))
    instructor    : Mapped[Optional[str]]    = mapped_column(String(255))
    semester      : Mapped[Optional[str]]    = mapped_column(String(50))
    group_label   : Mapped[Optional[str]]    = mapped_column(String(10))
    enrolled_count: Mapped[int]              = mapped_column(Integer, default=0)
    created_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    course : Mapped["Course"]        = relationship(back_populates="schedules")
    room   : Mapped[Optional["Room"]] = relationship(back_populates="schedules")


# ---------------------------------------------------------------------------
# AttendanceRecord
# ---------------------------------------------------------------------------
class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint("student_id", "course_id", "attendance_date", "session_type"),
    )

    id              : Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id      : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    student_id      : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    course_id       : Mapped[str]              = mapped_column(String(20), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    schedule_id     : Mapped[Optional[int]]    = mapped_column(BigInteger, ForeignKey("course_schedules.id", ondelete="SET NULL"))
    session_type    : Mapped[Optional[str]]    = mapped_column(String(30))
    week_number     : Mapped[Optional[int]]    = mapped_column(SmallInteger)
    attendance_date : Mapped[date]             = mapped_column(Date, nullable=False)
    status          : Mapped[str]              = mapped_column(String(20), nullable=False)
    notes           : Mapped[Optional[str]]    = mapped_column(Text)
    recorded_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())

    student  : Mapped["Student"] = relationship(back_populates="attendance")
    course   : Mapped["Course"]  = relationship(back_populates="attendance")


# ---------------------------------------------------------------------------
# FinancialRecord
# ---------------------------------------------------------------------------
class FinancialRecord(Base):
    __tablename__ = "financial_records"

    id            : Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    faculty_id    : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    student_id    : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    fee_type      : Mapped[str]              = mapped_column(String(100), nullable=False)
    description   : Mapped[Optional[str]]    = mapped_column(String(255))
    semester      : Mapped[Optional[str]]    = mapped_column(String(50))
    academic_year : Mapped[Optional[str]]    = mapped_column(String(20))
    amount        : Mapped[float]            = mapped_column(Numeric(10, 2), default=0)
    paid_amount   : Mapped[float]            = mapped_column(Numeric(10, 2), default=0)
    due_date      : Mapped[Optional[date]]   = mapped_column(Date)
    payment_date  : Mapped[Optional[date]]   = mapped_column(Date)
    receipt_no    : Mapped[Optional[str]]    = mapped_column(String(50))
    status        : Mapped[str]              = mapped_column(String(30), default="غير مسدد")
    created_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student : Mapped["Student"] = relationship(back_populates="financial")


# ---------------------------------------------------------------------------
# Committee
# ---------------------------------------------------------------------------
class Committee(Base):
    __tablename__ = "committees"

    id                : Mapped[int]              = mapped_column(Integer, primary_key=True, autoincrement=True)
    faculty_id        : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    name              : Mapped[str]              = mapped_column(String(255), nullable=False)
    course_id         : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("courses.id", ondelete="SET NULL"))
    room_id           : Mapped[str]              = mapped_column(String(30), ForeignKey("rooms.id"), nullable=False)
    capacity          : Mapped[int]              = mapped_column(Integer, nullable=False)
    assigned_students : Mapped[int]              = mapped_column(Integer, default=0)
    exam_date         : Mapped[Optional[date]]   = mapped_column(Date)
    exam_time         : Mapped[Optional[time]]   = mapped_column(Time)
    supervisor        : Mapped[Optional[str]]    = mapped_column(String(255))
    status            : Mapped[str]              = mapped_column(String(20), default="active")
    seating_rows      : Mapped[Optional[int]]    = mapped_column(SmallInteger)
    seating_cols      : Mapped[Optional[int]]    = mapped_column(SmallInteger)
    seating_layout    : Mapped[Optional[str]]    = mapped_column(String(20))
    semester          : Mapped[Optional[str]]    = mapped_column(String(50))
    created_at        : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at        : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    room        : Mapped["Room"]                                     = relationship(back_populates="committees")
    assignments : Mapped[List["StudentCommitteeAssignment"]]          = relationship(back_populates="committee", cascade="all, delete-orphan")


# ---------------------------------------------------------------------------
# StudentCommitteeAssignment  (M2M bridge)
# ---------------------------------------------------------------------------
class StudentCommitteeAssignment(Base):
    __tablename__ = "student_committee_assignments"
    __table_args__ = (
        UniqueConstraint("student_id", "committee_id"),
    )

    id           : Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    student_id   : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    committee_id : Mapped[int]              = mapped_column(Integer, ForeignKey("committees.id", ondelete="CASCADE"), nullable=False)
    seat_number  : Mapped[Optional[str]]    = mapped_column(String(20))
    seat_row     : Mapped[Optional[int]]    = mapped_column(SmallInteger)
    seat_column  : Mapped[Optional[int]]    = mapped_column(SmallInteger)
    exam_date    : Mapped[Optional[date]]   = mapped_column(Date)
    exam_time    : Mapped[Optional[time]]   = mapped_column(Time)
    created_at   : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())

    student   : Mapped["Student"]    = relationship(back_populates="committee_assignments")
    committee : Mapped["Committee"]  = relationship(back_populates="assignments")


# ---------------------------------------------------------------------------
# RegistrationRequest
# ---------------------------------------------------------------------------
class RegistrationRequest(Base):
    __tablename__ = "registration_requests"

    id             : Mapped[str]              = mapped_column(String(30), primary_key=True)
    faculty_id     : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    student_id     : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    request_date   : Mapped[date]             = mapped_column(Date, server_default=func.current_date())
    comment        : Mapped[Optional[str]]    = mapped_column(Text)
    file_path      : Mapped[Optional[str]]    = mapped_column(String(500))
    admin_response : Mapped[Optional[str]]    = mapped_column(Text)
    status         : Mapped[str]              = mapped_column(String(30), default="قيد المراجعة")
    reviewed_by    : Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    reviewed_at    : Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student : Mapped["Student"] = relationship(back_populates="registration_requests")


# ---------------------------------------------------------------------------
# StudentBlock
# ---------------------------------------------------------------------------
class StudentBlock(Base):
    __tablename__ = "student_blocks"

    id           : Mapped[int]              = mapped_column(Integer, primary_key=True, autoincrement=True)
    faculty_id   : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    student_id   : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    reason       : Mapped[str]              = mapped_column(String(255), nullable=False)
    block_date   : Mapped[date]             = mapped_column(Date, server_default=func.current_date())
    unblock_date : Mapped[Optional[date]]   = mapped_column(Date)
    blocked_by   : Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    status       : Mapped[str]              = mapped_column(String(20), default="محجوب")
    notes        : Mapped[Optional[str]]    = mapped_column(Text)
    created_at   : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at   : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student : Mapped["Student"] = relationship(back_populates="blocks")


# ---------------------------------------------------------------------------
# FeeSetup
# ---------------------------------------------------------------------------
class FeeSetup(Base):
    __tablename__ = "fee_setup"

    id            : Mapped[int]              = mapped_column(Integer, primary_key=True, autoincrement=True)
    faculty_id    : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    fee_type      : Mapped[str]              = mapped_column(String(100), nullable=False)
    level         : Mapped[Optional[str]]    = mapped_column(String(50))
    amount        : Mapped[float]            = mapped_column(Numeric(10, 2), nullable=False)
    semester      : Mapped[Optional[str]]    = mapped_column(String(30))
    academic_year : Mapped[Optional[str]]    = mapped_column(String(20))
    status        : Mapped[str]              = mapped_column(String(20), default="نشط")
    created_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at    : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    faculty : Mapped[Optional["Faculty"]] = relationship(back_populates="fee_setups")


# ---------------------------------------------------------------------------
# StudentRequirement (Checklist items like photo, ID, etc.)
# ---------------------------------------------------------------------------
class StudentRequirement(Base):
    __tablename__ = "student_requirements"

    id              : Mapped[int]              = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id      : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    requirement_key : Mapped[str]              = mapped_column(String(50), nullable=False)
    status          : Mapped[str]              = mapped_column(String(20), default="pending")  # pending, submitted, verified
    notes           : Mapped[Optional[str]]    = mapped_column(Text)
    updated_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    student         : Mapped["Student"]        = relationship(back_populates="requirements")


# ---------------------------------------------------------------------------
# StudentDocument (Actual files stored as data URLs for demo)
# ---------------------------------------------------------------------------
class StudentDocument(Base):
    __tablename__ = "student_documents"

    id          : Mapped[int]              = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_id  : Mapped[str]              = mapped_column(String(20), ForeignKey("students.student_id", ondelete="CASCADE"), nullable=False)
    type        : Mapped[str]              = mapped_column(String(50), nullable=False)  # birth_certificate, etc.
    title       : Mapped[str]              = mapped_column(String(255), nullable=False)
    filename    : Mapped[str]              = mapped_column(String(255))
    mime_type   : Mapped[str]              = mapped_column(String(100))
    size        : Mapped[int]              = mapped_column(Integer)
    data_url    : Mapped[str]              = mapped_column(Text, nullable=False)
    uploaded_at : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())

    student     : Mapped["Student"]        = relationship(back_populates="documents")


# ---------------------------------------------------------------------------
# ActivityLog (Already exists, just ensuring usage)
# ---------------------------------------------------------------------------
class ActivityLog(Base):
    __tablename__ = "activity_log"

    id           : Mapped[int]              = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id      : Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"))
    faculty_id   : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="SET NULL"))
    entity_type  : Mapped[str]              = mapped_column(String(50), nullable=False)
    entity_id    : Mapped[Optional[str]]    = mapped_column(String(50))
    action       : Mapped[str]              = mapped_column(String(100), nullable=False)
    description  : Mapped[Optional[str]]    = mapped_column(Text)
    performed_at : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())


# ---------------------------------------------------------------------------
# ReportSignature
# ---------------------------------------------------------------------------
class ReportSignature(Base):
    __tablename__ = "report_signatures"

    id             : Mapped[str]              = mapped_column(String(30), primary_key=True)
    faculty_id     : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    report_name    : Mapped[str]              = mapped_column(String(255), nullable=False)
    signatory_name : Mapped[str]              = mapped_column(String(255), nullable=False)
    title          : Mapped[str]              = mapped_column(String(255), nullable=False)
    order          : Mapped[int]              = mapped_column(Integer, default=1)
    is_active      : Mapped[bool]             = mapped_column(Boolean, default=True)
    created_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


# ---------------------------------------------------------------------------
# SystemSetting
# ---------------------------------------------------------------------------
class SystemSetting(Base):
    __tablename__ = "system_settings"

    id             : Mapped[str]              = mapped_column(String(50), primary_key=True)
    faculty_id     : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    name           : Mapped[str]              = mapped_column(String(255), nullable=False)
    value          : Mapped[str]              = mapped_column(String(255), nullable=False)
    description    : Mapped[Optional[str]]    = mapped_column(String(500))
    category       : Mapped[str]              = mapped_column(String(50), default="General")
    status         : Mapped[str]              = mapped_column(String(50), default="Active")
    created_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


class SurveyRule(Base):
    __tablename__ = "survey_rules"

    id             : Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faculty_id     : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    code           : Mapped[str]              = mapped_column(String(50), nullable=False, unique=True)
    name           : Mapped[str]              = mapped_column(String(200), nullable=False)
    target         : Mapped[Optional[str]]    = mapped_column(String(100))
    start_date     : Mapped[Optional[datetime]] = mapped_column(DateTime)
    end_date       : Mapped[Optional[datetime]] = mapped_column(DateTime)
    status         : Mapped[str]              = mapped_column(String(50), default='نشط')
    created_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at     : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())


# ---------------------------------------------------------------------------
# Staff (Instructors/Teachers)
# ---------------------------------------------------------------------------
class Staff(Base):
    __tablename__ = "staff"

    id              : Mapped[str]              = mapped_column(String(30), primary_key=True)
    name            : Mapped[str]              = mapped_column(String(255), nullable=False)
    email           : Mapped[Optional[str]]    = mapped_column(String(255), unique=True)
    phone           : Mapped[Optional[str]]    = mapped_column(String(20))
    faculty_id      : Mapped[str]              = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"), nullable=False)
    department_id   : Mapped[Optional[str]]    = mapped_column(String(30), ForeignKey("departments.id", ondelete="SET NULL"))
    specialization  : Mapped[Optional[str]]    = mapped_column(String(255))
    title           : Mapped[Optional[str]]    = mapped_column(String(100))
    office_location : Mapped[Optional[str]]    = mapped_column(String(100))
    status          : Mapped[str]              = mapped_column(String(50), default='فعال')
    created_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    faculty : Mapped["Faculty"] = relationship(back_populates="staff")
    department : Mapped[Optional["Department"]] = relationship(back_populates="staff")


# ---------------------------------------------------------------------------
# Academic Calendar
# ---------------------------------------------------------------------------
class AcademicCalendar(Base):
    __tablename__ = "academic_calendar"

    id              : Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_name      : Mapped[str]              = mapped_column(String(255), nullable=False)
    event_type      : Mapped[str]              = mapped_column(String(50), nullable=False)
    start_date      : Mapped[date]             = mapped_column(Date, nullable=False)
    end_date        : Mapped[Optional[date]]   = mapped_column(Date)
    faculty_id      : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    academic_year   : Mapped[Optional[str]]    = mapped_column(String(20))
    description     : Mapped[Optional[str]]    = mapped_column(Text)
    created_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    faculty : Mapped[Optional["Faculty"]] = relationship(back_populates="calendar_events")


# ---------------------------------------------------------------------------
# Announcements/Notifications
# ---------------------------------------------------------------------------
class Announcement(Base):
    __tablename__ = "announcements"

    id              : Mapped[uuid.UUID]        = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title           : Mapped[str]              = mapped_column(String(255), nullable=False)
    body            : Mapped[str]              = mapped_column(Text, nullable=False)
    faculty_id      : Mapped[Optional[str]]    = mapped_column(String(20), ForeignKey("faculties.id", ondelete="CASCADE"))
    role_target     : Mapped[Optional[str]]    = mapped_column(String(50))
    priority        : Mapped[str]              = mapped_column(String(20), default='عادي')
    expires_at      : Mapped[Optional[datetime]] = mapped_column(DateTime)
    is_active       : Mapped[bool]             = mapped_column(Boolean, default=True)
    created_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now())
    updated_at      : Mapped[datetime]         = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    faculty : Mapped[Optional["Faculty"]] = relationship(back_populates="announcements")


# ---------------------------------------------------------------------------
# Composite indexes for frequently-queried column combinations
# ---------------------------------------------------------------------------
Index('ix_enrollment_student_status',    Enrollment.student_id,      Enrollment.status)
Index('ix_enrollment_course_semester',   Enrollment.course_id,        Enrollment.semester)
Index('ix_grade_student_course_sem',     Grade.student_id,            Grade.course_id,    Grade.semester)
Index('ix_attendance_student_course',    AttendanceRecord.student_id, AttendanceRecord.course_id)
Index('ix_attendance_date',              AttendanceRecord.attendance_date)
Index('ix_financial_student_status',     FinancialRecord.student_id,  FinancialRecord.status)
Index('ix_financial_faculty',            FinancialRecord.faculty_id)
