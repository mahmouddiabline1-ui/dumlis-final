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
    fig.savefig(filepath, format='png', bbox_inches='tight', dpi=300)
    plt.close(fig)
    print(f"OK Generated: {filename}.png")
    return filepath

# ============================================================================
# 3.3.1 USE CASE DIAGRAM
# ============================================================================
def create_use_case_diagram():
    """Create Use Case Diagram based on project roles and features"""
    fig, ax = plt.subplots(figsize=(16, 12))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 12)
    ax.axis('off')
    
    # Actors (from types.ts: UserRole)
    actors = [
        (1, 10, 'Super Admin\n(رئيس الجامعة)'),
        (1, 6, 'Faculty Admin\n(عميد الكلية)'),
        (1, 2, 'Student\n(الطالب)')
    ]
    
    for x, y, label in actors:
        # Draw stick figure
        ax.plot([x, x], [y-0.4, y+0.4], 'k-', linewidth=2.5)  # Body
        ax.plot([x-0.25, x+0.25], [y+0.25, y+0.25], 'k-', linewidth=2.5)  # Arms
        ax.add_patch(Circle((x, y+0.6), 0.18, fill=False, linewidth=2.5))  # Head
        ax.text(x, y-0.8, label, ha='center', va='top', fontsize=10, weight='bold')
    
    # Use Cases for Super Admin (from App.tsx and FacultyGrid)
    super_admin_cases = [
        (4, 10.5, 'View All Faculties'),
        (4, 9.5, 'View Faculty\nAnalytics'),
        (4, 8.5, 'Manage System\nConfiguration')
    ]
    
    # Use Cases for Faculty Admin (from ADMIN_NAVIGATION in constants.tsx)
    faculty_admin_cases = [
        (4, 6.5, 'Manage Students\nData'),
        (4, 5.5, 'Academic\nRegistration'),
        (4, 4.5, 'Manage Study\nPrograms'),
        (4, 3.5, 'Manage Schedules'),
        (4, 2.5, 'Enter Grades'),
        (6, 6.5, 'Manage Fees'),
        (6, 5.5, 'View Reports'),
        (6, 4.5, 'Manage Attendance'),
        (6, 3.5, 'View Activity Log'),
        (8, 6.5, 'Upload Courses'),
        (8, 5.5, 'Assign Lecturers'),
        (8, 4.5, 'Manage Exam\nCommittees')
    ]
    
    # Use Cases for Student (from STUDENT_NAVIGATION in constants.tsx)
    student_cases = [
        (4, 2.5, 'View Academic\nRegistration'),
        (4, 1.5, 'View Grades'),
        (6, 2.5, 'View Fees'),
        (6, 1.5, 'View ID Card'),
        (8, 2.5, 'View Schedule'),
        (8, 1.5, 'View Attendance'),
        (10, 2.5, 'Submit Registration\nIssue Form'),
        (10, 1.5, 'View Academic\nWarnings')
    ]
    
    all_cases = super_admin_cases + faculty_admin_cases + student_cases
    
    for x, y, label in all_cases:
        ellipse = mpatches.Ellipse((x, y), 1.6, 0.7, fill=True, 
                                   facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
    # Draw connections
    # Super Admin connections
    for case_x, case_y, _ in super_admin_cases:
        ax.annotate('', xy=(case_x-0.8, case_y), xytext=(1.25, 10),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    # Faculty Admin connections
    for case_x, case_y, _ in faculty_admin_cases:
        ax.annotate('', xy=(case_x-0.8, case_y), xytext=(1.25, 6),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    # Student connections
    for case_x, case_y, _ in student_cases:
        ax.annotate('', xy=(case_x-0.8, case_y), xytext=(1.25, 2),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Use Case Diagram - DUMLIS System', fontsize=18, weight='bold', pad=20)
    save_figure('3.3.1_use_case_diagram', fig)

# ============================================================================
# 3.3.2 ENTITY RELATIONSHIP DIAGRAM (ERD)
# ============================================================================
def create_erd_diagram():
    """Create ERD based on types.ts and mockData.ts"""
    fig, ax = plt.subplots(figsize=(18, 14))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')
    
    # Entities from types.ts and mockData.ts
    entities = [
        # Core entities
        (2, 10, 'User', ['id (PK)', 'name', 'role', 'faculty']),
        (2, 7, 'Student', ['student_id (PK)', 'name', 'national_id', 'faculty_code (FK)', 'department', 'level', 'gpa', 'status']),
        (2, 4, 'Faculty', ['id (PK)', 'name', 'student_count', 'staff_count']),
        
        # Academic entities
        (6, 10, 'Course', ['course_code (PK)', 'course_name', 'program', 'level', 'hours', 'type']),
        (6, 7, 'Program', ['program_id (PK)', 'program_name', 'degree', 'department', 'duration', 'total_hours']),
        (6, 4, 'Schedule', ['schedule_id (PK)', 'semester', 'academic_year', 'faculty (FK)', 'level']),
        
        # Registration entities
        (10, 10, 'Enrollment', ['enrollment_id (PK)', 'student_id (FK)', 'course_code (FK)', 'group', 'registration_date']),
        (10, 7, 'RegistrationIssue', ['req_id (PK)', 'student_id (FK)', 'date', 'comment', 'status']),
        
        # Academic entities
        (14, 10, 'Grade', ['grade_id (PK)', 'student_id (FK)', 'course_code (FK)', 'semester', 'grade', 'points']),
        (14, 7, 'Attendance', ['attendance_id (PK)', 'student_id (FK)', 'course', 'session_type', 'week', 'status']),
        
        # Financial entities
        (10, 4, 'Fees', ['fee_id (PK)', 'student_id (FK)', 'item', 'amount', 'paid', 'remaining', 'status']),
        
        # System entities
        (14, 4, 'ActivityLog', ['id (PK)', 'timestamp', 'user', 'action', 'entity', 'details', 'faculty'])
    ]
    
    for x, y, name, attrs in entities:
        # Draw entity box
        height = 0.4 + len(attrs) * 0.25
        box = Rectangle((x-0.9, y-height/2), 1.8, height, 
                       facecolor='lightyellow', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        
        # Entity name
        ax.text(x, y+height/2-0.15, name, ha='center', va='top', 
               fontsize=10, weight='bold', bbox=dict(boxstyle='round,pad=0.2', 
               facecolor='lightblue', edgecolor='black'))
        
        # Attributes
        for i, attr in enumerate(attrs):
            ax.text(x, y+height/2-0.35-i*0.25, attr, ha='center', va='top', fontsize=7)
    
    # Relationships
    relationships = [
        ((2.9, 10), (5.1, 10), 'has role'),
        ((2.9, 7), (5.1, 7), 'enrolls in'),
        ((2.9, 4), (5.1, 4), 'belongs to'),
        ((6.9, 10), (9.1, 10), 'registers'),
        ((6.9, 7), (9.1, 7), 'has'),
        ((2.9, 7), (9.1, 10), 'enrolls'),
        ((2.9, 7), (9.1, 7), 'submits'),
        ((2.9, 7), (13.1, 10), 'receives'),
        ((2.9, 7), (13.1, 7), 'has'),
        ((2.9, 7), (9.1, 4), 'pays'),
        ((6.9, 4), (9.1, 4), 'contains'),
    ]
    
    for (x1, y1), (x2, y2), label in relationships:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='<->', lw=1.2, color='darkblue'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y, label, ha='center', va='center',
               bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='darkblue'),
               fontsize=7)
    
    ax.set_title('Entity Relationship Diagram (ERD) - DUMLIS Database', 
                fontsize=18, weight='bold', pad=20)
    save_figure('3.3.2_erd_diagram', fig)

# ============================================================================
# 3.3.3 CONTEXT DIAGRAM
# ============================================================================
def create_context_diagram():
    """Create Context Diagram based on App.tsx"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 12)
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
        (1, 8, 'Super Admin\n(رئيس الجامعة)'),
        (11, 8, 'Faculty Admin\n(عميد الكلية)'),
        (1, 1, 'Student\n(الطالب)')
    ]
    
    for x, y, label in entities:
        box = Rectangle((x-1, y-0.7), 2, 1.4, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=10, weight='bold')
    
    # Data flows (from App.tsx interactions)
    flows = [
        ((1, 8), (5, 6), 'View Faculties\nAnalytics'),
        ((5, 6), (1, 8), 'Faculty Data'),
        ((11, 8), (7, 6), 'Manage Students\nEnter Grades\nManage Schedules'),
        ((7, 6), (11, 8), 'Confirmation\nReports'),
        ((1, 1), (5, 4), 'View Registration\nView Grades\nView Fees'),
        ((5, 4), (1, 1), 'Student Data\nGrades\nFees Status'),
        ((1, 1), (5, 4), 'Submit Registration\nIssue Form'),
        ((5, 4), (1, 1), 'Request Status'),
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y, label, ha='center', va='center',
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='black'),
               fontsize=8)
    
    ax.set_title('Context Diagram - DUMLIS System', fontsize=18, weight='bold', pad=20)
    save_figure('3.3.3_context_diagram', fig)

# ============================================================================
# 3.3.4 DATA FLOW DIAGRAMS
# ============================================================================
def create_dfd_level0():
    """Create DFD Level 0 based on system architecture"""
    fig, ax = plt.subplots(figsize=(16, 12))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
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
    
    # Data stores (from mockData.ts structure)
    stores = [
        (3, 5, 'Student\nDatabase'),
        (11, 5, 'Course\nDatabase'),
        (7, 2, 'Enrollment\nDatabase'),
        (3, 2, 'Grades\nDatabase')
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
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.2, color='black'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        if abs(x1-x2) > 2:
            ax.text(mid_x, mid_y, label, ha='center', va='center',
                   bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='black'),
                   fontsize=7)
    
    ax.set_title('DFD Level 0 - DUMLIS System', fontsize=18, weight='bold', pad=20)
    save_figure('3.3.4.1_dfd_level0', fig)

def create_dfd_level1():
    """Create DFD Level 1 - Decomposed processes"""
    fig, ax = plt.subplots(figsize=(18, 14))
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 12)
    ax.axis('off')
    
    # Processes (from ContentArea.tsx and components)
    processes = [
        (2, 10, '1.0\nStudent\nManagement'),
        (6, 10, '2.0\nRegistration\nManagement'),
        (10, 10, '3.0\nGrade\nManagement'),
        (14, 10, '4.0\nSchedule\nManagement'),
        (2, 6, '5.0\nFees\nManagement'),
        (6, 6, '6.0\nReport\nGeneration'),
        (10, 6, '7.0\nActivity\nLogging'),
        (14, 6, '8.0\nSystem\nAdministration')
    ]
    
    for x, y, label in processes:
        box = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    # Data stores
    stores = [
        (4, 8, 'D1\nStudent\nDB'),
        (8, 8, 'D2\nEnrollment\nDB'),
        (12, 8, 'D3\nGrades\nDB'),
        (4, 4, 'D4\nFees\nDB'),
        (8, 4, 'D5\nCourses\nDB'),
        (12, 4, 'D6\nActivity\nLog')
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
    
    ax.set_title('DFD Level 1 - DUMLIS System Processes', fontsize=18, weight='bold', pad=20)
    save_figure('3.3.4.2_dfd_level1', fig)

def create_dfd_level2():
    """Create DFD Level 2 - Registration Management decomposition"""
    fig, ax = plt.subplots(figsize=(16, 12))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Sub-processes of Registration (from academic_reg in mockData.ts)
    processes = [
        (2, 8, '2.1\nReceive\nRegistration\nRequest'),
        (5, 8, '2.2\nValidate\nStudent\nStatus'),
        (8, 8, '2.3\nCheck\nPrerequisites'),
        (11, 8, '2.4\nProcess\nRegistration'),
        (5, 5, '2.5\nHandle\nRegistration\nIssues'),
        (8, 5, '2.6\nGenerate\nConfirmation')
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
        (11, 2, 'D4\nRegistration\nIssues')
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
        ((7.3, 8), (10.3, 8), 'Approved'),
        ((10.3, 8), (8, 2.3), 'Store'),
        ((10.3, 8), (7.3, 5), 'Issue Data'),
        ((7.3, 5), (13.5, 6.5), 'Confirmation'),
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
                fontsize=18, weight='bold', pad=20)
    save_figure('3.3.4.3_dfd_level2', fig)

# ============================================================================
# 3.3.5 ACTIVITY DIAGRAMS
# ============================================================================
def create_activity_diagram_student():
    """Create Activity Diagram for Student (from StudentDashboard.tsx)"""
    fig, ax = plt.subplots(figsize=(14, 16))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 18)
    ax.axis('off')
    
    # Start
    ax.add_patch(Circle((5, 17), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 17, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    # Activities (from STUDENT_NAVIGATION)
    activities = [
        (5, 15.5, 'Login to System'),
        (5, 14, 'View Dashboard'),
        (5, 12.5, 'Select Service'),
        (5, 11, 'View Academic\nRegistration'),
        (5, 9.5, 'View Grades'),
        (5, 8, 'View Fees'),
        (5, 6.5, 'Submit Registration\nIssue Form'),
        (5, 5, 'View Schedule'),
        (5, 3.5, 'View Attendance')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
    # Decision (from reg_form_issue logic)
    decision = mpatches.RegularPolygon((5, 2), 4, radius=0.5, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.5)
    ax.add_patch(decision)
    ax.text(5, 2, 'Issue\nResolved?', ha='center', va='center', fontsize=7, weight='bold')
    
    # End
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
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
    ax.text(6.5, 2, 'Yes', fontsize=7)
    ax.text(3.5, 2, 'No', fontsize=7)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 1.5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Student Workflow', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.5.1_activity_diagram_student', fig)

def create_activity_diagram_faculty_admin():
    """Create Activity Diagram for Faculty Admin (from ADMIN_NAVIGATION)"""
    fig, ax = plt.subplots(figsize=(14, 16))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 18)
    ax.axis('off')
    
    # Start
    ax.add_patch(Circle((5, 17), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 17, 'Start', ha='center', va='center', fontsize=9, weight='bold')
    
    # Activities
    activities = [
        (5, 15.5, 'Login to System'),
        (5, 14, 'View Dashboard'),
        (5, 12.5, 'Select Tab\n(Students/Registration/etc)'),
        (5, 11, 'Manage Students\nData'),
        (5, 9.5, 'Enter Grades'),
        (5, 8, 'Manage Academic\nRegistration'),
        (5, 6.5, 'Manage Schedules'),
        (5, 5, 'View Reports'),
        (5, 3.5, 'View Activity Log')
    ]
    
    for x, y, label in activities:
        box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
    # End
    ax.add_patch(Circle((5, 0.5), 0.3, fill=True, facecolor='lightgreen', edgecolor='black', linewidth=2))
    ax.text(5, 0.5, 'End', ha='center', va='center', fontsize=9, weight='bold')
    
    # Flow
    for i in range(len(activities)):
        y1 = 17 - i*1.5 if i == 0 else activities[i-1][1] - 0.4
        y2 = activities[i][1] + 0.4
        ax.annotate('', xy=(5, y2), xytext=(5, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.annotate('', xy=(5, 0.8), xytext=(5, 3.1),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Faculty Admin Workflow', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.5.2_activity_diagram_professor', fig)

def create_activity_diagram_advisor():
    """Create Activity Diagram for Academic Advisor"""
    fig, ax = plt.subplots(figsize=(14, 14))
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
        box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
    decision = mpatches.RegularPolygon((5, 4.5), 4, radius=0.5, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.5)
    ax.add_patch(decision)
    ax.text(5, 4.5, 'Approve?', ha='center', va='center', fontsize=7, weight='bold')
    
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
    ax.text(6.5, 4.5, 'Yes', fontsize=7)
    ax.text(3.5, 4.5, 'No', fontsize=7)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 4),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Academic Advisor Workflow', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.5.3_activity_diagram_advisor', fig)

def create_activity_diagram_administrator():
    """Create Activity Diagram for Administrator"""
    fig, ax = plt.subplots(figsize=(14, 14))
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
        box = FancyBboxPatch((x-1.2, y-0.4), 2.4, 0.8, boxstyle="round,pad=0.2",
                           facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=8)
    
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
    
    ax.set_title('Activity Diagram - Administrator Workflow', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.5.4_activity_diagram_administrator', fig)

def create_activity_diagram_absence_warning():
    """Create Activity Diagram for Absence Warning Process"""
    fig, ax = plt.subplots(figsize=(14, 14))
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
    
    decision = mpatches.RegularPolygon((5, 5.5), 4, radius=0.5, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.5)
    ax.add_patch(decision)
    ax.text(5, 5.5, 'Rate >\nThreshold?', ha='center', va='center', fontsize=7, weight='bold')
    
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
    ax.text(6.5, 5.5, 'Yes', fontsize=7)
    ax.text(3.5, 5.5, 'No', fontsize=7)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Absence Warning Process', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.5.5_activity_diagram_absence_warning', fig)

def create_activity_diagram_academic_warning():
    """Create Activity Diagram for Academic Warning Process"""
    fig, ax = plt.subplots(figsize=(14, 14))
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
    
    decision = mpatches.RegularPolygon((5, 5.5), 4, radius=0.5, orientation=np.pi/4,
                                      facecolor='lightcoral', edgecolor='black', linewidth=1.5)
    ax.add_patch(decision)
    ax.text(5, 5.5, 'GPA <\nMinimum?', ha='center', va='center', fontsize=7, weight='bold')
    
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
    ax.text(6.5, 5.5, 'Yes', fontsize=7)
    ax.text(3.5, 5.5, 'No', fontsize=7)
    ax.annotate('', xy=(5, 0.8), xytext=(5, 5),
               arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Activity Diagram - Academic Warning Process', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.5.6_activity_diagram_academic_warning', fig)

# ============================================================================
# 3.3.6 SEQUENCE DIAGRAMS
# ============================================================================
def create_sequence_diagram_student():
    """Create Sequence Diagram for Student (from App.tsx and ContentArea.tsx)"""
    fig, ax = plt.subplots(figsize=(16, 12))
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
        ax.text(x, y, label, ha='center', va='bottom', fontsize=10, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.5, alpha=0.5)
    
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
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='darkblue'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=8,
               bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Student Login and View', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.6.1_sequence_diagram_student', fig)

def create_sequence_diagram_faculty_admin():
    """Create Sequence Diagram for Faculty Admin"""
    fig, ax = plt.subplots(figsize=(16, 12))
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
        ax.text(x, y, label, ha='center', va='bottom', fontsize=9, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.5, alpha=0.5)
    
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
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=8,
               bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Faculty Admin Operations', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.6.2_sequence_diagram_professor', fig)

def create_sequence_diagram_advisor():
    """Create Sequence Diagram for Academic Advisor"""
    fig, ax = plt.subplots(figsize=(16, 12))
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
        ax.text(x, y, label, ha='center', va='bottom', fontsize=9, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.5, alpha=0.5)
    
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
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=8,
               bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Academic Advisor Operations', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.6.3_sequence_diagram_advisor', fig)

def create_sequence_diagram_administrator():
    """Create Sequence Diagram for Administrator"""
    fig, ax = plt.subplots(figsize=(16, 12))
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
        ax.text(x, y, label, ha='center', va='bottom', fontsize=9, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.5, alpha=0.5)
    
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
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=8,
               bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Administrator Operations', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.6.4_sequence_diagram_administrator', fig)

def create_sequence_diagram_controller():
    """Create Sequence Diagram for Controller/System Monitoring"""
    fig, ax = plt.subplots(figsize=(16, 12))
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
        ax.text(x, y, label, ha='center', va='bottom', fontsize=9, weight='bold')
        ax.plot([x, x], [y-0.2, 0.5], 'k--', linewidth=1.5, alpha=0.5)
    
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
        ax.text(mid_x, y1-0.1, label, ha='center', va='top', fontsize=8,
               bbox=dict(boxstyle='round,pad=0.2', facecolor='white', edgecolor='darkblue'))
    
    ax.set_title('Sequence Diagram - Controller/System Monitoring', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.6.5_sequence_diagram_controller', fig)

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

