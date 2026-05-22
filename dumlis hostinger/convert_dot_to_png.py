"""
Convert Graphviz DOT files to PNG images
تحويل ملفات Graphviz DOT إلى صور PNG
"""

import os
import subprocess

def convert_dot_to_png():
    """Convert all .dot or dot files in diagrams_output to PNG"""
    output_dir = 'diagrams_output'
    
    if not os.path.exists(output_dir):
        print(f"X Directory '{output_dir}' not found!")
        return
    
    print("=" * 60)
    print("Converting Graphviz DOT files to PNG images")
    print("=" * 60)
    print()
    
    converted_count = 0
    error_count = 0
    
    for filename in os.listdir(output_dir):
        filepath = os.path.join(output_dir, filename)
        
        # Skip if it's a directory
        if not os.path.isfile(filepath):
            continue
        
        # Skip if already PNG
        if filename.endswith('.png'):
            continue
        
        # Skip if it's a .gv or .dot file (we'll process the base name)
        if filename.endswith('.gv') or filename.endswith('.dot'):
            base_name = filename[:-3]
        else:
            base_name = filename
        
        png_filename = base_name + '.png'
        png_filepath = os.path.join(output_dir, png_filename)
        
        try:
            # Check if file is a Graphviz DOT file
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                first_line = f.read(100)
                if not ('digraph' in first_line or 'graph' in first_line):
                    print(f"! Skipping (not a Graphviz file): {filename}")
                    continue
            
            # Use Graphviz dot command to convert to PNG
            # Try: dot -Tpng input -o output.png
            cmd = ['dot', '-Tpng', filepath, '-o', png_filepath]
            
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0 and os.path.exists(png_filepath):
                print(f"OK Converted: {filename} -> {png_filename}")
                converted_count += 1
                # Remove original file if conversion successful
                if filepath != png_filepath:
                    try:
                        os.remove(filepath)
                    except:
                        pass
            else:
                error_msg = result.stderr.strip() if result.stderr else "Unknown error"
                print(f"X Failed to convert {filename}: {error_msg}")
                error_count += 1
                
        except FileNotFoundError:
            print("X ERROR: Graphviz 'dot' command not found!")
            print("  Please install Graphviz:")
            print("  Windows: Download from https://graphviz.org/download/")
            print("  Make sure to add Graphviz to your PATH")
            break
        except subprocess.TimeoutExpired:
            print(f"X Timeout converting {filename}")
            error_count += 1
        except Exception as e:
            print(f"X Error processing {filename}: {str(e)}")
            error_count += 1
    
    print()
    print("=" * 60)
    print(f"OK Converted: {converted_count} files")
    if error_count > 0:
        print(f"X Errors: {error_count} files")
    print("=" * 60)

if __name__ == "__main__":
    convert_dot_to_png()




