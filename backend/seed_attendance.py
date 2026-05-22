"""
Seed Attendance Records for students
"""
from datetime import date, timedelta
from app.database import SessionLocal
from app import models
import random

db = SessionLocal()

print("Creating Attendance Records for students...")

# Get all student-course enrollments
enrollments = db.query(models.Enrollment).all()
created = 0

# Create attendance for each enrollment across 10 weeks
for enrollment in enrollments[:100]:  # Limit to first 100 for performance
    student = db.query(models.Student).filter(
        models.Student.student_id == enrollment.student_id
    ).first()

    if not student:
        continue

    # Create 10 attendance records (one per week)
    start_date = date(2024, 1, 15)
    for week in range(10):
        att_date = start_date + timedelta(days=week*7)

        # Random status: present (95%) or absent (5%)
        status = "present" if random.random() < 0.95 else "absent"

        attendance = models.AttendanceRecord(
            student_id=student.student_id,
            course_id=enrollment.course_id,
            attendance_date=att_date,
            status=status,
            session_type="محاضرة",
            week_number=week+1
        )
        db.add(attendance)
        created += 1

db.commit()
print(f"Created {created} attendance records")

# Verify
total_att = db.query(models.AttendanceRecord).count()
print(f"Total Attendance Records in DB: {total_att}")

db.close()
