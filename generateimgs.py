"""
Generate comprehensive UML diagrams based on actual project code
إنشاء مخططات UML شاملة بناءً على كود المشروع الفعلي
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle, FancyArrow, Ellipse
import matplotlib.patches as patches
import numpy as np

# Create output directory
os.makedirs('diagrams_output', exist_ok=True)

# Set style
plt.style.use('default')
plt.rcParams['figure.dpi'] = 300
plt.rcParams['savefig.dpi'] = 300
plt.rcParams['font.size'] = 9
plt.rcParams['font.family'] = 'Arial'

def save_figure(filename, fig):
    """Save figure as PNG"""
    filepath = os.path.join('diagrams_output', filename + '.png')
    fig.savefig(filepath, format='png', bbox_inches='tight', dpi=300, pad_inches=0.1)
    plt.close(fig)
    print(f"OK Generated: {filename}.png")
    return filepath

# ============================================================================
# 3.3.1 USE CASE DIAGRAM
# ============================================================================
def create_use_case_diagram():
    """Create Use Case Diagram based on project roles and features"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 19)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Actors (from types.ts: UserRole) - positioned on left with more space
    actors = [
        (1, 8.5, 'Super Admin'),
        (1, 5, 'Faculty Admin'),
        (1, 1.5, 'Student')
    ]
    
    for x, y, label in actors:
        # Draw stick figure
        ax.plot([x, x], [y-0.4, y+0.4], 'k-', linewidth=2.5)  # Body
        ax.plot([x-0.25, x+0.25], [y+0.25, y+0.25], 'k-', linewidth=2.5)  # Arms
        ax.add_patch(Circle((x, y+0.6), 0.18, fill=False, linewidth=2.5))  # Head
        ax.text(x, y-0.8, label, ha='center', va='top', fontsize=11, weight='bold')
    
    # Use Cases for Super Admin - with more horizontal spacing
    super_admin_cases = [
        (4.5, 8.5, 'View All Faculties'),
        (7, 8.5, 'View Faculty Analytics'),
        (9.5, 8.5, 'Manage Academic Structure'),
        (12, 8.5, 'System Configuration')
    ]
    
    # Use Cases for Faculty Admin - with more spacing between columns and rows
    faculty_admin_cases = [
        # Student Management (column 1)
        (4.5, 6.5, 'Manage Students Data'),
        (4.5, 5.3, 'Student Registration'),
        (4.5, 4.1, 'Student Data Management'),
        (4.5, 2.9, 'Advanced Student Search'),
        # Academic Management (column 2)
        (7, 6.5, 'Academic Registration'),
        (7, 5.3, 'Manage Study Programs'),
        (7, 4.1, 'Course Management'),
        (7, 2.9, 'Manage Schedules'),
        # Grades & Attendance (column 3)
        (9.5, 6.5, 'Enter Grades'),
        (9.5, 5.3, 'Enter Attendance'),
        (9.5, 4.1, 'View Attendance Records'),
        (9.5, 2.9, 'Manage Exam Committees'),
        # Committee Management (new column 6)
        (17, 6.5, 'Define Committees'),
        (17, 5.3, 'Distribute Students'),
        (17, 4.1, 'Generate Seating Numbers'),
        (17, 2.9, 'Auto-Generate Committees'),
        # Financial & Reports (column 4)
        (12, 6.5, 'Manage Fees'),
        (12, 5.3, 'View Reports'),
        (12, 4.1, 'Financial Reports'),
        (12, 2.9, 'View Activity Log'),
        # System Management (column 5)
        (14.5, 6.5, 'Global Search'),
        (14.5, 5.3, 'Manage Report Signatures'),
        (14.5, 4.1, 'Upload Courses'),
        (14.5, 2.9, 'System Edit')
    ]
    
    # Use Cases for Student - with more spacing
    student_cases = [
        (4.5, 1.8, 'View Academic Registration'),
        (4.5, 1, 'View Grades'),
        (7, 1.8, 'View Fees'),
        (7, 1, 'View ID Card'),
        (9.5, 1.8, 'View Schedule'),
        (9.5, 1, 'View Attendance'),
        (12, 1.8, 'Submit Registration Issue'),
        (12, 1, 'View Academic Warnings'),
        (14.5, 1.8, 'View Committee Assignment'),
        (14.5, 1, 'View Seating Number'),
        (17, 1.8, 'Personal Data'),
        (17, 1, 'University Services')
    ]
    
    all_cases = super_admin_cases + faculty_admin_cases + student_cases
    
    # Draw use cases
    for x, y, label in all_cases:
        # Calculate ellipse size based on text length
        text_width = len(label) * 0.1
        ellipse = mpatches.Ellipse((x, y), max(1.5, text_width), 0.5, fill=True, 
                                   facecolor='lightblue', edgecolor='black', linewidth=1.2)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha='center', va='center', fontsize=6.5, weight='bold')
    
    # Draw connections - all black, with clear lines
    # Super Admin connections - only to "View All Faculties" (first case)
    ax.annotate('', xy=(super_admin_cases[0][0]-0.75, super_admin_cases[0][1]), 
               xytext=(1.25, 8.5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    # Faculty Admin connections - only to first four cases (first column)
    for i in range(4):  # First 4 cases: Manage Students Data, Student Registration, Student Data Management, Advanced Student Search
        case_x, case_y, _ = faculty_admin_cases[i]
        ax.annotate('', xy=(case_x-0.75, case_y), xytext=(1.25, 5),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    # Student connections - only to first two cases
    for i in range(2):  # First 2 cases: View Academic Registration, View Grades
        case_x, case_y, _ = student_cases[i]
        ax.annotate('', xy=(case_x-0.65, case_y), xytext=(1.25, 1.5),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Use Case Diagram - DUMLIS System', fontsize=14, weight='bold', pad=10)
    save_figure('3.3.1_use_case_diagram', fig)

# ============================================================================
# 3.3.2 ENTITY RELATIONSHIP DIAGRAM (ERD)
# ============================================================================
def create_erd_diagram():
    """Create ERD based on domain model (TypeScript types/interfaces)"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 19)
    ax.set_ylim(-2.5, 11)
    ax.axis('off')
    
    # Entities from TypeScript types/interfaces (domain model)
    # Updated to include new Academic Rules structure
    entities = [
        # Core entities
        (2, 10, 'User', ['id (PK)', 'name', 'role', 'faculty']),
        (2, 7, 'Student', ['student_id (PK)', 'name', 'national_id', 'faculty_code (FK)', 'department', 'level', 'gpa', 'status', 'regulation']),
        (2, 4, 'Faculty', ['id (PK)', 'name', 'code', 'student_count', 'staff_count']),
        
        # Academic Structure entities (from AcademicStructureManagement)
        (6, 10, 'AcademicFaculty', ['id (PK)', 'name', 'code', 'dean_id', 'departments']),
        (6, 7, 'AcademicDepartment', ['id (PK)', 'name', 'code', 'faculty_id (FK)', 'head_id', 'programs']),
        (6, 4, 'AcademicProgram', ['id (PK)', 'name', 'code', 'degree', 'department_id (FK)', 'total_hours', 'mandatory_hours', 'elective_hours', 'tracks']),
        (6, 1, 'StudyRegulation', ['id (PK)', 'name', 'program_id (FK)', 'registration_rules', 'pass_fail_rules', 'absence_policy']),
        
        # NEW: Academic Rules entity (from AcademicRulesManagement)
        (10, 10, 'AcademicRules', ['id (PK)', 'faculty_id (FK)', 'faculty_name', 'study_system', 'graduation_requirements', 'level_progression', 'evaluation_system', 'retake_rules', 'program_change', 'scientific_trips', 'created_at', 'updated_at']),
        
        # Course entities (now linked to AcademicRules)
        (10, 7, 'AcademicCourse', ['id (PK)', 'code', 'name', 'program_id (FK)', 'theoretical_hours', 'practical_hours', 'credit_hours', 'level', 'type', 'prerequisites']),
        (10, 4, 'Schedule', ['schedule_id (PK)', 'course_id (FK)', 'semester', 'academic_year', 'faculty (FK)', 'level', 'room', 'room_type', 'room_capacity', 'instructor', 'day', 'time']),
        
        # Registration entities
        (14, 10, 'Enrollment', ['enrollment_id (PK)', 'student_id (FK)', 'course_code (FK)', 'group', 'registration_date', 'status']),
        (14, 7, 'RegistrationIssue', ['req_id (PK)', 'student_id (FK)', 'date', 'comment', 'status']),
        
        # Academic entities
        (18, 10, 'Grade', ['grade_id (PK)', 'student_id (FK)', 'course_code (FK)', 'semester', 'grade', 'points']),
        (18, 7, 'Attendance', ['attendance_id (PK)', 'student_id (FK)', 'course', 'session_type', 'week', 'status', 'date']),
        
        # Financial entities
        (14, 4, 'Fees', ['fee_id (PK)', 'student_id (FK)', 'item', 'amount', 'paid', 'remaining', 'status']),
        
        # Student Profile entities (from StudentProfile)
        (10, 1, 'StudentProfile', ['id (PK)', 'student_id (FK)', 'personal_data', 'contact_data', 'family_data', 'qualification_data', 'military_data', 'medical_data']),
        
        # NEW: Committee Management entities
        (14, 1, 'Committee', ['id (PK)', 'name', 'course_id (FK)', 'room_id (FK)', 'capacity', 'assigned_students', 'status', 'seating_arrangement']),
        (18, 1, 'StudentCommitteeAssignment', ['id (PK)', 'student_id (FK)', 'committee_id (FK)', 'seat_number', 'row', 'column', 'exam_date', 'exam_time']),
        (14, -2, 'Classroom', ['id (PK)', 'code', 'name', 'type', 'capacity', 'building', 'floor', 'status']),
        (18, -2, 'Lab', ['id (PK)', 'code', 'name', 'type', 'capacity', 'equipment', 'status']),
        
        # System entities
        (18, 4, 'ActivityLog', ['id (PK)', 'timestamp', 'user', 'action', 'entity', 'details', 'faculty']),
        (18, 7, 'ReportSignature', ['id (PK)', 'report_name', 'signatory_name', 'title', 'order', 'is_active'])
    ]
    
    for x, y, name, attrs in entities:
        # Draw entity box
        height = 0.3 + len(attrs) * 0.2
        box = Rectangle((x-0.7, y-height/2), 1.4, height, 
                       facecolor='lightyellow', edgecolor='black', linewidth=1.2)
        ax.add_patch(box)
        
        # Entity name
        ax.text(x, y+height/2-0.1, name, ha='center', va='top', 
               fontsize=8, weight='bold', bbox=dict(boxstyle='round,pad=0.15', 
               facecolor='lightblue', edgecolor='black'))
        
        # Attributes
        for i, attr in enumerate(attrs):
            ax.text(x, y+height/2-0.25-i*0.2, attr, ha='center', va='top', fontsize=6)
    
    # Relationships (updated to include AcademicRules)
    relationships = [
        ((2.9, 10), (5.1, 10), 'has role'),
        ((2.9, 7), (5.1, 7), 'enrolls in'),
        ((2.9, 4), (5.1, 4), 'belongs to'),
        ((5.9, 10), (5.9, 7), 'contains'),
        ((5.9, 7), (5.9, 4), 'has'),
        ((5.9, 4), (5.9, 1), 'follows'),
        # NEW: AcademicRules relationships
        ((5.9, 4), (9.1, 10), 'defines rules'),
        ((9.1, 10), (9.1, 7), 'contains courses'),
        ((9.1, 7), (9.1, 4), 'scheduled in'),
        ((6.9, 4), (9.1, 10), 'follows rules'),
        ((6.9, 10), (9.1, 10), 'manages rules'),
        ((6.9, 7), (9.1, 7), 'has'),
        ((2.9, 7), (9.1, 10), 'subject to'),
        ((2.9, 7), (9.1, 7), 'enrolls'),
        ((2.9, 7), (9.1, 4), 'attends'),
        ((2.9, 7), (13.1, 10), 'receives'),
        ((2.9, 7), (13.1, 7), 'has'),
        ((2.9, 7), (9.1, 1), 'has profile'),
        ((13.9, 10), (17.1, 10), 'receives'),
        ((13.9, 7), (17.1, 7), 'has'),
        # NEW: Committee relationships
        ((9.1, 7), (13.1, 1), 'examined in'),
        ((2.9, 7), (13.1, 1), 'assigned to'),
        ((13.1, 1), (17.1, 1), 'has assignment'),
        ((13.1, 1), (13.1, -2), 'uses room'),
        ((13.1, 1), (17.1, -2), 'uses lab'),
        ((17.9, 4), (17.9, 7), 'signed by'),
    ]
    
    for (x1, y1), (x2, y2), label in relationships:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='<->', lw=1, color='darkblue'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y, label, ha='center', va='center',
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'),
               fontsize=6)
    
    ax.set_title('Entity Relationship Diagram (ERD) - DUMLIS Database', 
                fontsize=14, weight='bold', pad=10)
    save_figure('3.3.2_erd_diagram', fig)

# ============================================================================
# 3.3.3 CONTEXT DIAGRAM
# ============================================================================
def create_context_diagram():
    """Create Context Diagram based on App.tsx"""
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Central system (from App.tsx - DUMLIS)
    center_box = FancyBboxPatch((5, 4), 2, 2, boxstyle="round,pad=0.4",
                               facecolor='lightblue', edgecolor='black', linewidth=2.5)
    ax.add_patch(center_box)
    ax.text(6, 5.5, 'DUMLIS\n(Course Management\nPlatform)', ha='center', va='center',
           fontsize=12, weight='bold')
    ax.text(6, 3.8, '0.0', ha='center', fontsize=10, weight='bold')
    
    # External entities (from App.tsx roles)
    entities = [
        (1, 8, 'Super Admin'),
        (11, 8, 'Faculty Admin'),
        (1, 1, 'Student')
    ]
    
    for x, y, label in entities:
        box = Rectangle((x-1, y-0.7), 2, 1.4, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=10, weight='bold')
    
    # Faculty Data - larger external entity (2x size)
    analytics_x, analytics_y = 12.5, 1
    analytics_box = Rectangle((analytics_x-2, analytics_y-1.4), 4, 2.8, facecolor='lightgreen',
                              edgecolor='black', linewidth=2)
    ax.add_patch(analytics_box)
    ax.text(analytics_x, analytics_y, 'Faculty Data', ha='center', va='center', 
           fontsize=11, weight='bold')
    
    # Data flows (from App.tsx interactions and new features)
    flows = [
        ((1, 8), (5, 6), 'View Faculties\nAnalytics\nManage Structure'),
        ((5, 6), (1, 8), 'Faculty Data\nAnalytics'),
        ((11, 8), (7, 6), 'Manage Students\nEnter Grades\nEnter Attendance\nManage Courses'),
        ((7, 6), (11, 8), 'Confirmation\nReports\nData'),
        ((1, 1), (5, 4), 'View Registration\nView Grades\nView Fees\nView Services'),
        ((5, 4), (1, 1), 'Student Data\nGrades\nFees Status\nServices'),
        ((1, 1), (5, 4), 'Submit Registration\nIssue Form'),
        ((5, 4), (1, 1), 'Request Status'),
        ((11, 8), (7, 6), 'Global Search\nQuery'),
        ((7, 6), (11, 8), 'Search Results'),
        ((7, 4), (analytics_x-2, analytics_y), 'Faculty Data\nAnalytics'),
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y, label, ha='center', va='center',
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='black'),
               fontsize=8)
    
    ax.set_title('Context Diagram - DUMLIS System', fontsize=14, weight='bold', pad=10)
    save_figure('3.3.3_context_diagram', fig)

# ============================================================================
# 3.3.4 DATA FLOW DIAGRAMS
# ============================================================================
def create_dfd_level0():
    """Create DFD Level 0 based on system architecture"""
    fig, ax = plt.subplots(figsize=(12, 9))
    ax.set_xlim(0, 14)
    ax.set_ylim(-0.5, 10)
    ax.axis('off')
    
    # Central process
    center = FancyBboxPatch((6, 4), 2, 2, boxstyle="round,pad=0.3",
                           facecolor='lightblue', edgecolor='black', linewidth=2.5)
    ax.add_patch(center)
    ax.text(7, 5, 'DUMLIS\nSystem\n0.0', ha='center', va='center', 
           fontsize=11, weight='bold')
    
    # External entities
    entities = [
        (1, 8, 'Super Admin'),
        (13, 8, 'Faculty Admin'),
        (1, 1, 'Student')
    ]
    for x, y, label in entities:
        box = Rectangle((x-0.9, y-0.6), 1.8, 1.2, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold')
    
    # Data stores (based on the domain model and system modules)
    # Updated to include AcademicRules storage
    stores = [
        (3, 5, 'Student\nDatabase'),
        (11, 5, 'Course\nDatabase'),
        (7, 2, 'Enrollment\nDatabase'),
        (3, 2, 'Grades\nDatabase'),
        (11, 2, 'Attendance\nDatabase'),
        (7, 0, 'Academic\nStructure'),
        (11, 0, 'Academic\nRules'),
        (3, 0, 'Report\nSignatures')
    ]
    for x, y, label in stores:
        # Draw cylinder
        ellipse_top = mpatches.Ellipse((x, y+0.4), 1.4, 0.35, fill=True,
                                      facecolor='lightyellow', edgecolor='black')
        rect = Rectangle((x-0.7, y-0.4), 1.4, 0.8, facecolor='lightyellow',
                        edgecolor='black')
        ellipse_bottom = mpatches.Ellipse((x, y-0.4), 1.4, 0.35, fill=True,
                                         facecolor='lightyellow', edgecolor='black')
        ax.add_patch(ellipse_top)
        ax.add_patch(rect)
        ax.add_patch(ellipse_bottom)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Flows
    flows = [
        ((1.9, 8), (6, 6), 'View Request'),
        ((6, 6), (1.9, 8), 'Analytics Data'),
        ((13.1, 8), (8, 6), 'Manage Request'),
        ((8, 6), (13.1, 8), 'Confirmation'),
        ((1.9, 1), (6, 4), 'View Request'),
        ((6, 4), (1.9, 1), 'Student Data'),
        ((6, 4), (3.7, 5), 'Student Data'),
        ((3.7, 5), (6, 4), 'Retrieve Data'),
        ((8, 6), (11.3, 5), 'Course Data'),
        ((11.3, 5), (8, 6), 'Course Info'),
        ((8, 6), (11.3, 2), 'Attendance Data'),
        ((11.3, 2), (8, 6), 'Attendance Info'),
        ((8, 6), (7.3, 0), 'Structure Data'),
        ((7.3, 0), (8, 6), 'Structure Info'),
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.2, color='black'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        if abs(x1-x2) > 2:
            ax.text(mid_x, mid_y, label, ha='center', va='center',
                   bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='black'),
                   fontsize=7)
    
    ax.set_title('DFD Level 0 - DUMLIS System', fontsize=14, weight='bold', pad=10)
    save_figure('3.3.4.1_dfd_level0', fig)

def create_dfd_level1():
    """Create DFD Level 1 - Decomposed processes"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 16)
    ax.set_ylim(-4.5, 12)
    ax.axis('off')
    
    # Processes (from ContentArea.tsx and components)
    # Updated to include Academic Rules Management
    processes = [
        (2, 10, '1.0\nStudent\nManagement'),
        (6, 10, '2.0\nRegistration\nManagement'),
        (10, 10, '3.0\nGrade\nManagement'),
        (14, 10, '4.0\nSchedule\nManagement'),
        (2, 6, '5.0\nFees\nManagement'),
        (6, 6, '6.0\nReport\nGeneration'),
        (10, 6, '7.0\nActivity\nLogging'),
        (14, 6, '8.0\nSystem\nAdministration'),
        (2, 2, '9.0\nAttendance\nManagement'),
        (6, 2, '10.0\nAcademic\nStructure'),
        (10, 2, '11.0\nAcademic\nRules\nManagement'),
        (14, 2, '12.0\nGlobal\nSearch'),
        (2, -1, '13.0\nCommittee\nDefinition'),
        (6, -1, '14.0\nStudent\nDistribution'),
        (10, -1, '15.0\nSeating\nNumbers')
    ]
    
    for x, y, label in processes:
        box = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Data stores (updated to include AcademicRules)
    stores = [
        (4, 8, 'D1\nStudent\nDB'),
        (8, 8, 'D2\nEnrollment\nDB'),
        (12, 8, 'D3\nGrades\nDB'),
        (4, 4, 'D4\nFees\nDB'),
        (8, 4, 'D5\nCourses\nDB'),
        (12, 4, 'D6\nActivity\nLog'),
        (4, 0, 'D7\nAttendance\nDB'),
        (8, 0, 'D8\nAcademic\nStructure'),
        (12, 0, 'D9\nAcademic\nRules'),
        (4, -2, 'D10\nReport\nSignatures'),
        (8, -2, 'D11\nCommittees\nDB'),
        (12, -2, 'D12\nClassrooms\n& Labs'),
        (8, -4, 'D13\nSeating\nAssignments')
    ]
    
    for x, y, label in stores:
        ellipse_top = mpatches.Ellipse((x, y+0.3), 1.2, 0.3, fill=True,
                                      facecolor='lightyellow', edgecolor='black')
        rect = Rectangle((x-0.6, y-0.3), 1.2, 0.6, facecolor='lightyellow',
                        edgecolor='black')
        ellipse_bottom = mpatches.Ellipse((x, y-0.3), 1.2, 0.3, fill=True,
                                         facecolor='lightyellow', edgecolor='black')
        ax.add_patch(ellipse_top)
        ax.add_patch(rect)
        ax.add_patch(ellipse_bottom)
        ax.text(x, y, label, ha='center', va='center', fontsize=7, weight='bold')
    
    # External entities
    entities = [(0.5, 8, 'Admin'), (15.5, 8, 'Student')]
    for x, y, label in entities:
        box = Rectangle((x-0.6, y-0.4), 1.2, 0.8, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Key flows
    key_flows = [
        ((0.5, 8), (1.2, 10), 'Student Data'),
        ((1.2, 10), (3.4, 8), 'Store'),
        ((1.2, 10), (5.2, 10), 'Student Info'),
        ((5.2, 10), (7.4, 8), 'Enrollment'),
        ((9.2, 10), (11.4, 8), 'Grades'),
        ((15.5, 8), (13.8, 10), 'View Request'),
    ]
    
    for (x1, y1), (x2, y2), label in key_flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1, color='darkblue'))
    
    ax.set_title('DFD Level 1 - DUMLIS System Processes', fontsize=14, weight='bold', pad=10)
    save_figure('3.3.4.2_dfd_level1', fig)

def create_dfd_level2():
    """Create DFD Level 2 - Registration Management decomposition"""
    fig, ax = plt.subplots(figsize=(12, 9))
    ax.set_xlim(0, 14)
    ax.set_ylim(-0.5, 10)
    ax.axis('off')
    
    # Sub-processes of Registration (from StudentRegistrationManagement.tsx)
    processes = [
        (2, 8, '2.1\nReceive\nRegistration\nRequest'),
        (5, 8, '2.2\nValidate\nStudent\nStatus'),
        (8, 8, '2.3\nCheck\nPrerequisites'),
        (11, 8, '2.4\nCheck Course\nAvailability'),
        (2, 5, '2.5\nProcess\nRegistration'),
        (5, 5, '2.6\nHandle\nRegistration\nIssues'),
        (8, 5, '2.7\nGenerate\nConfirmation'),
        (11, 5, '2.8\nUpdate\nEnrollment')
    ]
    
    for x, y, label in processes:
        box = FancyBboxPatch((x-0.7, y-0.5), 1.4, 1.0, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=7, weight='bold')
    
    # Data stores
    stores = [
        (2, 2, 'D1\nStudent\nDB'),
        (5, 2, 'D2\nCourse\nDB'),
        (8, 2, 'D3\nEnrollment\nDB'),
        (11, 2, 'D4\nRegistration\nIssues'),
        (2, 0, 'D5\nAcademic\nStructure'),
        (5, 0, 'D6\nSchedule\nDB')
    ]
    
    for x, y, label in stores:
        ellipse_top = mpatches.Ellipse((x, y+0.3), 1.0, 0.3, fill=True,
                                      facecolor='lightyellow', edgecolor='black')
        rect = Rectangle((x-0.5, y-0.3), 1.0, 0.6, facecolor='lightyellow',
                        edgecolor='black')
        ellipse_bottom = mpatches.Ellipse((x, y-0.3), 1.0, 0.3, fill=True,
                                         facecolor='lightyellow', edgecolor='black')
        ax.add_patch(ellipse_top)
        ax.add_patch(rect)
        ax.add_patch(ellipse_bottom)
        ax.text(x, y, label, ha='center', va='center', fontsize=7, weight='bold')
    
    # External entities
    entities = [(0.5, 6.5, 'Student'), (13.5, 6.5, 'Admin')]
    for x, y, label in entities:
        box = Rectangle((x-0.5, y-0.3), 1.0, 0.6, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Flows
    flows = [
        ((0.5, 6.5), (1.3, 8), 'Registration\nRequest'),
        ((1.3, 8), (4.3, 8), 'Request Data'),
        ((4.3, 8), (2, 2.3), 'Validate'),
        ((2, 2.3), (4.3, 8), 'Student Info'),
        ((4.3, 8), (7.3, 8), 'Valid Request'),
        ((7.3, 8), (5, 2.3), 'Check Course'),
        ((5, 2.3), (7.3, 8), 'Course Info'),
        ((7.3, 8), (10.3, 8), 'Check Availability'),
        ((10.3, 8), (5, 2.3), 'Schedule Info'),
        ((10.3, 8), (1.3, 5), 'Approved'),
        ((1.3, 5), (8, 2.3), 'Store'),
        ((1.3, 5), (4.3, 5), 'Issue Data'),
        ((4.3, 5), (13.5, 6.5), 'Confirmation'),
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1, color='darkblue'))
        if abs(x1-x2) > 1 or abs(y1-y2) > 1:
            mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
            ax.text(mid_x, mid_y, label, ha='center', va='center',
                   bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'),
                   fontsize=6)
    
    ax.set_title('DFD Level 2 - Registration Management Process', 
                fontsize=14, weight='bold', pad=10)
    save_figure('3.3.4.3_dfd_level2', fig)

# ============================================================================
# 3.3.5 ACTIVITY DIAGRAMS
# ============================================================================
def create_activity_diagram_student():
    """Create Activity Diagram for Student (from StudentDashboard.tsx)"""
    fig, ax = plt.subplots(figsize=(8, 12))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 18)
    ax.axis('off')
    
    # Start
    ax.add_patch(Circle((5, 17), 0.25, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=1.5))
    ax.text(5, 17, 'Start', ha='center', va='center', fontsize=8, weight='bold')
    
    # Activities (from STUDENT_NAVIGATION and StudentDashboard.tsx)
    activities = [
        (5, 15.5, 'Login to System'),
        (5, 14, 'View Dashboard'),
        (5, 12.5, 'Select Service'),
        (5, 11, 'View Academic\nRegistration'),
        (5, 9.5, 'View Grades'),
        (5, 8, 'View Fees'),
        (5, 6.5, 'View ID Card'),
        (5, 5, 'View Schedule'),
        (5, 3.5, 'View Attendance'),
        (5, 2, 'Submit Registration\nIssue Form'),
        (5, 0.5, 'View Academic\nWarnings')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.1, y-0.35), 2.2, 0.7, boxstyle="round,pad=0.15",
                           facecolor='lightblue', edgecolor='black', linewidth=1.2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=7)
    
    # Decision (from reg_form_issue logic)
    decision = mpatches.RegularPolygon((5, 2), 4, radius=0.4, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.2)
    ax.add_patch(decision)
    ax.text(5, 2, 'Issue\nResolved?', ha='center', va='center', fontsize=6.5, weight='bold')
    
    # End
    ax.add_patch(Circle((5, 0.5), 0.25, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=1.5))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=8, weight='bold')
    
    # Flow arrows
    for i in range(len(activities)):
        y1 = 17 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 2.5), xytext=(5, 3.1),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.annotate('', xy=(5, 1.5), xytext=(5, 1.5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.text(6.5, 2, 'Yes', fontsize=6.5)
    ax.text(3.5, 2, 'No', fontsize=6.5)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 1.5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Student Workflow', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.1_activity_diagram_student', fig)

def create_activity_diagram_faculty_admin():
    """Create Activity Diagram for Faculty Admin (from ADMIN_NAVIGATION)"""
    fig, ax = plt.subplots(figsize=(8, 12))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 18)
    ax.axis('off')
    
    # Start
    ax.add_patch(Circle((5, 17), 0.25, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=1.5))
    ax.text(5, 17, 'Start', ha='center', va='center', fontsize=8, weight='bold')
    
    # Activities (from ADMIN_NAVIGATION and ContentArea.tsx)
    activities = [
        (5, 15.5, 'Login to System'),
        (5, 14, 'View Dashboard'),
        (5, 12.5, 'Select Tab\n(Students/Registration/etc)'),
        (5, 11, 'Manage Students\nData'),
        (5, 9.5, 'Enter Grades'),
        (5, 8, 'Manage Academic\nRegistration'),
        (5, 6.5, 'Enter Attendance'),
        (5, 5, 'Manage Schedules'),
        (5, 3.5, 'Manage Courses'),
        (5, 2, 'Manage Report\nSignatures'),
        (5, 0.5, 'View Activity Log')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.1, y-0.35), 2.2, 0.7, boxstyle="round,pad=0.15",
                           facecolor='lightblue', edgecolor='black', linewidth=1.2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=7)
    
    # End
    ax.add_patch(Circle((5, 0.5), 0.25, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=1.5))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=8, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        y1 = 17 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 0.8), xytext=(5, 3.1),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Faculty Admin Workflow', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.2_activity_diagram_professor', fig)

