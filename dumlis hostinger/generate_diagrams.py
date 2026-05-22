"""
Python script to generate various UML and system diagrams for the CMP system.
This script generates high-quality PNG images suitable for presentation and documentation.

Generated Diagrams:
- Use case diagrams
- Entity Relationship Diagrams (ERD)
- Context diagrams
- Data Flow Diagrams (DFD) - Level 0, 1, 2
- Activity diagrams (for different actors)
- Sequence diagrams (for different actors)

Output Quality:
- High-resolution PNG files (300 DPI)
- Large diagram sizes for better visibility
- Readable fonts (Arial, 11-14pt)
- Professional color scheme
- Optimized for presentation and printing

Requirements:
    pip install graphviz matplotlib pillow

Note: Graphviz must be installed on the system:
    - Windows: Download from https://graphviz.org/download/
    - Linux: sudo apt-get install graphviz
    - Mac: brew install graphviz
"""

import os
import sys
from graphviz import Digraph, Graph
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle
import matplotlib.patches as patches

# Fix encoding for Windows console
if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

def verify_png_file(filepath):
    """Verify that a file is actually a PNG by checking magic bytes"""
    if not filepath or not os.path.exists(filepath):
        return False
    try:
        with open(filepath, 'rb') as f:
            header = f.read(8)
            # PNG files start with: 89 50 4E 47 0D 0A 1A 0A
            return header[:8] == b'\x89PNG\r\n\x1a\n'
    except:
        return False

def convert_to_png_if_needed(filepath):
    """Convert image to PNG if it's not already PNG, using PIL"""
    try:
        from PIL import Image
        if not os.path.exists(filepath):
            return None
        
        # Check if already PNG
        if verify_png_file(filepath):
            return filepath
        
        # Try to open and convert
        img = Image.open(filepath)
        png_path = filepath.rsplit('.', 1)[0] + '.png'
        img.save(png_path, 'PNG')
        if filepath != png_path and os.path.exists(filepath):
            os.remove(filepath)  # Remove old file
        return png_path
    except Exception as e:
        print(f"    Conversion error: {e}")
        return filepath

# Create output directory
os.makedirs('diagrams_output', exist_ok=True)

# High-quality PNG settings
PNG_DPI = 300  # High resolution for presentation
PNG_FORMAT = 'png'
DEFAULT_SIZE = '16,12'  # Larger default size
LARGE_SIZE = '20,16'  # For complex diagrams
FONT_SIZE = '14'  # Larger, more readable fonts
NODE_FONT_SIZE = '12'
EDGE_FONT_SIZE = '11'

