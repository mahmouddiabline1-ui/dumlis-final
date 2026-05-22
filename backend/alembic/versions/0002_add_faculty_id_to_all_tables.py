"""Add faculty_id to all tables that were missing it — idempotent version.

Revision ID: 0002
Revises: fe9df367021d
Create Date: 2026-04-21

Uses DO $$ IF NOT EXISTS $$ pattern for every column so the migration
can run safely even if some columns were added manually or by a previous run.
"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = 'fe9df367021d'
branch_labels = None
depends_on = None


# Helper — wraps ADD COLUMN in a DO-block so it skips if column already exists
_ADD_COL = """
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = '{table}' AND column_name = 'faculty_id'
    ) THEN
        ALTER TABLE {table} ADD COLUMN faculty_id VARCHAR(20) REFERENCES faculties(id) {extra};
    END IF;
END$$;
"""

_ADD_INDEX = """
CREATE INDEX IF NOT EXISTS {idx} ON {table} (faculty_id);
"""


def _add_faculty_col(table: str, on_delete: str = "ON DELETE CASCADE") -> None:
    op.execute(_ADD_COL.format(table=table, extra=on_delete))
    op.execute(_ADD_INDEX.format(idx=f"idx_{table}_faculty", table=table))


def upgrade() -> None:
    # ── Add faculty_id to each table (safe / idempotent) ─────────────
    _add_faculty_col('courses',               'ON DELETE SET NULL')
    _add_faculty_col('enrollments',           'ON DELETE CASCADE')
    _add_faculty_col('grades',                'ON DELETE CASCADE')
    _add_faculty_col('rooms',                 'ON DELETE CASCADE')
    _add_faculty_col('course_schedules',      'ON DELETE CASCADE')
    _add_faculty_col('committees',            'ON DELETE CASCADE')
    _add_faculty_col('attendance_records',    'ON DELETE CASCADE')
    _add_faculty_col('registration_requests', 'ON DELETE CASCADE')
    _add_faculty_col('student_blocks',        'ON DELETE CASCADE')
    _add_faculty_col('financial_records',     'ON DELETE CASCADE')
    _add_faculty_col('activity_log',          'ON DELETE CASCADE')

    # ── Backfill existing rows ────────────────────────────────────────

    # courses → departments.faculty_id
    op.execute("""
        UPDATE courses c
        SET faculty_id = d.faculty_id
        FROM departments d
        WHERE c.department_id = d.id
          AND c.faculty_id IS NULL
    """)

    # enrollments → students.faculty_id
    op.execute("""
        UPDATE enrollments e
        SET faculty_id = s.faculty_id
        FROM students s
        WHERE e.student_id = s.student_id
          AND e.faculty_id IS NULL
    """)

    # grades → students.faculty_id
    op.execute("""
        UPDATE grades g
        SET faculty_id = s.faculty_id
        FROM students s
        WHERE g.student_id = s.student_id
          AND g.faculty_id IS NULL
    """)

    # course_schedules → courses.faculty_id
    op.execute("""
        UPDATE course_schedules cs
        SET faculty_id = c.faculty_id
        FROM courses c
        WHERE cs.course_id = c.id
          AND cs.faculty_id IS NULL
          AND c.faculty_id IS NOT NULL
    """)

    # committees → courses.faculty_id
    op.execute("""
        UPDATE committees cm
        SET faculty_id = c.faculty_id
        FROM courses c
        WHERE cm.course_id = c.id
          AND cm.faculty_id IS NULL
          AND c.faculty_id IS NOT NULL
    """)

    # attendance_records → students.faculty_id
    op.execute("""
        UPDATE attendance_records ar
        SET faculty_id = s.faculty_id
        FROM students s
        WHERE ar.student_id = s.student_id
          AND ar.faculty_id IS NULL
    """)

    # registration_requests → students.faculty_id
    op.execute("""
        UPDATE registration_requests rr
        SET faculty_id = s.faculty_id
        FROM students s
        WHERE rr.student_id = s.student_id
          AND rr.faculty_id IS NULL
    """)

    # student_blocks → students.faculty_id
    op.execute("""
        UPDATE student_blocks sb
        SET faculty_id = s.faculty_id
        FROM students s
        WHERE sb.student_id = s.student_id
          AND sb.faculty_id IS NULL
    """)

    # financial_records → students.faculty_id
    op.execute("""
        UPDATE financial_records fr
        SET faculty_id = s.faculty_id
        FROM students s
        WHERE fr.student_id = s.student_id
          AND fr.faculty_id IS NULL
    """)


def downgrade() -> None:
    # Only drop columns that did NOT exist before this migration ran.
    # Since we used IF NOT EXISTS for creation, downgrade is a best-effort.
    tables = [
        'enrollments', 'grades', 'rooms', 'course_schedules',
        'committees', 'attendance_records', 'registration_requests',
        'student_blocks', 'activity_log',
    ]
    for table in tables:
        op.execute(f"""
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = '{table}' AND column_name = 'faculty_id'
                ) THEN
                    ALTER TABLE {table} DROP COLUMN faculty_id;
                END IF;
            END$$;
        """)