def create_activity_diagram_advisor():
    """Create Activity Diagram for Academic Advisor"""
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 16)
    ax.axis('off')
    
    ax.add_patch(Circle((5, 15), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 15, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    activities = [
        (5, 13.5, 'Login to System'),
        (5, 12, 'View Registration\nRequests'),
        (5, 10.5, 'Review Student\nRecords'),
        (5, 9, 'Check Prerequisites'),
        (5, 7.5, 'Approve/Reject\nRegistration'),
        (5, 6, 'Notify Student')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.1, y-0.35), 2.2, 0.7, boxstyle="round,pad=0.15",
                           facecolor='lightblue', edgecolor='black', linewidth=1.2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=7)
    
    decision = mpatches.RegularPolygon((5, 4.5), 4, radius=0.4, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.2)
    ax.add_patch(decision)
    ax.text(5, 4.5, 'Approve?', ha='center', va='center', fontsize=6.5, weight='bold')
    
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        y1 = 15 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 5), xytext=(5, 4.9),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.text(6.5, 4.5, 'Yes', fontsize=6.5)
    ax.text(3.5, 4.5, 'No', fontsize=6.5)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 4),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Academic Advisor Workflow', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.3_activity_diagram_advisor', fig)

def create_activity_diagram_administrator():
    """Create Activity Diagram for Administrator"""
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 16)
    ax.axis('off')
    
    ax.add_patch(Circle((5, 15), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 15, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    activities = [
        (5, 13.5, 'Login to System'),
        (5, 12, 'Select Action'),
        (5, 10.5, 'Manage Users'),
        (5, 9, 'Manage Courses'),
        (5, 7.5, 'System\nConfiguration'),
        (5, 6, 'View System Logs')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.1, y-0.35), 2.2, 0.7, boxstyle="round,pad=0.15",
                           facecolor='lightblue', edgecolor='black', linewidth=1.2)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=7)
    
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        y1 = 15 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 0.8), xytext=(5, 5.6),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Administrator Workflow', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.4_activity_diagram_administrator', fig)

