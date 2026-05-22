# PlantUML Diagrams for DUMLIS

This file contains all PlantUML prompts for generating DUMLIS system diagrams.

## How to Use

1. **Online Editor**: Copy any `@startuml` block to [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
2. **VS Code Extension**: Install "PlantUML" extension and open the `.puml` file
3. **Command Line**: Use PlantUML jar file to generate images

## Available Diagrams

### 3.3.3 Context Diagram
- Shows system boundaries and external entities
- Actors: Student, Faculty Admin, Super Admin, External Systems
- System: DUMLIS University Management System

### 3.3.1 Use Case Diagram
- Shows all use cases for each actor
- Actors: Super Admin, Faculty Admin, Student
- Organized by functional packages

### 3.3.2 Entity Relationship Diagram (ERD)
- Complete database schema
- All entities and relationships
- Primary keys and foreign keys

### 3.3.4.1 DFD Level 0
- Top-level data flow diagram
- Shows system as single process
- External entities and data stores

### 3.3.4.2 DFD Level 1
- Decomposed system processes
- 15 main processes
- Data stores and flows

### 3.3.4.3 DFD Level 2
- Detailed Registration Management process
- 8 sub-processes
- Complete registration workflow

### 3.3.5 Activity Diagrams
- **3.3.5.1**: Student Workflow
- **3.3.5.2**: Faculty Admin Workflow
- **3.3.5.3**: Advisor Workflow
- **3.3.5.4**: Administrator Workflow
- **3.3.5.5**: Absence Warning Process
- **3.3.5.6**: Academic Warning Process

### 3.3.6 Sequence Diagrams
- **3.3.6.1**: Student Login and View
- **3.3.6.2**: Faculty Admin Operations
- **3.3.6.3**: Advisor Operations
- **3.3.6.4**: Administrator Operations
- **3.3.6.5**: Controller/System Monitoring

### 3.3.6 System Architecture Diagram
- Three-layer architecture
- Frontend, Data Management, Data Architecture
- Future backend and database integration

## Quick Start

1. Open `plantuml_diagrams.puml` in a PlantUML editor
2. Navigate to the diagram you want (search for `@startuml diagram_name`)
3. Copy the entire block from `@startuml` to `@enduml`
4. Paste into PlantUML editor or render directly

## Export Options

- **PNG**: Default format for documentation
- **SVG**: Scalable vector format
- **PDF**: For printing
- **ASCII**: Text-based diagrams

## Notes

- All diagrams use consistent styling (no shadows, rectangle packages)
- Entity names match your TypeScript types
- Relationships follow your database schema
- Use cases match your navigation structure