def render_high_quality(dot, filename):
    """Render diagram with high-quality PNG settings"""
    try:
        # Ensure filename has .png extension
        if not filename.endswith('.png'):
            filename = filename + '.png'
        
        # Remove .png extension for Graphviz (it adds it automatically, but we'll force it)
        base_filename = filename[:-4] if filename.endswith('.png') else filename
        
        # Ensure format is explicitly set to PNG
        dot.format = 'png'
        
        # Set DPI for high resolution
        dot.attr('graph', dpi=str(PNG_DPI))
        
        # Render with PNG format
        # Graphviz will create base_filename.png in the same directory
        try:
            # Render to get the output path
            output_path = dot.render(base_filename, cleanup=False, format='png')
            
            # Graphviz creates file as base_filename.png, ensure it has .png extension
            expected_output = base_filename + '.png'
            if output_path and not output_path.endswith('.png'):
                # If output_path doesn't have .png, check if expected_output exists
                if os.path.exists(expected_output):
                    output_path = expected_output
                else:
                    # Rename output_path to have .png extension
                    new_path = output_path + '.png' if not output_path.endswith('.png') else output_path
                    if os.path.exists(output_path):
                        if os.path.exists(new_path):
                            os.remove(new_path)
                        os.rename(output_path, new_path)
                        output_path = new_path
            elif not output_path:
                # If no output_path returned, check for expected file
                if os.path.exists(expected_output):
                    output_path = expected_output
                    
        except Exception as render_error:
            print(f"    Render error: {render_error}")
            # Try simple render
            try:
                output_path = dot.render(base_filename, cleanup=False)
                if output_path and not output_path.endswith('.png'):
                    expected_output = base_filename + '.png'
                    if os.path.exists(expected_output):
                        output_path = expected_output
            except:
                output_path = None
        
        # Find the actual output file (Graphviz might add extension or not)
        actual_path = None
        dir_path = os.path.dirname(base_filename) or 'diagrams_output'
        base_name = os.path.basename(base_filename)
        
        # Check multiple possible paths
        possible_paths = [
            filename,  # Original filename with .png
            base_filename + '.png',  # Base + .png
            output_path if output_path else None,  # What Graphviz returned
            output_path + '.png' if output_path and not output_path.endswith('.png') else None,
        ]
        
        for path in possible_paths:
            if path and os.path.exists(path):
                actual_path = path
                break
        
        # If still not found, search in directory
        if not actual_path and os.path.isdir(dir_path):
            for f in os.listdir(dir_path):
                if f.startswith(base_name) and os.path.isfile(os.path.join(dir_path, f)):
                    actual_path = os.path.join(dir_path, f)
                    break
        
        # Ensure the final file has .png extension and is valid PNG
        if actual_path:
            final_png_path = filename  # Use the original filename with .png
            
            # If file exists but with different name, rename it
            if actual_path != final_png_path and os.path.exists(actual_path):
                # Convert to PNG if needed
                converted_path = convert_to_png_if_needed(actual_path)
                if converted_path and converted_path != final_png_path:
                    # Copy/rename to final path
                    import shutil
                    shutil.copy2(converted_path, final_png_path)
                    if converted_path != actual_path and os.path.exists(converted_path):
                        os.remove(converted_path)  # Remove intermediate file
                    if actual_path != converted_path and os.path.exists(actual_path):
                        os.remove(actual_path)  # Remove original if different
                else:
                    # Just rename
                    if os.path.exists(actual_path):
                        os.rename(actual_path, final_png_path)
                actual_path = final_png_path
            elif not os.path.exists(final_png_path):
                # File doesn't exist with .png extension, create it
                if os.path.exists(actual_path):
                    converted_path = convert_to_png_if_needed(actual_path)
                    if converted_path and converted_path != final_png_path:
                        import shutil
                        shutil.copy2(converted_path, final_png_path)
                    else:
                        import shutil
                        shutil.copy2(actual_path, final_png_path)
                actual_path = final_png_path
            
            # Final verification and conversion
            if os.path.exists(actual_path):
                final_path = convert_to_png_if_needed(actual_path)
                if final_path and verify_png_file(final_path):
                    print(f"  -> Saved PNG: {final_path}")
                    return final_path
                elif final_path:
                    print(f"  -> Saved: {final_path}")
                    return final_path
            
            print(f"  -> Saved: {actual_path}")
            return actual_path
        else:
            print(f"  ! Warning: Could not find output file for {filename}")
            return None
            
    except Exception as e:
        # Fallback to simple rendering
        print(f"  Warning: {e}, trying simple render...")
        try:
            base_filename = filename
            if base_filename.endswith('.png'):
                base_filename = base_filename[:-4]
            
            dot.format = 'png'
            output_path = dot.render(base_filename, cleanup=False, format='png')
            
            # Try to find and convert the file
            if output_path:
                png_path = convert_to_png_if_needed(output_path)
                return png_path
            else:
                # Look for any generated file
                dir_path = os.path.dirname(base_filename) or 'diagrams_output'
                base_name = os.path.basename(base_filename)
                if os.path.isdir(dir_path):
                    for f in os.listdir(dir_path):
                        if f.startswith(base_name):
                            found_path = os.path.join(dir_path, f)
                            png_path = convert_to_png_if_needed(found_path)
                            return png_path
            return None
        except Exception as e2:
            print(f"  X Error: {e2}")
            return None