def create_activity_diagram_absence_warning():
    """Create Activity Diagram for Absence Warning Process"""
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 16)
    ax.axis('off')
    
    ax.add_patch(Circle((5, 15), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 15, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    activities = [
        (5, 13.5, 'Check Student\nAbsences'),
        (5, 12, 'Calculate Absence\nRate'),
        (5, 10.5, 'Generate Warning'),
        (5, 9, 'Send Warning to\nStudent'),
        (5, 7.5, 'Notify Academic\nAdvisor')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                           facecolor='lightyellow', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
    decision = mpatches.RegularPolygon((5, 5.5), 4, radius=0.4, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.2)
    ax.add_patch(decision)
    ax.text(5, 5.5, 'Rate >\nThreshold?', ha='center', va='center', fontsize=6.5, weight='bold')
    
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        y1 = 15 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 6), xytext=(5, 5.9),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.text(6.5, 5.5, 'Yes', fontsize=6.5)
    ax.text(3.5, 5.5, 'No', fontsize=6.5)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Absence Warning Process', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.5_activity_diagram_absence_warning', fig)

def create_activity_diagram_academic_warning():
    """Create Activity Diagram for Academic Warning Process"""
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 16)
    ax.axis('off')
    
    ax.add_patch(Circle((5, 15), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 15, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    activities = [
        (5, 13.5, 'Calculate Student\nGPA'),
        (5, 12, 'Generate Academic\nWarning'),
        (5, 10.5, 'Send Warning to\nStudent'),
        (5, 9, 'Notify Academic\nAdvisor'),
        (5, 7.5, 'Schedule Meeting')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                           facecolor='lightyellow', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
    decision = mpatches.RegularPolygon((5, 5.5), 4, radius=0.4, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.2)
    ax.add_patch(decision)
    ax.text(5, 5.5, 'GPA <\nMinimum?', ha='center', va='center', fontsize=6.5, weight='bold')
    
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        y1 = 15 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 6), xytext=(5, 5.9),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.text(6.5, 5.5, 'Yes', fontsize=6.5)
    ax.text(3.5, 5.5, 'No', fontsize=6.5)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Academic Warning Process', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.6_activity_diagram_academic_warning', fig)

# ============================================================================
# 3.3.6 SEQUENCE DIAGRAMS
# ============================================================================
def create_sequence_diagram_student():
    """Create Sequence Diagram for Student (from App.tsx and ContentArea.tsx)"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Actors (lifelines)
    actors = [
        (2, 9, 'Student'),
        (5, 9, 'LoginPage'),
        (8, 9, 'App'),
        (11, 9, 'ContentArea'),
        (14, 9, 'Database')
    ]
    
    for x, y, label in actors:
        ax.text(x, y, label, ha='center', va='bottom', fontsize=8, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.2, alpha=0.5)
    
    # Messages (from App.tsx flow)
    messages = [
        (2, 8.5, 5, '1. Login Request'),
        (5, 8, 8, '2. Authenticate'),
        (8, 7.5, 14, '3. Verify User'),
        (14, 7, 8, '4. User Data'),
        (8, 6.5, 11, '5. Render ContentArea'),
        (11, 6, 14, '6. Fetch Student Data'),
        (14, 5.5, 11, '7. Return Data'),
        (11, 5, 2, '8. Display Dashboard')
    ]
    
    for x1, y1, x2, label in messages:
        ax.annotate('', xy=(x2, y1), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.2, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=7,
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Student Login and View', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.6.1_sequence_diagram_student', fig)

def create_sequence_diagram_faculty_admin():
    """Create Sequence Diagram for Faculty Admin"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    actors = [
        (2, 9, 'Faculty\nAdmin'),
        (5, 9, 'App'),
        (8, 9, 'ContentArea'),
        (11, 9, 'DynamicPage'),
        (14, 9, 'Database')
    ]
    
    for x, y, label in actors:
        ax.text(x, y, label, ha='center', va='bottom', fontsize=8, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.2, alpha=0.5)
    
    messages = [
        (2, 8.5, 5, '1. Select Tab'),
        (5, 8, 8, '2. Navigate'),
        (8, 7.5, 11, '3. Load Page'),
        (11, 7, 14, '4. Query Data'),
        (14, 6.5, 11, '5. Return Data'),
        (11, 6, 8, '6. Render Table'),
        (8, 5.5, 2, '7. Display Content')
    ]
    
    for x1, y1, x2, label in messages:
        ax.annotate('', xy=(x2, y1), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=7,
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Faculty Admin Operations', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.6.2_sequence_diagram_professor', fig)

