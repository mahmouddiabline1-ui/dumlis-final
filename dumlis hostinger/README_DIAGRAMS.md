# Diagram Generator Script

This Python script generates all the UML and system diagrams for the CMP (Course Management Platform) system documentation.

## Prerequisites

### 1. Install Graphviz

**Windows:**
- Download and install from: https://graphviz.org/download/
- Add Graphviz to your system PATH
- Restart your terminal/IDE after installation

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install graphviz
```

**Mac:**
```bash
brew install graphviz
```

### 2. Install Python Dependencies

```bash
pip install -r requirements_diagrams.txt
```

Or install individually:
```bash
pip install graphviz matplotlib pillow
```

## Usage

Run the script:
```bash
python generate_diagrams.py
```

All diagrams will be generated in the `diagrams_output/` directory as PNG files.

## Generated Diagrams

### 3.3.1 Use Case Diagram
- Shows actors (Student, Professor, Advisor, Administrator) and their use cases

### 3.3.2 Entity Relationship Diagram (ERD)
- Displays database entities and their relationships

### 3.3.3 Context Diagram
- High-level view of system interactions with external entities

### 3.3.4 Data Flow Diagrams (DFD)
- **Level 0**: Top-level DFD showing main processes and data stores
- **Level 1**: Decomposed view of main processes
- **Level 2**: Detailed decomposition of registration management

### 3.3.5 Activity Diagrams
- Student workflow
- Professor workflow
- Academic Advisor workflow
- Administrator workflow
- Absence Warning process
- Academic Warning process

### 3.3.6 Sequence Diagrams
- Student interactions
- Professor interactions
- Advisor interactions
- Administrator interactions
- Controller/System monitoring interactions

## Output

All diagrams are saved as PNG files in the `diagrams_output/` directory with descriptive filenames matching the section numbers in your documentation.

## Troubleshooting

If you encounter errors:

1. **"graphviz not found"**: Make sure Graphviz is installed and in your PATH
2. **Import errors**: Install required Python packages using pip
3. **Permission errors**: Ensure you have write permissions in the current directory

## Customization

You can modify the script to:
- Change colors and styles
- Add more entities or processes
- Adjust diagram sizes
- Modify labels and relationships

Edit the respective functions in `generate_diagrams.py` to customize the diagrams.