def create_use_case_diagram():
    """Generate Use Case Diagram"""
    dot = Digraph(comment='Use Case Diagram', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='ellipse', style='filled', fillcolor='lightblue', 
             fontsize=FONT_SIZE, fontname='Arial')
    dot.attr('edge', style='solid', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # Actors
    dot.node('Student', 'Student', shape='stickfigure', fontsize=FONT_SIZE, 
             fillcolor='lightgreen', style='filled')
    dot.node('Professor', 'Professor', shape='stickfigure', fontsize=FONT_SIZE,
             fillcolor='lightgreen', style='filled')
    dot.node('Advisor', 'Academic Advisor', shape='stickfigure', fontsize=FONT_SIZE,
             fillcolor='lightgreen', style='filled')
    dot.node('Admin', 'Administrator', shape='stickfigure', fontsize=FONT_SIZE,
             fillcolor='lightgreen', style='filled')
    
    # Use Cases
    dot.node('UC1', 'Register for Courses', fontsize=NODE_FONT_SIZE)
    dot.node('UC2', 'View Grades', fontsize=NODE_FONT_SIZE)
    dot.node('UC3', 'Upload Materials', fontsize=NODE_FONT_SIZE)
    dot.node('UC4', 'Manage Students', fontsize=NODE_FONT_SIZE)
    dot.node('UC5', 'View Analytics', fontsize=NODE_FONT_SIZE)
    dot.node('UC6', 'Approve Registration', fontsize=NODE_FONT_SIZE)
    dot.node('UC7', 'System Management', fontsize=NODE_FONT_SIZE)
    
    # Relationships
    dot.edge('Student', 'UC1')
    dot.edge('Student', 'UC2')
    dot.edge('Professor', 'UC3')
    dot.edge('Professor', 'UC5')
    dot.edge('Advisor', 'UC6')
    dot.edge('Advisor', 'UC5')
    dot.edge('Admin', 'UC7')
    dot.edge('Admin', 'UC4')
    
    render_high_quality(dot, 'diagrams_output/3.3.1_use_case_diagram')
    print("OK Use Case Diagram generated")

def create_erd_diagram():
    """Generate Entity Relationship Diagram"""
    dot = Digraph(comment='ERD', format='png', engine='dot')
    dot.attr(rankdir='TB', size=LARGE_SIZE)
    dot.attr('node', shape='box', style='filled', fillcolor='lightyellow',
             fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # Entities
    dot.node('Student', 'Student\n\n- student_id (PK)\n- name\n- email\n- major')
    dot.node('Course', 'Course\n\n- course_id (PK)\n- course_name\n- credits\n- professor_id (FK)')
    dot.node('Professor', 'Professor\n\n- professor_id (PK)\n- name\n- department\n- email')
    dot.node('Enrollment', 'Enrollment\n\n- enrollment_id (PK)\n- student_id (FK)\n- course_id (FK)\n- grade\n- semester')
    dot.node('Material', 'Material\n\n- material_id (PK)\n- course_id (FK)\n- title\n- file_path\n- upload_date')
    dot.node('Advisor', 'Academic Advisor\n\n- advisor_id (PK)\n- name\n- department')
    
    # Relationships
    dot.edge('Student', 'Enrollment', label='enrolls in', dir='both')
    dot.edge('Course', 'Enrollment', label='has', dir='both')
    dot.edge('Professor', 'Course', label='teaches', dir='both')
    dot.edge('Course', 'Material', label='contains', dir='both')
    dot.edge('Advisor', 'Student', label='advises', dir='both')
    
    render_high_quality(dot, 'diagrams_output/3.3.2_erd_diagram')
    print("OK ERD Diagram generated")

def create_context_diagram():
    """Generate Context Diagram"""
    dot = Digraph(comment='Context Diagram', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='filled', fontsize=FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # Central System
    dot.node('CMP', 'CMP\n(Course Management Platform)', 
             shape='box', style='filled', fillcolor='lightblue', width='2', height='1')
    
    # External Entities
    dot.node('Student', 'Student', shape='box', fillcolor='lightgreen')
    dot.node('Professor', 'Professor', shape='box', fillcolor='lightgreen')
    dot.node('Advisor', 'Academic Advisor', shape='box', fillcolor='lightgreen')
    dot.node('Admin', 'Administrator', shape='box', fillcolor='lightgreen')
    
    # Data Flows
    dot.edge('Student', 'CMP', label='Request Registration')
    dot.edge('CMP', 'Student', label='Confirm Registration')
    dot.edge('Student', 'CMP', label='View Grades')
    dot.edge('CMP', 'Student', label='Grade Information')
    
    dot.edge('Professor', 'CMP', label='Upload Materials')
    dot.edge('CMP', 'Professor', label='Confirm Upload')
    dot.edge('Professor', 'CMP', label='View Analytics')
    dot.edge('CMP', 'Professor', label='Analytics Data')
    
    dot.edge('Advisor', 'CMP', label='Approve Requests')
    dot.edge('CMP', 'Advisor', label='Student Information')
    
    dot.edge('Admin', 'CMP', label='System Updates')
    dot.edge('CMP', 'Admin', label='Confirm Updates')
    
    render_high_quality(dot, 'diagrams_output/3.3.3_context_diagram')
    print("OK Context Diagram generated")

def create_dfd_level0():
    """Generate DFD Level 0"""
    dot = Digraph(comment='DFD Level 0', format='png', engine='dot')
    dot.attr(rankdir='TB', size=LARGE_SIZE)
    dot.attr('node', shape='box', style='filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # Central Process
    dot.node('CMP', 'CMP\n0.0', shape='box', style='filled', 
             fillcolor='lightblue', width='2', height='1')
    
    # External Entities
    dot.node('Student', 'Student', shape='box', fillcolor='lightgreen')
    dot.node('Professor', 'Professor', shape='box', fillcolor='lightgreen')
    dot.node('Advisor', 'Academic Advisor', shape='box', fillcolor='lightgreen')
    dot.node('Admin', 'Administrator', shape='box', fillcolor='lightgreen')
    
    # Data Stores
    dot.node('DS1', 'Student\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS2', 'Course\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS3', 'Material\nDatabase', shape='cylinder', fillcolor='lightyellow')
    
    # Flows to/from Student
    dot.edge('Student', 'CMP', label='Registration Request')
    dot.edge('CMP', 'Student', label='Registration Confirmation')
    dot.edge('CMP', 'DS1', label='Store Student Data')
    dot.edge('DS1', 'CMP', label='Retrieve Student Data')
    
    # Flows to/from Professor
    dot.edge('Professor', 'CMP', label='Upload Materials')
    dot.edge('CMP', 'Professor', label='Upload Confirmation')
    dot.edge('CMP', 'DS3', label='Store Materials')
    dot.edge('DS2', 'CMP', label='Course Information')
    
    # Flows to/from Advisor
    dot.edge('Advisor', 'CMP', label='Approval Request')
    dot.edge('CMP', 'Advisor', label='Student Status')
    
    # Flows to/from Admin
    dot.edge('Admin', 'CMP', label='System Updates')
    dot.edge('CMP', 'Admin', label='Update Confirmation')
    
    render_high_quality(dot, 'diagrams_output/3.3.4.1_dfd_level0')
    print("OK DFD Level 0 generated")

def create_dfd_level1():
    """Generate DFD Level 1"""
    dot = Digraph(comment='DFD Level 1', format='png', engine='dot')
    dot.attr(rankdir='TB', size=LARGE_SIZE)
    dot.attr('node', shape='box', style='filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # External Entities
    dot.node('Student', 'Student', shape='box', fillcolor='lightgreen')
    dot.node('Professor', 'Professor', shape='box', fillcolor='lightgreen')
    dot.node('Advisor', 'Academic Advisor', shape='box', fillcolor='lightgreen')
    dot.node('Admin', 'Administrator', shape='box', fillcolor='lightgreen')
    
    # Processes
    dot.node('P1', '1.0\nRegistration\nManagement', shape='box', fillcolor='lightblue')
    dot.node('P2', '2.0\nMaterial\nManagement', shape='box', fillcolor='lightblue')
    dot.node('P3', '3.0\nGrade\nManagement', shape='box', fillcolor='lightblue')
    dot.node('P4', '4.0\nSystem\nAdministration', shape='box', fillcolor='lightblue')
    
    # Data Stores
    dot.node('DS1', 'D1\nStudent\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS2', 'D2\nCourse\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS3', 'D3\nMaterial\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS4', 'D4\nGrade\nDatabase', shape='cylinder', fillcolor='lightyellow')
    
    # Student flows
    dot.edge('Student', 'P1', label='Registration Request')
    dot.edge('P1', 'Student', label='Confirmation')
    dot.edge('P1', 'DS1', label='Student Data')
    dot.edge('DS1', 'P1', label='Student Info')
    
    # Professor flows
    dot.edge('Professor', 'P2', label='Upload Request')
    dot.edge('P2', 'Professor', label='Upload Status')
    dot.edge('P2', 'DS3', label='Material Data')
    dot.edge('DS2', 'P2', label='Course Info')
    
    # Grade flows
    dot.edge('Professor', 'P3', label='Grade Input')
    dot.edge('P3', 'DS4', label='Grade Data')
    dot.edge('DS4', 'P3', label='Grade Info')
    dot.edge('P3', 'Student', label='Grade Report')
    
    # Admin flows
    dot.edge('Admin', 'P4', label='Admin Commands')
    dot.edge('P4', 'Admin', label='System Status')
    dot.edge('P4', 'DS1', label='Update Data')
    dot.edge('P4', 'DS2', label='Update Data')
    
    # Advisor flows
    dot.edge('Advisor', 'P1', label='Approval Request')
    dot.edge('DS1', 'P1', label='Student Records')
    
    render_high_quality(dot, 'diagrams_output/3.3.4.2_dfd_level1')
    print("OK DFD Level 1 generated")

def create_dfd_level2():
    """Generate DFD Level 2 (decomposing Registration Management)"""
    dot = Digraph(comment='DFD Level 2', format='png', engine='dot')
    dot.attr(rankdir='TB', size=LARGE_SIZE)
    dot.attr('node', shape='box', style='filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # External Entities
    dot.node('Student', 'Student', shape='box', fillcolor='lightgreen')
    dot.node('Advisor', 'Academic Advisor', shape='box', fillcolor='lightgreen')
    
    # Sub-processes
    dot.node('P1.1', '1.1\nReceive\nRegistration', shape='box', fillcolor='lightblue')
    dot.node('P1.2', '1.2\nValidate\nRequest', shape='box', fillcolor='lightblue')
    dot.node('P1.3', '1.3\nCheck\nPrerequisites', shape='box', fillcolor='lightblue')
    dot.node('P1.4', '1.4\nProcess\nRegistration', shape='box', fillcolor='lightblue')
    dot.node('P1.5', '1.5\nSend\nConfirmation', shape='box', fillcolor='lightblue')
    
    # Data Stores
    dot.node('DS1', 'D1\nStudent\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS2', 'D2\nCourse\nDatabase', shape='cylinder', fillcolor='lightyellow')
    dot.node('DS5', 'D5\nEnrollment\nDatabase', shape='cylinder', fillcolor='lightyellow')
    
    # Flows
    dot.edge('Student', 'P1.1', label='Registration Request')
    dot.edge('P1.1', 'P1.2', label='Request Data')
    dot.edge('P1.2', 'DS1', label='Validate Student')
    dot.edge('DS1', 'P1.2', label='Student Info')
    dot.edge('P1.2', 'P1.3', label='Valid Request')
    dot.edge('P1.3', 'DS2', label='Check Course')
    dot.edge('DS2', 'P1.3', label='Course Info')
    dot.edge('P1.3', 'P1.4', label='Approved Request')
    dot.edge('P1.4', 'DS5', label='Store Enrollment')
    dot.edge('P1.4', 'P1.5', label='Enrollment Data')
    dot.edge('P1.5', 'Student', label='Confirmation')
    dot.edge('Advisor', 'P1.4', label='Approval')
    
    render_high_quality(dot, 'diagrams_output/3.3.4.3_dfd_level2')
    print("OK DFD Level 2 generated")

def create_activity_diagram_student():
    """Generate Activity Diagram for Student"""
    dot = Digraph(comment='Activity Diagram - Student', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='rounded,filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # Start
    dot.node('Start', 'Start', shape='ellipse', fillcolor='lightgreen')
    
    # Activities
    dot.node('Login', 'Login to System', fillcolor='lightblue')
    dot.node('ViewCourses', 'View Available Courses', fillcolor='lightblue')
    dot.node('SelectCourse', 'Select Course', fillcolor='lightblue')
    dot.node('CheckPrereq', 'Check Prerequisites', fillcolor='lightblue')
    dot.node('SubmitReg', 'Submit Registration', fillcolor='lightblue')
    dot.node('WaitApproval', 'Wait for Approval', fillcolor='lightyellow')
    dot.node('ViewGrades', 'View Grades', fillcolor='lightblue')
    dot.node('DownloadMat', 'Download Materials', fillcolor='lightblue')
    
    # Decision
    dot.node('Decision1', 'Prerequisites\nMet?', shape='diamond', fillcolor='lightcoral')
    dot.node('Decision2', 'Approved?', shape='diamond', fillcolor='lightcoral')
    
    # End
    dot.node('End', 'End', shape='ellipse', fillcolor='lightgreen')
    
    # Flow
    dot.edge('Start', 'Login')
    dot.edge('Login', 'ViewCourses')
    dot.edge('ViewCourses', 'SelectCourse')
    dot.edge('SelectCourse', 'CheckPrereq')
    dot.edge('CheckPrereq', 'Decision1')
    dot.edge('Decision1', 'SubmitReg', label='Yes')
    dot.edge('Decision1', 'ViewCourses', label='No')
    dot.edge('SubmitReg', 'WaitApproval')
    dot.edge('WaitApproval', 'Decision2')
    dot.edge('Decision2', 'ViewGrades', label='Yes')
    dot.edge('Decision2', 'ViewCourses', label='No')
    dot.edge('ViewGrades', 'DownloadMat')
    dot.edge('DownloadMat', 'End')
    
    render_high_quality(dot, 'diagrams_output/3.3.5.1_activity_diagram_student')
    print("OK Activity Diagram (Student) generated")

def create_activity_diagram_professor():
    """Generate Activity Diagram for Professor"""
    dot = Digraph(comment='Activity Diagram - Professor', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='rounded,filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Start', 'Start', shape='ellipse', fillcolor='lightgreen')
    dot.node('Login', 'Login to System', fillcolor='lightblue')
    dot.node('ViewCourses', 'View My Courses', fillcolor='lightblue')
    dot.node('SelectCourse', 'Select Course', fillcolor='lightblue')
    dot.node('UploadMat', 'Upload Materials', fillcolor='lightblue')
    dot.node('InputGrades', 'Input Student Grades', fillcolor='lightblue')
    dot.node('ViewAnalytics', 'View Analytics', fillcolor='lightblue')
    dot.node('End', 'End', shape='ellipse', fillcolor='lightgreen')
    
    dot.edge('Start', 'Login')
    dot.edge('Login', 'ViewCourses')
    dot.edge('ViewCourses', 'SelectCourse')
    dot.edge('SelectCourse', 'UploadMat')
    dot.edge('UploadMat', 'InputGrades')
    dot.edge('InputGrades', 'ViewAnalytics')
    dot.edge('ViewAnalytics', 'End')
    
    render_high_quality(dot, 'diagrams_output/3.3.5.2_activity_diagram_professor')
    print("OK Activity Diagram (Professor) generated")

def create_activity_diagram_advisor():
    """Generate Activity Diagram for Academic Advisor"""
    dot = Digraph(comment='Activity Diagram - Advisor', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='rounded,filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Start', 'Start', shape='ellipse', fillcolor='lightgreen')
    dot.node('Login', 'Login to System', fillcolor='lightblue')
    dot.node('ViewRequests', 'View Registration Requests', fillcolor='lightblue')
    dot.node('ReviewStudent', 'Review Student Records', fillcolor='lightblue')
    dot.node('Decision', 'Approve?', shape='diamond', fillcolor='lightcoral')
    dot.node('Approve', 'Approve Registration', fillcolor='lightblue')
    dot.node('Reject', 'Reject Registration', fillcolor='lightblue')
    dot.node('Notify', 'Notify Student', fillcolor='lightblue')
    dot.node('End', 'End', shape='ellipse', fillcolor='lightgreen')
    
    dot.edge('Start', 'Login')
    dot.edge('Login', 'ViewRequests')
    dot.edge('ViewRequests', 'ReviewStudent')
    dot.edge('ReviewStudent', 'Decision')
    dot.edge('Decision', 'Approve', label='Yes')
    dot.edge('Decision', 'Reject', label='No')
    dot.edge('Approve', 'Notify')
    dot.edge('Reject', 'Notify')
    dot.edge('Notify', 'End')
    
    render_high_quality(dot, 'diagrams_output/3.3.5.3_activity_diagram_advisor')
    print("OK Activity Diagram (Advisor) generated")

def create_activity_diagram_administrator():
    """Generate Activity Diagram for Administrator"""
    dot = Digraph(comment='Activity Diagram - Administrator', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='rounded,filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Start', 'Start', shape='ellipse', fillcolor='lightgreen')
    dot.node('Login', 'Login to System', fillcolor='lightblue')
    dot.node('SelectAction', 'Select Action', fillcolor='lightblue')
    dot.node('ManageUsers', 'Manage Users', fillcolor='lightblue')
    dot.node('ManageCourses', 'Manage Courses', fillcolor='lightblue')
    dot.node('SystemConfig', 'System Configuration', fillcolor='lightblue')
    dot.node('ViewLogs', 'View System Logs', fillcolor='lightblue')
    dot.node('End', 'End', shape='ellipse', fillcolor='lightgreen')
    
    dot.edge('Start', 'Login')
    dot.edge('Login', 'SelectAction')
    dot.edge('SelectAction', 'ManageUsers')
    dot.edge('SelectAction', 'ManageCourses')
    dot.edge('SelectAction', 'SystemConfig')
    dot.edge('SelectAction', 'ViewLogs')
    dot.edge('ManageUsers', 'End')
    dot.edge('ManageCourses', 'End')
    dot.edge('SystemConfig', 'End')
    dot.edge('ViewLogs', 'End')
    
    render_high_quality(dot, 'diagrams_output/3.3.5.4_activity_diagram_administrator')
    print("OK Activity Diagram (Administrator) generated")

def create_activity_diagram_absence_warning():
    """Generate Activity Diagram for Absence Warning"""
    dot = Digraph(comment='Activity Diagram - Absence Warning', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='rounded,filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Start', 'Start', shape='ellipse', fillcolor='lightgreen')
    dot.node('CheckAbsence', 'Check Student Absences', fillcolor='lightblue')
    dot.node('Calculate', 'Calculate Absence Rate', fillcolor='lightblue')
    dot.node('Decision1', 'Absence Rate\n> Threshold?', shape='diamond', fillcolor='lightcoral')
    dot.node('GenerateWarning', 'Generate Warning', fillcolor='lightyellow')
    dot.node('SendWarning', 'Send Warning to Student', fillcolor='lightblue')
    dot.node('NotifyAdvisor', 'Notify Academic Advisor', fillcolor='lightblue')
    dot.node('End', 'End', shape='ellipse', fillcolor='lightgreen')
    
    dot.edge('Start', 'CheckAbsence')
    dot.edge('CheckAbsence', 'Calculate')
    dot.edge('Calculate', 'Decision1')
    dot.edge('Decision1', 'GenerateWarning', label='Yes')
    dot.edge('Decision1', 'End', label='No')
    dot.edge('GenerateWarning', 'SendWarning')
    dot.edge('SendWarning', 'NotifyAdvisor')
    dot.edge('NotifyAdvisor', 'End')
    
    render_high_quality(dot, 'diagrams_output/3.3.5.5_activity_diagram_absence_warning')
    print("OK Activity Diagram (Absence Warning) generated")

def create_activity_diagram_academic_warning():
    """Generate Activity Diagram for Academic Warning"""
    dot = Digraph(comment='Activity Diagram - Academic Warning', format='png', engine='dot')
    dot.attr(rankdir='TB', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', style='rounded,filled', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Start', 'Start', shape='ellipse', fillcolor='lightgreen')
    dot.node('CalculateGPA', 'Calculate Student GPA', fillcolor='lightblue')
    dot.node('Decision1', 'GPA <\nMinimum?', shape='diamond', fillcolor='lightcoral')
    dot.node('GenerateWarning', 'Generate Academic Warning', fillcolor='lightyellow')
    dot.node('SendWarning', 'Send Warning to Student', fillcolor='lightblue')
    dot.node('NotifyAdvisor', 'Notify Academic Advisor', fillcolor='lightblue')
    dot.node('ScheduleMeeting', 'Schedule Meeting', fillcolor='lightblue')
    dot.node('End', 'End', shape='ellipse', fillcolor='lightgreen')
    
    dot.edge('Start', 'CalculateGPA')
    dot.edge('CalculateGPA', 'Decision1')
    dot.edge('Decision1', 'GenerateWarning', label='Yes')
    dot.edge('Decision1', 'End', label='No')
    dot.edge('GenerateWarning', 'SendWarning')
    dot.edge('SendWarning', 'NotifyAdvisor')
    dot.edge('NotifyAdvisor', 'ScheduleMeeting')
    dot.edge('ScheduleMeeting', 'End')
    
    render_high_quality(dot, 'diagrams_output/3.3.5.6_activity_diagram_academic_warning')
    print("OK Activity Diagram (Academic Warning) generated")

def create_sequence_diagram_student():
    """Generate Sequence Diagram for Student"""
    dot = Digraph(comment='Sequence Diagram - Student', format='png', engine='dot')
    dot.attr(rankdir='LR', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    # Actors
    dot.node('Student', 'Student', shape='box', fillcolor='lightgreen')
    dot.node('System', 'CMP System', shape='box', fillcolor='lightblue')
    dot.node('Database', 'Database', shape='box', fillcolor='lightyellow')
    
    # Messages (simplified representation)
    dot.edge('Student', 'System', label='1. Login Request')
    dot.edge('System', 'Database', label='2. Verify Credentials')
    dot.edge('Database', 'System', label='3. Return User Info')
    dot.edge('System', 'Student', label='4. Login Success')
    dot.edge('Student', 'System', label='5. Request Course Registration')
    dot.edge('System', 'Database', label='6. Check Prerequisites')
    dot.edge('Database', 'System', label='7. Return Course Info')
    dot.edge('System', 'Student', label='8. Registration Confirmation')
    
    render_high_quality(dot, 'diagrams_output/3.3.6.1_sequence_diagram_student')
    print("OK Sequence Diagram (Student) generated")

def create_sequence_diagram_professor():
    """Generate Sequence Diagram for Professor"""
    dot = Digraph(comment='Sequence Diagram - Professor', format='png', engine='dot')
    dot.attr(rankdir='LR', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Professor', 'Professor', shape='box', fillcolor='lightgreen')
    dot.node('System', 'CMP System', shape='box', fillcolor='lightblue')
    dot.node('Database', 'Database', shape='box', fillcolor='lightyellow')
    
    dot.edge('Professor', 'System', label='1. Login')
    dot.edge('System', 'Database', label='2. Authenticate')
    dot.edge('Database', 'System', label='3. User Verified')
    dot.edge('System', 'Professor', label='4. Access Granted')
    dot.edge('Professor', 'System', label='5. Upload Material')
    dot.edge('System', 'Database', label='6. Store Material')
    dot.edge('Database', 'System', label='7. Storage Confirmed')
    dot.edge('System', 'Professor', label='8. Upload Success')
    
    render_high_quality(dot, 'diagrams_output/3.3.6.2_sequence_diagram_professor')
    print("OK Sequence Diagram (Professor) generated")

def create_sequence_diagram_advisor():
    """Generate Sequence Diagram for Advisor"""
    dot = Digraph(comment='Sequence Diagram - Advisor', format='png', engine='dot')
    dot.attr(rankdir='LR', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Advisor', 'Academic Advisor', shape='box', fillcolor='lightgreen')
    dot.node('System', 'CMP System', shape='box', fillcolor='lightblue')
    dot.node('Database', 'Database', shape='box', fillcolor='lightyellow')
    dot.node('Student', 'Student', shape='box', fillcolor='lightcyan')
    
    dot.edge('Advisor', 'System', label='1. Login')
    dot.edge('System', 'Database', label='2. Authenticate')
    dot.edge('Database', 'System', label='3. Verified')
    dot.edge('System', 'Advisor', label='4. Access Granted')
    dot.edge('Advisor', 'System', label='5. View Registration Requests')
    dot.edge('System', 'Database', label='6. Retrieve Requests')
    dot.edge('Database', 'System', label='7. Return Data')
    dot.edge('System', 'Advisor', label='8. Display Requests')
    dot.edge('Advisor', 'System', label='9. Approve/Reject')
    dot.edge('System', 'Database', label='10. Update Status')
    dot.edge('System', 'Student', label='11. Notify Student')
    
    render_high_quality(dot, 'diagrams_output/3.3.6.3_sequence_diagram_advisor')
    print("OK Sequence Diagram (Advisor) generated")

def create_sequence_diagram_administrator():
    """Generate Sequence Diagram for Administrator"""
    dot = Digraph(comment='Sequence Diagram - Administrator', format='png', engine='dot')
    dot.attr(rankdir='LR', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Admin', 'Administrator', shape='box', fillcolor='lightgreen')
    dot.node('System', 'CMP System', shape='box', fillcolor='lightblue')
    dot.node('Database', 'Database', shape='box', fillcolor='lightyellow')
    
    dot.edge('Admin', 'System', label='1. Login')
    dot.edge('System', 'Database', label='2. Verify Admin')
    dot.edge('Database', 'System', label='3. Admin Verified')
    dot.edge('System', 'Admin', label='4. Admin Access')
    dot.edge('Admin', 'System', label='5. System Update Request')
    dot.edge('System', 'Database', label='6. Update Database')
    dot.edge('Database', 'System', label='7. Update Confirmed')
    dot.edge('System', 'Admin', label='8. Update Success')
    
    render_high_quality(dot, 'diagrams_output/3.3.6.4_sequence_diagram_administrator')
    print("OK Sequence Diagram (Administrator) generated")

def create_sequence_diagram_controller():
    """Generate Sequence Diagram for Controller"""
    dot = Digraph(comment='Sequence Diagram - Controller', format='png', engine='dot')
    dot.attr(rankdir='LR', size=DEFAULT_SIZE)
    dot.attr('node', shape='box', fontsize=NODE_FONT_SIZE, fontname='Arial')
    dot.attr('edge', fontsize=EDGE_FONT_SIZE, fontname='Arial')
    
    dot.node('Controller', 'Controller', shape='box', fillcolor='lightgreen')
    dot.node('System', 'CMP System', shape='box', fillcolor='lightblue')
    dot.node('Database', 'Database', shape='box', fillcolor='lightyellow')
    dot.node('Student', 'Student', shape='box', fillcolor='lightcyan')
    
    dot.edge('Controller', 'System', label='1. Monitor System')
    dot.edge('System', 'Database', label='2. Query Data')
    dot.edge('Database', 'System', label='3. Return Status')
    dot.edge('System', 'Controller', label='4. System Status')
    dot.edge('Controller', 'System', label='5. Generate Warnings')
    dot.edge('System', 'Database', label='6. Check Absences/Grades')
    dot.edge('Database', 'System', label='7. Return Data')
    dot.edge('System', 'Student', label='8. Send Warning')
    dot.edge('System', 'Controller', label='9. Warning Sent')
    
    render_high_quality(dot, 'diagrams_output/3.3.6.5_sequence_diagram_controller')
    print("OK Sequence Diagram (Controller) generated")

def main():
    """Main function to generate all diagrams"""
    print("=" * 60)
    print("Generating All Diagrams for CMP System")
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
        create_activity_diagram_professor()
        create_activity_diagram_advisor()
        create_activity_diagram_administrator()
        create_activity_diagram_absence_warning()
        create_activity_diagram_academic_warning()
        
        # 3.3.6 Sequence Diagrams
        create_sequence_diagram_student()
        create_sequence_diagram_professor()
        create_sequence_diagram_advisor()
        create_sequence_diagram_administrator()
        create_sequence_diagram_controller()
        
        print()
        print("=" * 60)
        print("OK All diagrams generated successfully!")
        print(f"OK Output directory: {os.path.abspath('diagrams_output')}")
        print()
        
        # Verify all files are PNG and have .png extension
        print("Verifying and fixing PNG files...")
        png_files = []
        non_png_files = []
        if os.path.exists('diagrams_output'):
            for filename in os.listdir('diagrams_output'):
                filepath = os.path.join('diagrams_output', filename)
                if os.path.isfile(filepath):
                    # Check if file has .png extension
                    if filename.endswith('.png'):
                        if verify_png_file(filepath):
                            png_files.append(filename)
                        else:
                            # Has .png extension but not valid PNG, try to convert
                            non_png_files.append(filename)
                    else:
                        # No .png extension - need to add it
                        non_png_files.append(filename)
        
        print(f"  ✓ Valid PNG files: {len(png_files)}")
        if non_png_files:
            print(f"  ⚠ Fixing {len(non_png_files)} files (adding .png extension and converting)...")
            for f in non_png_files:
                filepath = os.path.join('diagrams_output', f)
                try:
                    # Determine new filename with .png extension
                    if f.endswith('.png'):
                        new_filename = f
                        new_filepath = filepath
                    else:
                        new_filename = f + '.png'
                        new_filepath = os.path.join('diagrams_output', new_filename)
                    
                    # Convert to PNG if needed
                    converted = convert_to_png_if_needed(filepath)
                    if converted:
                        # If converted file has different name, use it
                        if converted != filepath and os.path.exists(converted):
                            if os.path.exists(new_filepath) and new_filepath != converted:
                                os.remove(new_filepath)
                            if not os.path.exists(new_filepath):
                                import shutil
                                shutil.copy2(converted, new_filepath)
                                if converted != filepath:
                                    os.remove(converted)
                            filepath = converted
                        # Rename to ensure .png extension
                        if not new_filepath.endswith('.png'):
                            new_filepath = new_filepath + '.png'
                        if filepath != new_filepath and os.path.exists(filepath):
                            if os.path.exists(new_filepath):
                                os.remove(new_filepath)
                            os.rename(filepath, new_filepath)
                            filepath = new_filepath
                    
                    # Final verification
                    if os.path.exists(new_filepath):
                        if verify_png_file(new_filepath):
                            print(f"    ✓ Fixed: {f} → {new_filename}")
                            png_files.append(new_filename)
                        else:
                            # Try one more conversion
                            final_png = convert_to_png_if_needed(new_filepath)
                            if final_png and verify_png_file(final_png):
                                print(f"    ✓ Fixed: {f} → {os.path.basename(final_png)}")
                                png_files.append(os.path.basename(final_png))
                            else:
                                print(f"    ⚠ File exists but may not be valid PNG: {new_filename}")
                    else:
                        print(f"    ✗ Failed to fix: {f}")
                except Exception as e:
                    print(f"    ✗ Error fixing {f}: {e}")
        
        print(f"\n  📁 Total PNG files ready: {len(png_files)}")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ Error generating diagrams: {e}")
        print("\nMake sure Graphviz is installed:")
        print("  Windows: Download from https://graphviz.org/download/")
        print("  Linux: sudo apt-get install graphviz")
        print("  Mac: brew install graphviz")
        print("\nAlso install Python packages:")
        print("  pip install graphviz matplotlib pillow")

if __name__ == "__main__":
    main()

