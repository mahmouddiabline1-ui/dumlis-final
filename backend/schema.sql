-- ============================================================
-- DUMLIS University Management System
-- PostgreSQL Schema
-- Generated from mockData.ts, types.ts, constants.tsx,
--              committeesData.ts, formOptions.ts
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

-- ============================================================
-- TABLE: faculties
-- ============================================================
CREATE TABLE faculties (
    id            VARCHAR(20)  PRIMARY KEY,          -- e.g. 'FCAI', 'SCI', 'COM'
    name          VARCHAR(255) NOT NULL,
    name_en       VARCHAR(255),
    icon          VARCHAR(10),
    student_count INTEGER      DEFAULT 0,
    staff_count   INTEGER      DEFAULT 0,
    color         VARCHAR(100),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: departments
-- ============================================================
CREATE TABLE departments (
    id          VARCHAR(20)  PRIMARY KEY,             -- e.g. 'CS', 'IS', 'AI'
    faculty_id  VARCHAR(20)  NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
    name        VARCHAR(255) NOT NULL,
    name_en     VARCHAR(255),
    code        VARCHAR(20)  NOT NULL,
    head_name   VARCHAR(255),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (faculty_id, code)
);

CREATE INDEX idx_departments_faculty ON departments(faculty_id);

-- ============================================================
-- TABLE: users  (authentication)
-- ============================================================
CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    username      CITEXT       NOT NULL UNIQUE,
    email         CITEXT       NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role          VARCHAR(30)  NOT NULL CHECK (role IN ('super_admin','faculty_admin','student_affairs','student')),
    faculty_id    VARCHAR(20)  REFERENCES faculties(id) ON DELETE SET NULL,
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: students  (core academic record)
-- ============================================================
CREATE TABLE students (
    student_id    VARCHAR(20)  PRIMARY KEY,           -- e.g. '20240001'
    user_id       UUID         REFERENCES users(id) ON DELETE SET NULL,
    name          VARCHAR(255) NOT NULL,
    national_id   VARCHAR(14)  UNIQUE,
    faculty_id    VARCHAR(20)  NOT NULL REFERENCES faculties(id),
    department_id VARCHAR(20)  REFERENCES departments(id),
    level         SMALLINT     NOT NULL CHECK (level BETWEEN 1 AND 4),
    regulation    VARCHAR(50)  NOT NULL DEFAULT 'لائحة جديدة'
                                CHECK (regulation IN ('لائحة قديمة','لائحة جديدة')),
    gpa           NUMERIC(4,2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    phone         VARCHAR(20),
    email         CITEXT,
    city          VARCHAR(100),
    status        VARCHAR(30)  NOT NULL DEFAULT 'مقيد'
                                CHECK (status IN ('مقيد','موقوف','خريج','مفصول')),
    fees_status   VARCHAR(30)  NOT NULL DEFAULT 'غير مسدد'
                                CHECK (fees_status IN ('مسدد','غير مسدد')),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_faculty  ON students(faculty_id);
CREATE INDEX idx_students_dept     ON students(department_id);
CREATE INDEX idx_students_status   ON students(status);
CREATE INDEX idx_students_level    ON students(level);
CREATE INDEX idx_students_regulation ON students(regulation);

-- ============================================================
-- TABLE: student_profiles  (detailed personal/family/military data)
-- One-to-one with students
-- ============================================================
CREATE TABLE student_profiles (
    id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id          VARCHAR(20)  NOT NULL UNIQUE REFERENCES students(student_id) ON DELETE CASCADE,
    -- Personal
    name_en             VARCHAR(255),
    birth_date          DATE,
    birth_place         VARCHAR(100),
    nationality         VARCHAR(100) DEFAULT 'مصري',
    religion            VARCHAR(50),
    gender              VARCHAR(20)  CHECK (gender IN ('ذكر','أنثى')),
    photo_url           VARCHAR(500),
    -- Contact
    address_governorate VARCHAR(100),
    address_city        VARCHAR(100),
    address_street      VARCHAR(255),
    address_building    VARCHAR(20),
    address_details     VARCHAR(500),
    -- Family
    guardian_name       VARCHAR(255),
    guardian_relation   VARCHAR(50),
    guardian_phone      VARCHAR(20),
    guardian_job        VARCHAR(100),
    guardian_national_id VARCHAR(14),
    -- Qualification (high-school)
    qual_type           VARCHAR(50),      -- thanaweya_amma, azhar, etc.
    qual_year           VARCHAR(10),
    school_name         VARCHAR(255),
    seat_number         VARCHAR(20),
    total_degree        NUMERIC(6,2),
    percentage          NUMERIC(5,2),
    division            VARCHAR(50),
    qual_date           DATE,
    -- Military
    military_status     VARCHAR(50),      -- مؤجل, مجند, معاف
    triple_number       VARCHAR(50),
    postponement_date   DATE,
    postponement_reason VARCHAR(255),
    military_notes      TEXT,
    -- Military Education (تربية عسكرية)
    mil_edu_status      VARCHAR(30) CHECK (mil_edu_status IN ('completed','not_completed','exempt')),
    mil_edu_completion  DATE,
    mil_edu_notes       TEXT,
    -- Medical
    medical_status      VARCHAR(30) CHECK (medical_status IN ('fit','unfit','pending')),
    vaccination_status  VARCHAR(30),
    blood_type          VARCHAR(5),
    created_at          TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: courses
-- ============================================================
CREATE TABLE courses (
    id              VARCHAR(20)  PRIMARY KEY,          -- e.g. 'CS101'
    name            VARCHAR(255) NOT NULL,
    name_en         VARCHAR(255),
    level           SMALLINT     NOT NULL CHECK (level BETWEEN 1 AND 4),
    department_id   VARCHAR(20)  REFERENCES departments(id),
    credit_hours    SMALLINT     NOT NULL DEFAULT 3,
    course_type     VARCHAR(30)  NOT NULL DEFAULT 'إجباري'
                                  CHECK (course_type IN ('إجباري','اختياري')),
    semester        VARCHAR(30)  CHECK (semester IN ('خريف','ربيع','صيف')),
    theoretical_hours SMALLINT   DEFAULT 2,
    practical_hours   SMALLINT   DEFAULT 1,
    max_capacity    INTEGER,
    faculty_id      VARCHAR(20)  REFERENCES faculties(id) ON DELETE SET NULL,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_courses_dept  ON courses(department_id);
CREATE INDEX idx_courses_level ON courses(level);

-- ============================================================
-- TABLE: course_prerequisites  (self-referencing M2M)
-- ============================================================
CREATE TABLE course_prerequisites (
    course_id       VARCHAR(20) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_id VARCHAR(20) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, prerequisite_id)
);

-- ============================================================
-- TABLE: course_equivalences  (موازنة مقررات)
-- ============================================================
CREATE TABLE course_equivalences (
    id               SERIAL      PRIMARY KEY,
    student_id       VARCHAR(20) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    original_course_id  VARCHAR(20) NOT NULL REFERENCES courses(id),
    equivalent_course_id VARCHAR(20) NOT NULL REFERENCES courses(id),
    status           VARCHAR(30) NOT NULL DEFAULT 'قيد المراجعة'
                      CHECK (status IN ('قيد المراجعة','معتمد','مرفوض')),
    created_at       TIMESTAMP   NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: enrollments  (تسجيل الطلاب في المقررات)
-- ============================================================
CREATE TABLE enrollments (
    id          BIGSERIAL    PRIMARY KEY,
    student_id  VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id   VARCHAR(20)  NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester    VARCHAR(50)  NOT NULL,                 -- e.g. '2024-2025 خريف'
    status      VARCHAR(30)  NOT NULL DEFAULT 'مسجل'
                              CHECK (status IN ('مسجل','منسحب','مؤجل','معلق')),
    enrolled_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, course_id, semester)
);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course  ON enrollments(course_id);
CREATE INDEX idx_enrollments_semester ON enrollments(semester);

-- ============================================================
-- TABLE: grades  (درجات الطلاب)
-- ============================================================
CREATE TABLE grades (
    id              BIGSERIAL    PRIMARY KEY,
    student_id      VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id       VARCHAR(20)  NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester        VARCHAR(50)  NOT NULL,
    midterm         NUMERIC(5,2) CHECK (midterm >= 0),
    final_exam      NUMERIC(5,2) CHECK (final_exam >= 0),
    assignments     NUMERIC(5,2) CHECK (assignments >= 0),
    oral            NUMERIC(5,2) CHECK (oral >= 0),
    practical       NUMERIC(5,2) CHECK (practical >= 0),
    total           NUMERIC(5,2) CHECK (total >= 0 AND total <= 100),
    grade_letter    VARCHAR(5),   -- A+, A, A-, B+, ... F
    grade_points    NUMERIC(3,1) CHECK (grade_points >= 0.0 AND grade_points <= 4.0),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, course_id, semester)
);

CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_course  ON grades(course_id);

-- ============================================================
-- TABLE: rooms  (قاعات + معامل)
-- ============================================================
CREATE TABLE rooms (
    id          VARCHAR(30)  PRIMARY KEY,              -- e.g. 'room_101b', 'lab_201'
    code        VARCHAR(20)  NOT NULL,
    name        VARCHAR(100) NOT NULL,
    room_type   VARCHAR(20)  NOT NULL CHECK (room_type IN ('classroom','lab')),
    capacity    INTEGER      NOT NULL DEFAULT 0,
    building    VARCHAR(10),
    floor       SMALLINT,
    description TEXT,
    equipment   TEXT[],                                -- Array of equipment strings
    status      VARCHAR(30)  NOT NULL DEFAULT 'available'
                              CHECK (status IN ('available','maintenance','reserved')),
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: course_schedules  (جداول المقررات)
-- ============================================================
CREATE TABLE course_schedules (
    id           BIGSERIAL    PRIMARY KEY,
    course_id    VARCHAR(20)  NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    room_id      VARCHAR(30)  REFERENCES rooms(id) ON DELETE SET NULL,
    session_type VARCHAR(30)  NOT NULL CHECK (session_type IN ('محاضرة','سكشن','معمل')),
    day          VARCHAR(20)  NOT NULL,
    time_start   TIME,
    time_end     TIME,
    time_label   VARCHAR(30),                          -- '08:00 - 10:00'
    instructor   VARCHAR(255),
    semester     VARCHAR(50),
    group_label  VARCHAR(10),                          -- 'A', 'B', 'C'
    enrolled_count INTEGER    DEFAULT 0,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_schedules_course ON course_schedules(course_id);
CREATE INDEX idx_schedules_room   ON course_schedules(room_id);
CREATE INDEX idx_schedules_day    ON course_schedules(day);

-- ============================================================
-- TABLE: attendance_records  (سجل الحضور)
-- ============================================================
CREATE TABLE attendance_records (
    id              BIGSERIAL    PRIMARY KEY,
    student_id      VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id       VARCHAR(20)  NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    schedule_id     BIGINT       REFERENCES course_schedules(id) ON DELETE SET NULL,
    session_type    VARCHAR(30)  CHECK (session_type IN ('محاضرة','سكشن','معمل')),
    week_number     SMALLINT,
    attendance_date DATE         NOT NULL,
    status          VARCHAR(20)  NOT NULL CHECK (status IN ('حاضر','غائب','متأخر','معذور')),
    notes           TEXT,
    recorded_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, course_id, attendance_date, session_type)
);

CREATE INDEX idx_attendance_student ON attendance_records(student_id);
CREATE INDEX idx_attendance_course  ON attendance_records(course_id);
CREATE INDEX idx_attendance_date    ON attendance_records(attendance_date);

-- ============================================================
-- TABLE: financial_records  (السجلات المالية)
-- ============================================================
CREATE TABLE financial_records (
    id              BIGSERIAL    PRIMARY KEY,
    student_id      VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    fee_type        VARCHAR(100) NOT NULL,             -- 'رسوم دراسية', 'رسوم معامل', etc.
    description     VARCHAR(255),
    semester        VARCHAR(50),
    academic_year   VARCHAR(20),
    amount          NUMERIC(10,2) NOT NULL DEFAULT 0,
    paid_amount     NUMERIC(10,2) NOT NULL DEFAULT 0,
    due_date        DATE,
    payment_date    DATE,
    receipt_no      VARCHAR(50),
    status          VARCHAR(30)  NOT NULL DEFAULT 'غير مسدد'
                                  CHECK (status IN ('مسدد','غير مسدد','مسدد جزئياً')),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_financial_student ON financial_records(student_id);
CREATE INDEX idx_financial_status  ON financial_records(status);

-- ============================================================
-- TABLE: committees  (لجان الامتحانات)
-- ============================================================
CREATE TABLE committees (
    id                  SERIAL       PRIMARY KEY,
    name                VARCHAR(255) NOT NULL,
    course_id           VARCHAR(20)  REFERENCES courses(id) ON DELETE SET NULL,
    room_id             VARCHAR(30)  NOT NULL REFERENCES rooms(id),
    capacity            INTEGER      NOT NULL,
    assigned_students   INTEGER      NOT NULL DEFAULT 0,
    exam_date           DATE,
    exam_time           TIME,
    supervisor          VARCHAR(255),
    status              VARCHAR(20)  NOT NULL DEFAULT 'active'
                                      CHECK (status IN ('active','completed','cancelled')),
    -- Seating arrangement (denormalized for simplicity)
    seating_rows        SMALLINT,
    seating_cols        SMALLINT,
    seating_layout      VARCHAR(20)  CHECK (seating_layout IN ('standard','theater','lab')),
    semester            VARCHAR(50),
    created_at          TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_committees_room   ON committees(room_id);
CREATE INDEX idx_committees_course ON committees(course_id);

-- ============================================================
-- TABLE: student_committee_assignments  (M2M students <-> committees)
-- ============================================================
CREATE TABLE student_committee_assignments (
    id              BIGSERIAL    PRIMARY KEY,
    student_id      VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    committee_id    INTEGER      NOT NULL REFERENCES committees(id) ON DELETE CASCADE,
    seat_number     VARCHAR(20),
    seat_row        SMALLINT,
    seat_column     SMALLINT,
    exam_date       DATE,
    exam_time       TIME,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (student_id, committee_id)
);

CREATE INDEX idx_sca_student   ON student_committee_assignments(student_id);
CREATE INDEX idx_sca_committee ON student_committee_assignments(committee_id);

-- ============================================================
-- TABLE: registration_requests  (طلبات التسجيل - حالات التعثر)
-- ============================================================
CREATE TABLE registration_requests (
    id              VARCHAR(30)  PRIMARY KEY,          -- REQ-2024-001
    student_id      VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    request_date    DATE         NOT NULL DEFAULT CURRENT_DATE,
    comment         TEXT,
    file_path       VARCHAR(500),
    admin_response  TEXT,
    status          VARCHAR(30)  NOT NULL DEFAULT 'قيد المراجعة'
                                  CHECK (status IN ('قيد المراجعة','مقبول','مرفوض')),
    reviewed_by     UUID         REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMP,
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reg_requests_student ON registration_requests(student_id);
CREATE INDEX idx_reg_requests_status  ON registration_requests(status);

-- ============================================================
-- TABLE: student_blocks  (حجب تسجيل الطلاب)
-- ============================================================
CREATE TABLE student_blocks (
    id          SERIAL       PRIMARY KEY,
    student_id  VARCHAR(20)  NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    reason      VARCHAR(255) NOT NULL,
    block_date  DATE         NOT NULL DEFAULT CURRENT_DATE,
    unblock_date DATE,
    blocked_by  UUID         REFERENCES users(id) ON DELETE SET NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'محجوب'
                              CHECK (status IN ('محجوب','مفكوك الحجب')),
    notes       TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocks_student ON student_blocks(student_id);

-- ============================================================
-- TABLE: fee_setup  (تجهيز رسوم)
-- ============================================================
CREATE TABLE fee_setup (
    id              SERIAL       PRIMARY KEY,
    faculty_id      VARCHAR(20)  REFERENCES faculties(id) ON DELETE CASCADE,
    fee_type        VARCHAR(100) NOT NULL,
    level           VARCHAR(50),                       -- 'الكل', 'المستوى الأول', etc.
    amount          NUMERIC(10,2) NOT NULL,
    semester        VARCHAR(30),
    academic_year   VARCHAR(20),
    status          VARCHAR(20)  NOT NULL DEFAULT 'نشط' CHECK (status IN ('نشط','غير نشط')),
    created_at      TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: activity_log  (سجل التغييرات)
-- ============================================================
CREATE TABLE activity_log (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     UUID         REFERENCES users(id) ON DELETE SET NULL,
    entity_type VARCHAR(50)  NOT NULL,                -- 'student', 'enrollment', etc.
    entity_id   VARCHAR(50),
    action      VARCHAR(30)  NOT NULL,                -- 'create', 'update', 'delete'
    description TEXT,
    ip_address  INET,
    performed_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_user   ON activity_log(user_id);
CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_time   ON activity_log(performed_at DESC);

-- ============================================================
-- TABLE: report_signatures
-- ============================================================
CREATE TABLE report_signatures (
    id             VARCHAR(30)  PRIMARY KEY,
    report_name    VARCHAR(255) NOT NULL,
    signatory_name VARCHAR(255) NOT NULL,
    title          VARCHAR(255) NOT NULL,
    "order"        INTEGER      NOT NULL DEFAULT 1,
    is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: programs
-- ============================================================
CREATE TABLE programs (
    id                      VARCHAR(30)  PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    name_en                 VARCHAR(255),
    code                    VARCHAR(20)  NOT NULL,
    degree                  VARCHAR(50)  NOT NULL DEFAULT 'بكالوريوس',
    department_id           VARCHAR(20)  NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    total_hours             SMALLINT     NOT NULL DEFAULT 140,
    faculty_id              VARCHAR(20)  REFERENCES faculties(id) ON DELETE CASCADE,
    mandatory_hours         SMALLINT     NOT NULL DEFAULT 0,
    elective_hours          SMALLINT     NOT NULL DEFAULT 0,
    university_requirements SMALLINT     NOT NULL DEFAULT 0,
    tracks                  JSONB,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: study_regulations
-- ============================================================
CREATE TABLE study_regulations (
    id                      VARCHAR(30)  PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    program_id              VARCHAR(30)  NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    registration_rules      TEXT,
    pass_fail_rules         TEXT,
    absence_policy          TEXT,
    mandatory_hours         SMALLINT     NOT NULL DEFAULT 0,
    elective_hours          SMALLINT     NOT NULL DEFAULT 0,
    university_requirements SMALLINT     NOT NULL DEFAULT 0,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: academic_rules
-- ============================================================
CREATE TABLE academic_rules (
    id                      VARCHAR(30)  PRIMARY KEY,
    faculty_id              VARCHAR(20)  NOT NULL UNIQUE REFERENCES faculties(id) ON DELETE CASCADE,
    rules_data              JSONB        NOT NULL,
    created_at              TIMESTAMP    NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMP    NOT NULL DEFAULT NOW()
);
