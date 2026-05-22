"""
Simple diagram generator using matplotlib (no Graphviz required)
مولد مخططات بسيط باستخدام matplotlib (لا يحتاج Graphviz)
"""

import os
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch, Circle, Rectangle, FancyArrow
import matplotlib.patches as patches

# Create output directory
os.makedirs('diagrams_output', exist_ok=True)

# Set style
plt.style.use('default')
plt.rcParams['figure.dpi'] = 300
plt.rcParams['savefig.dpi'] = 300
plt.rcParams['font.size'] = 10

def save_figure(filename, fig):
    """Save figure as PNG"""
    filepath = os.path.join('diagrams_output', filename + '.png')
    fig.savefig(filepath, format='png', bbox_inches='tight', dpi=300)
    plt.close(fig)
    print(f"OK Generated: {filename}.png")
    return filepath

def create_use_case_diagram():
    """Create Use Case Diagram"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Actors (stick figures)
    actors = [
        (2, 8, 'Student'),
        (8, 8, 'Professor'),
        (2, 2, 'Academic\nAdvisor'),
        (8, 2, 'Administrator')
    ]
    
    for x, y, label in actors:
        # Draw stick figure
        ax.plot([x, x], [y-0.5, y+0.5], 'k-', linewidth=2)  # Body
        ax.plot([x-0.3, x+0.3], [y+0.3, y+0.3], 'k-', linewidth=2)  # Arms
        ax.add_patch(Circle((x, y+0.7), 0.2, fill=False, linewidth=2))  # Head
        ax.text(x, y-1, label, ha='center', va='top', fontsize=10, weight='bold')
    
    # Use cases (ellipses)
    use_cases = [
        (5, 7, 'Register for\nCourses'),
        (5, 5, 'View Grades'),
        (5, 3, 'Upload Materials'),
        (7, 6, 'Manage Students'),
        (3, 6, 'View Analytics'),
        (3, 4, 'Approve\nRegistration'),
        (7, 4, 'System\nManagement')
    ]
    
    for x, y, label in use_cases:
        ellipse = mpatches.Ellipse((x, y), 1.5, 0.8, fill=True, 
                                   facecolor='lightblue', edgecolor='black', linewidth=1.5)
        ax.add_patch(ellipse)
        ax.text(x, y, label, ha='center', va='center', fontsize=9)
    
    # Draw connections
    connections = [
        ((2, 7.5), (4.5, 7)),  # Student to Register
        ((2, 7.5), (4.5, 5)),  # Student to View Grades
        ((8, 7.5), (5.5, 3)),  # Professor to Upload
        ((8, 7.5), (6.5, 6)),  # Professor to Analytics
        ((2, 2.5), (3.5, 4)),  # Advisor to Approve
        ((2, 2.5), (2.5, 6)),  # Advisor to Analytics
        ((8, 2.5), (6.5, 4)),  # Admin to System Management
        ((8, 2.5), (6.5, 6)),  # Admin to Manage Students
    ]
    
    for (x1, y1), (x2, y2) in connections:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
    
    ax.set_title('Use Case Diagram', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.1_use_case_diagram', fig)

def create_context_diagram():
    """Create Context Diagram"""
    fig, ax = plt.subplots(figsize=(12, 10))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Central system
    center_box = FancyBboxPatch((4, 4), 2, 2, boxstyle="round,pad=0.3",
                               facecolor='lightblue', edgecolor='black', linewidth=2)
    ax.add_patch(center_box)
    ax.text(5, 5, 'CMP\n(Course Management\nPlatform)', ha='center', va='center',
           fontsize=11, weight='bold')
    ax.text(5, 3.5, '0.0', ha='center', fontsize=9)
    
    # External entities
    entities = [
        (1, 8, 'Student'),
        (9, 8, 'Professor'),
        (1, 1, 'Academic\nAdvisor'),
        (9, 1, 'Administrator')
    ]
    
    for x, y, label in entities:
        box = Rectangle((x-0.8, y-0.6), 1.6, 1.2, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=10, weight='bold')
    
    # Data flows
    flows = [
        ((1, 8), (4, 6), 'Request\nRegistration'),
        ((4, 6), (1, 8), 'Confirm\nRegistration'),
        ((9, 8), (6, 6), 'Upload\nMaterials'),
        ((6, 6), (9, 8), 'Confirm\nUpload'),
        ((1, 1), (4, 4), 'Approve\nRequests'),
        ((4, 4), (1, 1), 'Student\nInformation'),
        ((9, 1), (6, 4), 'System\nUpdates'),
        ((6, 4), (9, 1), 'Confirm\nUpdates'),
    ]
    
    for (x1, y1), (x2, y2), label in flows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='black'))
        mid_x, mid_y = (x1 + x2) / 2, (y1 + y2) / 2
        ax.text(mid_x, mid_y, label, ha='center', va='center',
               bbox=dict(boxstyle='round,pad=0.3', facecolor='white', edgecolor='black'),
               fontsize=8)
    
    ax.set_title('Context Diagram', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.3_context_diagram', fig)

def create_dfd_level0():
    """Create DFD Level 0"""
    fig, ax = plt.subplots(figsize=(14, 10))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Central process
    center = FancyBboxPatch((5, 4), 2, 2, boxstyle="round,pad=0.3",
                           facecolor='lightblue', edgecolor='black', linewidth=2)
    ax.add_patch(center)
    ax.text(6, 5, 'CMP\n0.0', ha='center', va='center', fontsize=11, weight='bold')
    
    # External entities
    entities = [(1, 8, 'Student'), (11, 8, 'Professor'), 
                (1, 1, 'Advisor'), (11, 1, 'Admin')]
    for x, y, label in entities:
        box = Rectangle((x-0.8, y-0.6), 1.6, 1.2, facecolor='lightgreen',
                       edgecolor='black', linewidth=1.5)
        ax.add_patch(box)
        ax.text(x, y, label, ha='center', va='center', fontsize=9, weight='bold')
    
    # Data stores (cylinders)
    stores = [(3, 5, 'Student\nDB'), (9, 5, 'Course\nDB'), (6, 2, 'Material\nDB')]
    for x, y, label in stores:
        # Draw cylinder
        ellipse_top = mpatches.Ellipse((x, y+0.4), 1.2, 0.3, fill=True,
                                      facecolor='lightyellow', edgecolor='black')
        rect = Rectangle((x-0.6, y-0.4), 1.2, 0.8, facecolor='lightyellow',
                        edgecolor='black')
        ellipse_bottom = mpatches.Ellipse((x, y-0.4), 1.2, 0.3, fill=True,
                                         facecolor='lightyellow', edgecolor='black')
        ax.add_patch(ellipse_top)
        ax.add_patch(rect)
        ax.add_patch(ellipse_bottom)
        ax.text(x, y, label, ha='center', va='center', fontsize=8, weight='bold')
    
    ax.set_title('DFD Level 0', fontsize=16, weight='bold', pad=20)
    save_figure('3.3.4.1_dfd_level0', fig)

def main():
    """Generate all diagrams"""
    print("=" * 60)
    print("Generating Diagrams using Matplotlib")
    print("=" * 60)
    print()
    
    try:
        create_use_case_diagram()
        create_context_diagram()
        create_dfd_level0()
        
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




