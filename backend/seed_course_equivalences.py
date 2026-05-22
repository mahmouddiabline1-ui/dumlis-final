"""
Seed CourseEquivalence records
Creates mappings between equivalent courses across different programs
"""
from app.database import SessionLocal
from app import models
import random

db = SessionLocal()

print("Creating CourseEquivalence records...")

# Get all students
students = db.query(models.Student).all()

# Get all courses
courses = db.query(models.Course).all()

# Group courses by faculty
faculty_courses = {}
for course in courses:
    if course.faculty_id not in faculty_courses:
        faculty_courses[course.faculty_id] = []
    faculty_courses[course.faculty_id].append(course)

print(f"Found {len(students)} students and {len(courses)} total courses across {len(faculty_courses)} faculties")

created = 0

# For each faculty, create some cross-faculty course equivalences
faculties = list(faculty_courses.keys())

for i, faculty_id in enumerate(faculties):
    courses_in_faculty = faculty_courses[faculty_id]

    # Skip if only 1 faculty or not enough courses
    if len(faculties) < 2 or len(courses_in_faculty) < 2:
        continue

    # Find a different faculty for equivalences
    other_faculty_idx = (i + 1) % len(faculties)
    other_faculty_id = faculties[other_faculty_idx]
    other_faculty_courses = faculty_courses[other_faculty_id]

    if len(other_faculty_courses) < 2:
        continue

    # For each student in this faculty, create 2-3 course equivalences
    faculty_students = [s for s in students if s.faculty_id == faculty_id]

    for student in faculty_students[:min(50, len(faculty_students))]:  # Limit to 50 students per faculty
        # Randomly select 2-3 courses from the faculty for equivalence
        num_equivalences = random.randint(2, 3)
        sampled_courses = random.sample(
            courses_in_faculty,
            min(num_equivalences, len(courses_in_faculty))
        )

        for original_course in sampled_courses:
            # Find a course in the other faculty that could be equivalent
            equivalent_course = random.choice(other_faculty_courses)

            # Create equivalence
            equivalence = models.CourseEquivalence(
                student_id=student.student_id,
                original_course_id=original_course.id,
                equivalent_course_id=equivalent_course.id,
                status=random.choice(['معتمد', 'قيد المراجعة', 'مرفوض'])
            )
            db.add(equivalence)
            created += 1

db.commit()
print(f"Created {created} course equivalence records")

# Verify
total_equiv = db.query(models.CourseEquivalence).count()
print(f"Total CourseEquivalence records in DB: {total_equiv}")

db.close()
