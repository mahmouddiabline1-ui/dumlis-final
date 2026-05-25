"""add gpa and level modification fields to students

Revision ID: 0003
Revises: fe9df367021d
Create Date: 2026-05-25
"""
from alembic import op
import sqlalchemy as sa

revision = '0003'
down_revision = 'fe9df367021d'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('students', sa.Column('gpa_mod_status', sa.String(50), nullable=True))
    op.add_column('students', sa.Column('gpa_mod_reason', sa.Text, nullable=True))
    op.add_column('students', sa.Column('level_mod_status', sa.String(50), nullable=True))
    op.add_column('students', sa.Column('level_mod_reason', sa.Text, nullable=True))


def downgrade():
    op.drop_column('students', 'level_mod_reason')
    op.drop_column('students', 'level_mod_status')
    op.drop_column('students', 'gpa_mod_reason')
    op.drop_column('students', 'gpa_mod_status')
