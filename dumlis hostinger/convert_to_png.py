"""
Convert existing Graphviz DOT files to PNG using Python graphviz library
"""

import os
from graphviz import Source

def convert_all_to_png():
    """Convert all DOT files in diagrams_output to PNG"""
    output_dir = 'diagrams_output'
    
    if not os.path.exists(output_dir):
        print(f"Directory '{output_dir}' not found!")
        return
    
    print("=" * 60)
    print("Converting DOT files to PNG images")
    print("=" * 60)
    print()
    
    converted = 0
    errors = 0
    
    for filename in os.listdir(output_dir):
        filepath = os.path.join(output_dir, filename)
        
        if not os.path.isfile(filepath):
            continue
        
        # Skip PNG files
        if filename.endswith('.png'):
            continue
        
        # Check if it's a DOT file - read full file
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                if 'digraph' not in content and 'graph' not in content:
                    print(f"! Skipping (not DOT): {filename}")
                    continue
        except Exception as e:
            print(f"! Error reading {filename}: {e}")
            continue
        
        try:
            # Read the DOT file (already read above, but read again for safety)
            with open(filepath, 'r', encoding='utf-8') as f:
                dot_content = f.read()
            
            print(f"Processing: {filename} ({len(dot_content)} chars)")
            
            # Create PNG filename
            base_name = filename
            if base_name.endswith('.gv') or base_name.endswith('.dot'):
                base_name = base_name[:-3]
            
            png_filename = base_name + '.png'
            png_filepath = os.path.join(output_dir, png_filename)
            
            # Convert using graphviz Source
            src = Source(dot_content, format='png')
            src.render(base_name, directory=output_dir, cleanup=True)
            
            # Check if PNG was created
            if os.path.exists(png_filepath):
                print(f"OK: {filename} -> {png_filename}")
                converted += 1
                # Remove original DOT file
                try:
                    os.remove(filepath)
                except:
                    pass
            else:
                # Check for file without extension
                possible_png = os.path.join(output_dir, base_name)
                if os.path.exists(possible_png):
                    os.rename(possible_png, png_filepath)
                    print(f"OK: {filename} -> {png_filename}")
                    converted += 1
                    try:
                        os.remove(filepath)
                    except:
                        pass
                else:
                    print(f"X Failed: {filename}")
                    errors += 1
                    
        except Exception as e:
            print(f"X Error with {filename}: {str(e)}")
            errors += 1
    
    print()
    print("=" * 60)
    print(f"Converted: {converted} files")
    if errors > 0:
        print(f"Errors: {errors} files")
    print("=" * 60)

if __name__ == "__main__":
    convert_all_to_png()