def create_sequence_diagram_advisor():
    """Create Sequence Diagram for Academic Advisor"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    actors = [
        (2, 9, 'Advisor'),
        (5, 9, 'App'),
        (8, 9, 'ContentArea'),
        (11, 9, 'Database'),
        (14, 9, 'Student')
    ]
    
    for x, y, label in actors:
        ax.text(x, y, label, ha='center', va='bottom', fontsize=8, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.2, alpha=0.5)
    
    messages = [
        (2, 8.5, 5, '1. View Requests'),
        (5, 8, 8, '2. Load Page'),
        (8, 7.5, 11, '3. Query Requests'),
        (11, 7, 8, '4. Return Data'),
        (8, 6.5, 2, '5. Display Requests'),
        (2, 6, 5, '6. Approve/Reject'),
        (5, 5.5, 11, '7. Update Status'),
        (11, 5, 14, '8. Notify Student')
    ]
    
    for x1, y1, x2, label in messages:
        ax.annotate('', xy=(x2, y1), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=7,
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Academic Advisor Operations', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.6.3_sequence_diagram_advisor', fig)

def create_sequence_diagram_administrator():
    """Create Sequence Diagram for Administrator"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    actors = [
        (2, 9, 'Administrator'),
        (5, 9, 'App'),
        (8, 9, 'System'),
        (11, 9, 'Database'),
        (14, 9, 'Activity Log')
    ]
    
    for x, y, label in actors:
        ax.text(x, y, label, ha='center', va='bottom', fontsize=8, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.2, alpha=0.5)
    
    messages = [
        (2, 8.5, 5, '1. System Update'),
        (5, 8, 8, '2. Process Update'),
        (8, 7.5, 11, '3. Update Database'),
        (11, 7, 8, '4. Confirm Update'),
        (8, 6.5, 14, '5. Log Activity'),
        (14, 6, 8, '6. Logged'),
        (8, 5.5, 5, '7. Update Success'),
        (5, 5, 2, '8. Confirmation')
    ]
    
    for x1, y1, x2, label in messages:
        ax.annotate('', xy=(x2, y1), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=7,
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Administrator Operations', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.6.4_sequence_diagram_administrator', fig)

