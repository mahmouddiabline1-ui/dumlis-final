"""
سكريبت لإصلاح الملفات وإضافة امتداد .png
Script to fix diagram files and add .png extension
"""

import os
from PIL import Image

def verify_png_file(filepath):
    """Verify that a file is actually a PNG by checking magic bytes"""
    if not filepath or not os.path.exists(filepath):
        return False
    try:
        with open(filepath, 'rb') as f:
            header = f.read(8)
            return header[:8] == b'\x89PNG\r\n\x1a\n'
    except:
        return False

def fix_diagram_files():
    """Fix all diagram files in diagrams_output directory"""
    output_dir = 'diagrams_output'
    
    if not os.path.exists(output_dir):
        print(f"X Directory '{output_dir}' not found!")
        return
    
    print("=" * 60)
    print("Fixing diagram files - Adding .png extension")
    print("=" * 60)
    print()
    
    fixed_count = 0
    error_count = 0
    
    for filename in os.listdir(output_dir):
        filepath = os.path.join(output_dir, filename)
        
        # Skip if it's a directory
        if not os.path.isfile(filepath):
            continue
        
        # Skip if already has .png extension and is valid PNG
        if filename.endswith('.png'):
            if verify_png_file(filepath):
                print(f"OK Already PNG: {filename}")
                continue
        
        try:
            # Determine new filename
            if filename.endswith('.png'):
                new_filename = filename
            else:
                new_filename = filename + '.png'
            
            new_filepath = os.path.join(output_dir, new_filename)
            
            # Try to open as image and save as PNG
            try:
                img = Image.open(filepath)
                # Convert to RGB if necessary (for formats like RGBA)
                if img.mode in ('RGBA', 'LA', 'P'):
                    rgb_img = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    rgb_img.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = rgb_img
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Save as PNG
                img.save(new_filepath, 'PNG')
                
                # Remove old file if different name
                if new_filepath != filepath and os.path.exists(filepath):
                    os.remove(filepath)
                
                # Verify the new file
                if verify_png_file(new_filepath):
                    print(f"OK Fixed: {filename} -> {new_filename}")
                    fixed_count += 1
                else:
                    print(f"! Created but not valid PNG: {new_filename}")
                    error_count += 1
                    
            except Exception as e:
                # If PIL can't open it, check if it's already a PNG without extension
                if verify_png_file(filepath):
                    # Just rename it
                    if new_filepath != filepath:
                        os.rename(filepath, new_filepath)
                        print(f"OK Renamed: {filename} -> {new_filename}")
                        fixed_count += 1
                    else:
                        print(f"OK Already correct: {filename}")
                else:
                    # Check file type
                    try:
                        with open(filepath, 'rb') as f:
                            header = f.read(16)
                            # Check if it's a Graphviz dot file
                            if header.startswith(b'digraph') or header.startswith(b'graph'):
                                print(f"! Skipping Graphviz source file: {filename}")
                            else:
                                print(f"X Cannot convert {filename}: Not an image file")
                                error_count += 1
                    except:
                        print(f"X Cannot convert {filename}: {str(e)}")
                    error_count += 1
                    
        except Exception as e:
            print(f"X Error processing {filename}: {e}")
            error_count += 1
    
    print()
    print("=" * 60)
    print(f"OK Fixed: {fixed_count} files")
    if error_count > 0:
        print(f"X Errors: {error_count} files")
    print("=" * 60)

if __name__ == "__main__":
    fix_diagram_files()

