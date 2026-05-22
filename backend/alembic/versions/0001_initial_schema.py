"""Initial schema — all DUMLIS tables

Revision ID: 0001
Revises: 
Create Date: 2026-03-16

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '0001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── Extensions ────────────────────────────────────────────────
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    op.execute('CREATE EXTENSION IF NOT EXISTS citext')

    # ── faculties ────────────────────────────────────────────────
    op.create_table(
        'faculties',
        sa.Column('id',            sa.String(20),  primary_key=True),
        sa.Column('name',          sa.String(255), nullable=False),
        sa.Column('name_en',       sa.String(255)),
        sa.Column('icon',          sa.String(10)),
        sa.Column('student_count', sa.Integer(),   server_default='0'),
        sa.Column('staff_count',   sa.Integer(),   server_default='0'),
        sa.Column('color',         sa.String(100)),
        sa.Column('created_at',    sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at',    sa.DateTime(),  server_default=sa.text('now()')),
    )

    # ── departments ───────────────────────────────────────────────
    op.create_table(
        'departments',
        sa.Column('id',         sa.String(20),  primary_key=True),
        sa.Column('faculty_id', sa.String(20),  sa.ForeignKey('faculties.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name',       sa.String(255), nullable=False),
        sa.Column('name_en',    sa.String(255)),
        sa.Column('code',       sa.String(20),  nullable=False),
        sa.Column('head_name',  sa.String(255)),
        sa.Column('created_at', sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(),  server_default=sa.text('now()')),
        sa.UniqueConstraint('faculty_id', 'code', name='uq_dept_faculty_code'),
    )
    op.create_index('idx_departments_faculty', 'departments', ['faculty_id'])

    # ── programs ──────────────────────────────────────────────────
    op.create_table(
        'programs',
        sa.Column('id',                     sa.String(30),  primary_key=True),
        sa.Column('name',                   sa.String(255), nullable=False),
        sa.Column('name_en',                sa.String(255)),
        sa.Column('code',                   sa.String(20),  nullable=False),
        sa.Column('degree',                 sa.String(50),  server_default='بكالوريوس'),
        sa.Column('department_id',          sa.String(20),  sa.ForeignKey('departments.id', ondelete='CASCADE'), nullable=False),
        sa.Column('faculty_id',             sa.String(20),  sa.ForeignKey('faculties.id', ondelete='CASCADE')),
        sa.Column('total_hours',            sa.SmallInteger(), server_default='140'),
        sa.Column('mandatory_hours',        sa.SmallInteger(), server_default='0'),
        sa.Column('elective_hours',         sa.SmallInteger(), server_default='0'),
        sa.Column('university_requirements', sa.SmallInteger(), server_default='0'),
        sa.Column('tracks',                 postgresql.JSONB()),
        sa.Column('created_at',             sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at',             sa.DateTime(),  server_default=sa.text('now()')),
    )
    op.create_index('idx_programs_dept', 'programs', ['department_id'])
    op.create_index('idx_programs_faculty', 'programs', ['faculty_id'])

    # ── study_regulations ─────────────────────────────────────────
    op.create_table(
        'study_regulations',
        sa.Column('id',                  sa.String(30),  primary_key=True),
        sa.Column('name',                sa.String(255), nullable=False),
        sa.Column('program_id',          sa.String(30),  sa.ForeignKey('programs.id', ondelete='CASCADE'), nullable=False),
        sa.Column('registration_rules',  sa.Text()),
        sa.Column('pass_fail_rules',     sa.Text()),
        sa.Column('absence_policy',      sa.Text()),
        sa.Column('min_semester_hours',  sa.SmallInteger(), server_default='12'),
        sa.Column('max_semester_hours',  sa.SmallInteger(), server_default='21'),
        sa.Column('created_at',          sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at',          sa.DateTime(),  server_default=sa.text('now()')),
    )

    # ── users ─────────────────────────────────────────────────────
    op.create_table(
        'users',
        sa.Column('id',              postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('username',        postgresql.CITEXT(), nullable=False, unique=True),
        sa.Column('email',           postgresql.CITEXT(), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('role',            sa.String(30),  nullable=False),
        sa.Column('faculty_id',      sa.String(20),  sa.ForeignKey('faculties.id', ondelete='SET NULL')),
        sa.Column('is_active',       sa.Boolean(),   server_default='true'),
        sa.Column('created_at',      sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at',      sa.DateTime(),  server_default=sa.text('now()')),
        sa.CheckConstraint("role IN ('super_admin','faculty_admin','student_affairs','student')", name='ck_user_role'),
    )

    # ── students ──────────────────────────────────────────────────
    op.create_table(
        'students',
        sa.Column('student_id',    sa.String(20),                   primary_key=True),
        sa.Column('user_id',       postgresql.UUID(as_uuid=True),   sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('name',          sa.String(255), nullable=False),
        sa.Column('national_id',   sa.String(14),  unique=True),
        sa.Column('faculty_id',    sa.String(20),  sa.ForeignKey('faculties.id'), nullable=False),
        sa.Column('department_id', sa.String(20),  sa.ForeignKey('departments.id')),
        sa.Column('level',         sa.SmallInteger(), nullable=False),
        sa.Column('regulation',    sa.String(50),  server_default='لائحة جديدة'),
        sa.Column('gpa',           sa.Numeric(4, 2)),
        sa.Column('phone',         sa.String(20)),
        sa.Column('email',         postgresql.CITEXT()),
        sa.Column('city',          sa.String(100)),
        sa.Column('status',        sa.String(30),  server_default='مقيد'),
        sa.Column('fees_status',   sa.String(30),  server_default='غير مسدد'),
        sa.Column('created_at',    sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at',    sa.DateTime(),  server_default=sa.text('now()')),
    )
    op.create_index('idx_students_faculty',     'students', ['faculty_id'])
    op.create_index('idx_students_dept',        'students', ['department_id'])
    op.create_index('idx_students_status',      'students', ['status'])
    op.create_index('idx_students_level',       'students', ['level'])
    op.create_index('idx_students_regulation',  'students', ['regulation'])

    # ── student_profiles ─────────────────────────────────────────
    op.create_table(
        'student_profiles',
        sa.Column('id',                  postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('uuid_generate_v4()')),
        sa.Column('student_id',          sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('name_en',             sa.String(255)),
        sa.Column('birth_date',          sa.Date()),
        sa.Column('birth_place',         sa.String(100)),
        sa.Column('nationality',         sa.String(100), server_default='مصري'),
        sa.Column('religion',            sa.String(50)),
        sa.Column('gender',              sa.String(20)),
        sa.Column('photo_url',           sa.String(500)),
        sa.Column('address_governorate', sa.String(100)),
        sa.Column('address_city',        sa.String(100)),
        sa.Column('address_street',      sa.String(255)),
        sa.Column('address_building',    sa.String(20)),
        sa.Column('address_details',     sa.String(500)),
        sa.Column('guardian_name',       sa.String(255)),
        sa.Column('guardian_relation',   sa.String(50)),
        sa.Column('guardian_phone',      sa.String(20)),
        sa.Column('guardian_job',        sa.String(100)),
        sa.Column('guardian_national_id',sa.String(14)),
        sa.Column('qual_type',           sa.String(50)),
        sa.Column('qual_year',           sa.String(10)),
        sa.Column('school_name',         sa.String(255)),
        sa.Column('seat_number',         sa.String(20)),
        sa.Column('total_degree',        sa.Numeric(6, 2)),
        sa.Column('percentage',          sa.Numeric(5, 2)),
        sa.Column('division',            sa.String(50)),
        sa.Column('qual_date',           sa.Date()),
        sa.Column('military_status',     sa.String(50)),
        sa.Column('triple_number',       sa.String(50)),
        sa.Column('postponement_date',   sa.Date()),
        sa.Column('postponement_reason', sa.String(255)),
        sa.Column('military_notes',      sa.Text()),
        sa.Column('mil_edu_status',      sa.String(30)),
        sa.Column('mil_edu_completion',  sa.Date()),
        sa.Column('mil_edu_notes',       sa.Text()),
        sa.Column('medical_status',      sa.String(30)),
        sa.Column('vaccination_status',  sa.String(30)),
        sa.Column('blood_type',          sa.String(5)),
        sa.Column('created_at',          sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',          sa.DateTime(), server_default=sa.text('now()')),
    )

    # ── courses ───────────────────────────────────────────────────
    op.create_table(
        'courses',
        sa.Column('id',                sa.String(20),   primary_key=True),
        sa.Column('name',              sa.String(255),  nullable=False),
        sa.Column('name_en',           sa.String(255)),
        sa.Column('level',             sa.SmallInteger(), nullable=False),
        sa.Column('department_id',     sa.String(20),   sa.ForeignKey('departments.id')),
        sa.Column('credit_hours',      sa.SmallInteger(), server_default='3'),
        sa.Column('course_type',       sa.String(30),   server_default='إجباري'),
        sa.Column('semester',          sa.String(30)),
        sa.Column('theoretical_hours', sa.SmallInteger()),
        sa.Column('practical_hours',   sa.SmallInteger()),
        sa.Column('max_capacity',      sa.Integer()),
        sa.Column('created_at',        sa.DateTime(),   server_default=sa.text('now()')),
        sa.Column('updated_at',        sa.DateTime(),   server_default=sa.text('now()')),
    )
    op.create_index('idx_courses_dept',  'courses', ['department_id'])
    op.create_index('idx_courses_level', 'courses', ['level'])

    # ── course_prerequisites ─────────────────────────────────────
    op.create_table(
        'course_prerequisites',
        sa.Column('course_id',       sa.String(20), sa.ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('prerequisite_id', sa.String(20), sa.ForeignKey('courses.id', ondelete='CASCADE'), primary_key=True),
    )

    # ── course_equivalences ──────────────────────────────────────
    op.create_table(
        'course_equivalences',
        sa.Column('id',                   sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id',           sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('original_course_id',   sa.String(20), sa.ForeignKey('courses.id'), nullable=False),
        sa.Column('equivalent_course_id', sa.String(20), sa.ForeignKey('courses.id'), nullable=False),
        sa.Column('status',               sa.String(30), server_default='قيد المراجعة'),
        sa.Column('created_at',           sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',           sa.DateTime(), server_default=sa.text('now()')),
    )

    # ── enrollments ───────────────────────────────────────────────
    op.create_table(
        'enrollments',
        sa.Column('id',          sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('student_id',  sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('course_id',   sa.String(20), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('semester',    sa.String(50), nullable=False),
        sa.Column('status',      sa.String(30), server_default='مسجل'),
        sa.Column('enrolled_at', sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',  sa.DateTime(), server_default=sa.text('now()')),
        sa.UniqueConstraint('student_id', 'course_id', 'semester', name='uq_enrollment'),
    )
    op.create_index('idx_enrollments_student',  'enrollments', ['student_id'])
    op.create_index('idx_enrollments_course',   'enrollments', ['course_id'])
    op.create_index('idx_enrollments_semester', 'enrollments', ['semester'])

    # ── grades ────────────────────────────────────────────────────
    op.create_table(
        'grades',
        sa.Column('id',           sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('student_id',   sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('course_id',    sa.String(20), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('semester',     sa.String(50), nullable=False),
        sa.Column('midterm',      sa.Numeric(5, 2)),
        sa.Column('final_exam',   sa.Numeric(5, 2)),
        sa.Column('assignments',  sa.Numeric(5, 2)),
        sa.Column('oral',         sa.Numeric(5, 2)),
        sa.Column('practical',    sa.Numeric(5, 2)),
        sa.Column('total',        sa.Numeric(5, 2)),
        sa.Column('grade_letter', sa.String(5)),
        sa.Column('grade_points', sa.Numeric(3, 1)),
        sa.Column('created_at',   sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',   sa.DateTime(), server_default=sa.text('now()')),
        sa.UniqueConstraint('student_id', 'course_id', 'semester', name='uq_grade'),
    )
    op.create_index('idx_grades_student', 'grades', ['student_id'])
    op.create_index('idx_grades_course',  'grades', ['course_id'])

    # ── rooms ─────────────────────────────────────────────────────
    op.create_table(
        'rooms',
        sa.Column('id',          sa.String(30),  primary_key=True),
        sa.Column('code',        sa.String(20),  nullable=False),
        sa.Column('name',        sa.String(100), nullable=False),
        sa.Column('room_type',   sa.String(20),  nullable=False),
        sa.Column('capacity',    sa.Integer(),   server_default='0'),
        sa.Column('building',    sa.String(10)),
        sa.Column('floor',       sa.SmallInteger()),
        sa.Column('description', sa.Text()),
        sa.Column('equipment',   postgresql.ARRAY(sa.String())),
        sa.Column('status',      sa.String(30),  server_default='available'),
        sa.Column('created_at',  sa.DateTime(),  server_default=sa.text('now()')),
        sa.Column('updated_at',  sa.DateTime(),  server_default=sa.text('now()')),
    )

    # ── course_schedules ─────────────────────────────────────────
    op.create_table(
        'course_schedules',
        sa.Column('id',             sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('course_id',      sa.String(20), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('room_id',        sa.String(30), sa.ForeignKey('rooms.id', ondelete='SET NULL')),
        sa.Column('session_type',   sa.String(30), nullable=False),
        sa.Column('day',            sa.String(20), nullable=False),
        sa.Column('time_start',     sa.Time()),
        sa.Column('time_end',       sa.Time()),
        sa.Column('time_label',     sa.String(30)),
        sa.Column('instructor',     sa.String(255)),
        sa.Column('semester',       sa.String(50)),
        sa.Column('group_label',    sa.String(10)),
        sa.Column('enrolled_count', sa.Integer(), server_default='0'),
        sa.Column('created_at',     sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',     sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('idx_schedules_course', 'course_schedules', ['course_id'])
    op.create_index('idx_schedules_room',   'course_schedules', ['room_id'])
    op.create_index('idx_schedules_day',    'course_schedules', ['day'])

    # ── attendance_records ───────────────────────────────────────
    op.create_table(
        'attendance_records',
        sa.Column('id',              sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('student_id',      sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('course_id',       sa.String(20), sa.ForeignKey('courses.id', ondelete='CASCADE'), nullable=False),
        sa.Column('schedule_id',     sa.BigInteger(), sa.ForeignKey('course_schedules.id', ondelete='SET NULL')),
        sa.Column('session_type',    sa.String(30)),
        sa.Column('week_number',     sa.SmallInteger()),
        sa.Column('attendance_date', sa.Date(), nullable=False),
        sa.Column('status',          sa.String(20), nullable=False),
        sa.Column('notes',           sa.Text()),
        sa.Column('recorded_at',     sa.DateTime(), server_default=sa.text('now()')),
        sa.UniqueConstraint('student_id', 'course_id', 'attendance_date', 'session_type', name='uq_attendance'),
    )
    op.create_index('idx_attendance_student', 'attendance_records', ['student_id'])
    op.create_index('idx_attendance_course',  'attendance_records', ['course_id'])
    op.create_index('idx_attendance_date',    'attendance_records', ['attendance_date'])

    # ── financial_records ────────────────────────────────────────
    op.create_table(
        'financial_records',
        sa.Column('id',            sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('student_id',    sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('fee_type',      sa.String(100), nullable=False),
        sa.Column('description',   sa.String(255)),
        sa.Column('semester',      sa.String(50)),
        sa.Column('academic_year', sa.String(20)),
        sa.Column('amount',        sa.Numeric(10, 2), server_default='0'),
        sa.Column('paid_amount',   sa.Numeric(10, 2), server_default='0'),
        sa.Column('due_date',      sa.Date()),
        sa.Column('payment_date',  sa.Date()),
        sa.Column('receipt_no',    sa.String(50)),
        sa.Column('status',        sa.String(30), server_default='غير مسدد'),
        sa.Column('created_at',    sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',    sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('idx_financial_student', 'financial_records', ['student_id'])
    op.create_index('idx_financial_status',  'financial_records', ['status'])

    # ── committees ───────────────────────────────────────────────
    op.create_table(
        'committees',
        sa.Column('id',                sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name',              sa.String(255), nullable=False),
        sa.Column('course_id',         sa.String(20), sa.ForeignKey('courses.id', ondelete='SET NULL')),
        sa.Column('room_id',           sa.String(30), sa.ForeignKey('rooms.id'), nullable=False),
        sa.Column('capacity',          sa.Integer(), nullable=False),
        sa.Column('assigned_students', sa.Integer(), server_default='0'),
        sa.Column('exam_date',         sa.Date()),
        sa.Column('exam_time',         sa.Time()),
        sa.Column('supervisor',        sa.String(255)),
        sa.Column('status',            sa.String(20), server_default='active'),
        sa.Column('seating_rows',      sa.SmallInteger()),
        sa.Column('seating_cols',      sa.SmallInteger()),
        sa.Column('seating_layout',    sa.String(20)),
        sa.Column('semester',          sa.String(50)),
        sa.Column('created_at',        sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',        sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('idx_committees_room',   'committees', ['room_id'])
    op.create_index('idx_committees_course', 'committees', ['course_id'])

    # ── student_committee_assignments ────────────────────────────
    op.create_table(
        'student_committee_assignments',
        sa.Column('id',           sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('student_id',   sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('committee_id', sa.Integer(),  sa.ForeignKey('committees.id', ondelete='CASCADE'), nullable=False),
        sa.Column('seat_number',  sa.String(20)),
        sa.Column('seat_row',     sa.SmallInteger()),
        sa.Column('seat_column',  sa.SmallInteger()),
        sa.Column('exam_date',    sa.Date()),
        sa.Column('exam_time',    sa.Time()),
        sa.Column('created_at',   sa.DateTime(), server_default=sa.text('now()')),
        sa.UniqueConstraint('student_id', 'committee_id', name='uq_student_committee'),
    )
    op.create_index('idx_sca_student',   'student_committee_assignments', ['student_id'])
    op.create_index('idx_sca_committee', 'student_committee_assignments', ['committee_id'])

    # ── registration_requests ────────────────────────────────────
    op.create_table(
        'registration_requests',
        sa.Column('id',             sa.String(30), primary_key=True),
        sa.Column('student_id',     sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('request_date',   sa.Date(),     server_default=sa.text('current_date')),
        sa.Column('comment',        sa.Text()),
        sa.Column('file_path',      sa.String(500)),
        sa.Column('admin_response', sa.Text()),
        sa.Column('status',         sa.String(30), server_default='قيد المراجعة'),
        sa.Column('reviewed_by',    postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('reviewed_at',    sa.DateTime()),
        sa.Column('created_at',     sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',     sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('idx_reg_requests_student', 'registration_requests', ['student_id'])
    op.create_index('idx_reg_requests_status',  'registration_requests', ['status'])

    # ── student_blocks ───────────────────────────────────────────
    op.create_table(
        'student_blocks',
        sa.Column('id',           sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id',   sa.String(20), sa.ForeignKey('students.student_id', ondelete='CASCADE'), nullable=False),
        sa.Column('reason',       sa.String(255), nullable=False),
        sa.Column('block_date',   sa.Date(), server_default=sa.text('current_date')),
        sa.Column('unblock_date', sa.Date()),
        sa.Column('blocked_by',   postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('status',       sa.String(20), server_default='محجوب'),
        sa.Column('notes',        sa.Text()),
        sa.Column('created_at',   sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',   sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('idx_blocks_student', 'student_blocks', ['student_id'])

    # ── fee_setup ────────────────────────────────────────────────
    op.create_table(
        'fee_setup',
        sa.Column('id',            sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('faculty_id',    sa.String(20), sa.ForeignKey('faculties.id', ondelete='CASCADE')),
        sa.Column('fee_type',      sa.String(100), nullable=False),
        sa.Column('level',         sa.String(50)),
        sa.Column('amount',        sa.Numeric(10, 2), nullable=False),
        sa.Column('semester',      sa.String(30)),
        sa.Column('academic_year', sa.String(20)),
        sa.Column('status',        sa.String(20), server_default='نشط'),
        sa.Column('created_at',    sa.DateTime(), server_default=sa.text('now()')),
        sa.Column('updated_at',    sa.DateTime(), server_default=sa.text('now()')),
    )

    # ── activity_log ─────────────────────────────────────────────
    op.create_table(
        'activity_log',
        sa.Column('id',           sa.BigInteger(), primary_key=True, autoincrement=True),
        sa.Column('user_id',      postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL')),
        sa.Column('entity_type',  sa.String(50), nullable=False),
        sa.Column('entity_id',    sa.String(50)),
        sa.Column('action',       sa.String(30), nullable=False),
        sa.Column('description',  sa.Text()),
        sa.Column('performed_at', sa.DateTime(), server_default=sa.text('now()')),
    )
    op.create_index('idx_activity_user',   'activity_log', ['user_id'])
    op.create_index('idx_activity_entity', 'activity_log', ['entity_type', 'entity_id'])
    op.create_index('idx_activity_time',   'activity_log', ['performed_at'])


def downgrade() -> None:
    op.drop_table('activity_log')
    op.drop_table('fee_setup')
    op.drop_table('student_blocks')
    op.drop_table('registration_requests')
    op.drop_table('student_committee_assignments')
    op.drop_table('committees')
    op.drop_table('financial_records')
    op.drop_table('attendance_records')
    op.drop_table('course_schedules')
    op.drop_table('rooms')
    op.drop_table('grades')
    op.drop_table('enrollments')
    op.drop_table('course_equivalences')
    op.drop_table('course_prerequisites')
    op.drop_table('courses')
    op.drop_table('student_profiles')
    op.drop_table('students')
    op.drop_table('users')
    op.drop_table('departments')
    op.drop_table('faculties')