def create_sequence_diagram_controller():
    """Create Sequence Diagram for Controller/System Monitoring"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    actors = [
        (2, 9, 'Controller'),
        (5, 9, 'System'),
        (8, 9, 'Database'),
        (11, 9, 'Warning\nService'),
        (14, 9, 'Student')
    ]
    
    for x, y, label in actors:
        ax.text(x, y, label, ha='center', va='bottom', fontsize=8, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.2, alpha=0.5)
    
    messages = [
        (2, 8.5, 5, '1. Monitor System'),
        (5, 8, 8, '2. Query Data'),
        (8, 7.5, 5, '3. Return Status'),
        (5, 7, 2, '4. System Status'),
        (2, 6.5, 5, '5. Generate Warnings'),
        (5, 6, 8, '6. Check Absences/Grades'),
        (8, 5.5, 5, '7. Return Data'),
        (5, 5, 11, '8. Create Warning'),
        (11, 4.5, 14, '9. Send Warning')
    ]
    
    for x1, y1, x2, label in messages:
        ax.annotate('', xy=(x2, y1), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=7,
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Controller/System Monitoring', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.6.5_sequence_diagram_controller', fig)

def create_system_architecture_diagram():
    """Create System Architecture Diagram for DUMLIS (web app layers)"""
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Layer boxes
    frontend = FancyBboxPatch((1, 6), 4, 3, boxstyle="round,pad=0.4",
                              facecolor='#d6ecff', edgecolor='black', linewidth=2)
    data_mgmt = FancyBboxPatch((6, 6), 4.5, 3, boxstyle="round,pad=0.4",
                               facecolor='#dff7df', edgecolor='black', linewidth=2)
    data_arch = FancyBboxPatch((11.5, 6), 4, 3, boxstyle="round,pad=0.4",
                               facecolor='#fff4cc', edgecolor='black', linewidth=2)

    ax.add_patch(frontend)
    ax.add_patch(data_mgmt)
    ax.add_patch(data_arch)

    ax.text(3, 8.4, 'Frontend Layer', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(3, 7.4, 'React + TypeScript\nTailwind CSS\nResponsive UI', ha='center', va='center', fontsize=9)

    ax.text(8.25, 8.4, 'Data Management Layer', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(8.25, 7.3, 'Repository Pattern\nDecoupled Data Sources\nBusiness Rules + Reports', ha='center', va='center', fontsize=9)

    ax.text(13.5, 8.4, 'Data Architecture', ha='center', va='center', fontsize=11, weight='bold')
    ax.text(13.5, 7.3, 'TypeScript Interfaces\nEntities & Relationships\n(ERD-aligned)', ha='center', va='center', fontsize=9)

    # Optional future integration (dashed)
    future_backend = FancyBboxPatch((6, 1.2), 4.5, 3, boxstyle="round,pad=0.4",
                                    facecolor='white', edgecolor='gray', linewidth=2, linestyle='--')
    future_db = FancyBboxPatch((11.5, 1.2), 4, 3, boxstyle="round,pad=0.4",
                               facecolor='white', edgecolor='gray', linewidth=2, linestyle='--')
    ax.add_patch(future_backend)
    ax.add_patch(future_db)

    ax.text(8.25, 3.7, 'Backend Integration (Planned)', ha='center', va='center', fontsize=10, weight='bold', color='gray')
    ax.text(8.25, 2.5, 'REST/GraphQL API\nAuth / Persistence', ha='center', va='center', fontsize=9, color='gray')

    ax.text(13.5, 3.7, 'Database Integration (Planned)', ha='center', va='center', fontsize=10, weight='bold', color='gray')
    ax.text(13.5, 2.5, 'PostgreSQL / MySQL\nor other DBMS', ha='center', va='center', fontsize=9, color='gray')

    # Arrows between top layers
    ax.annotate('', xy=(5.9, 7.5), xytext=(5.1, 7.5),
                arrowprops=dict(arrowstyle='->', lw=2, color='black'))
    ax.annotate('', xy=(11.4, 7.5), xytext=(10.6, 7.5),
                arrowprops=dict(arrowstyle='->', lw=2, color='black'))

    # Arrows to optional future
    ax.annotate('', xy=(8.25, 4.4), xytext=(8.25, 6),
                arrowprops=dict(arrowstyle='->', lw=1.8, color='gray', linestyle='--'))
    ax.annotate('', xy=(13.5, 4.4), xytext=(13.5, 6),
                arrowprops=dict(arrowstyle='->', lw=1.8, color='gray', linestyle='--'))
    ax.annotate('', xy=(11.5, 2.7), xytext=(10.7, 2.7),
                arrowprops=dict(arrowstyle='->', lw=1.8, color='gray', linestyle='--'))

    ax.set_title('System Architecture - DUMLIS', fontsize=14, weight='bold', pad=12)
    save_figure('3.3.6_system_architecture_diagram', fig)

def create_sequence_diagram_committee_generation():
    """Create Sequence Diagram for Committee Auto-Generation"""
    fig, ax = plt.subplots(figsize=(12, 8))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    actors = [
        (2, 9, 'Admin'),
        (5, 9, 'Committee\nDefinition'),
        (8, 9, 'Registration\nService'),
        (11, 9, 'Room\nService'),
        (14, 9, 'Database')
    ]
    
    for x, y, label in actors:
        ax.text(x, y, label, ha='center', va='bottom', fontsize=8, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.2, alpha=0.5)
    
    messages = [
        (2, 8.5, 5, '1. Request Auto-Generate'),
        (5, 8, 8, '2. Get Enrollments'),
        (8, 7.5, 14, '3. Query Enrollments'),
        (14, 7, 8, '4. Return Enrollments'),
        (8, 6.5, 5, '5. Enrollment Data'),
        (5, 6, 11, '6. Get Available Rooms'),
        (11, 5.5, 14, '7. Query Rooms'),
        (14, 5, 11, '8. Return Rooms'),
        (11, 4.5, 5, '9. Room Data'),
        (5, 4, 14, '10. Create Committees'),
        (5, 3.5, 14, '11. Assign Students'),
        (14, 3, 5, '12. Committees Created'),
        (5, 2.5, 2, '13. Success Message')
    ]
    
    for x1, y1, x2, label in messages:
        ax.annotate('', xy=(x2, y1), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=7,
               bbox=dict(boxstyle='round,pad=0.15', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Committee Auto-Generation', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.6.6_sequence_diagram_committee_generation', fig)

def create_activity_diagram_committee_management():
    """Create Activity Diagram for Committee Management Process"""
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 16)
    ax.axis('off')
    
    ax.add_patch(Circle((5, 15), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 15, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    activities = [
        (5, 13.5, 'Login to System'),
        (5, 12, 'Navigate to Committee\nDefinition'),
        (5, 10.5, 'Select Auto-Generate\nor Manual'),
        (5, 9, 'Auto-Generate\nSelected?'),
        (5, 7.5, 'Get Student Enrollments'),
        (5, 6, 'Group by Course'),
        (5, 4.5, 'Assign to Rooms'),
        (5, 3, 'Generate Seating\nArrangements'),
        (5, 1.5, 'Save Committees\nand Assignments')
    ]
    
    for x, y, label in activities:
        if 'Selected?' in label:
            decision = mpatches.RegularPolygon((x, y), 4, radius=0.4, orientation=np.pi/4,
                                              facecolor='lightcoral', edgecolor='black', linewidth=1.2)
            ax.add_patch(decision)
            ax.text(x, y, label, ha='center', va='center', fontsize=7, weight='bold')
        else:
            box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                               facecolor='lightblue', edgecolor='black', linewidth=1.5)
            ax.add_patch(box)
            ax.text(x, y, label, ha='center', va='center', fontsize=7)
    
    # Manual path (not shown in detail, but indicated)
    manual_box = FancyBboxPatch((7.5, 7.5), 1.5, 1, boxstyle="round,pad=0.15",
                               facecolor='lightyellow', edgecolor='black', linewidth=1.2)
    ax.add_patch(manual_box)
    ax.text(8.25, 8, 'Manual\nDefinition', ha='center', va='center', fontsize=6.5)
    
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        if i == 0:
            y1 = 14.7
        else:
            y1 = activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    # Decision flow
    ax.annotate('', xy=(5, 7.1), xytext=(5, 8.6),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.text(6.5, 7.8, 'Yes', fontsize=6.5)
    ax.annotate('', xy=(7.5, 8), xytext=(5.4, 8),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    ax.text(6.2, 8.3, 'No', fontsize=6.5)
    ax.annotate('', xy=(5, 6.6), xytext=(8.25, 7.5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black', linestyle='--'))
    
    ax.annotate('', xy=(5, 0.8), xytext=(5, 1.1),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Committee Management Process', fontsize=12, weight='bold', pad=10)
    save_figure('3.3.5.7_activity_diagram_committee_management', fig)

def main():
    """Generate all diagrams"""
    print("=" * 60)
    print("Generating Project-Based Diagrams")
    print("=" * 60)
    print()
    
    try:
        # 3.3.1 Use Case Diagram
        create_use_case_diagram()
        
        # 3.3.2 ERD
        create_erd_diagram()
        
        # 3.3.3 Context Diagram
        create_context_diagram()
        
        # 3.3.4 DFD Diagrams
        create_dfd_level0()
        create_dfd_level1()
        create_dfd_level2()
        
        # 3.3.5 Activity Diagrams
        create_activity_diagram_student()
        create_activity_diagram_faculty_admin()
        create_activity_diagram_advisor()
        create_activity_diagram_administrator()
        create_activity_diagram_absence_warning()
        create_activity_diagram_academic_warning()
        
        # 3.3.6 Sequence Diagrams
        create_sequence_diagram_student()
        create_sequence_diagram_faculty_admin()
        create_sequence_diagram_advisor()
        create_sequence_diagram_administrator()
        create_sequence_diagram_controller()
        
        # System Architecture diagram
        create_system_architecture_diagram()
        
        print()
        print("=" * 60)
        print("OK All diagrams generated successfully!")
        print(f"Output directory: {os.path.abspath('diagrams_output')}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nX Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()

