# Chapter 3: System Analysis and Design

## 30 | Page

In this chapter, we provide detailed knowledge about our system including functional requirements, non-functional requirements, user requirements, system architecture, use case, and sequence diagrams. We can divide the process of analysis into three parts, which are determining requirements, determining system architecture, and determining development methodology. At the end of this chapter, we provide information about the tools and languages we needed to use to build our system.

---

## 3.1 System Requirements

System requirements encompass the essential configurations necessary for the efficient operation of a system. The next three subsections will discuss the functional requirements, non-functional requirements, and user requirements.

### 3.1.1 Non-Functional Requirements

The system must operate efficiently and meet the outlined requirements. Any failure in system components may cause the functions to stop or underperform. A non-functional requirement specifies criteria that can judge the operation of a system.

**Table 2: Non-Functional Requirements**

| Non-Functional Requirement | Description |
|---------------------------|-------------|
| **Performance** | Ensure seamless system interactions, fast data retrieval and processing, and optimized performance particularly for large datasets (3,500+ students, 10,000+ attendance records). The system must respond to user requests in less than 3 seconds. |
| **Scalability** | Design the platform to handle large numbers of users (administrators, faculty members, and students) and allow easy addition of new faculties, departments, programs, and courses without extensive rework. The system should support growth from hundreds to thousands of concurrent users. |
| **Usability** | The interface should be intuitive and easy to navigate for a diverse user base, ensuring a smooth user experience across all devices. The system should have a maximum of 2-3 clicks to reach any content. |
| **Security** | Implement strong security protocols to protect user data, including sensitive student information, academic records, and financial data. Role-based access control must ensure that users can only access data appropriate to their role. |
| **Compatibility** | Ensure the system is compatible across various devices and browsers, including desktop computers, tablets, and mobile devices. The system should work seamlessly on modern web browsers (Chrome, Firefox, Safari, Edge). |
| **Reliability** | The platform must maintain high availability, with minimal downtime and robust backend operations for seamless user experiences. The system should be available 24 hours a day with 99.9% uptime. |
| **Maintainability** | The system should be evolvable, scalable, testable, and maintainable. Clean coding practices must be followed, and the system should include exception handling mechanisms. |
| **Data Integrity** | The database should be secured from data leaks or loss of information. Regular backups and recovery features must be implemented to ensure data safety. |

### 3.1.2 Functional Requirements

In systems engineering, functional requirements are directly concerned with the system services, where a function is described as a specification of behavior. The following table lists the functions required in our system, with descriptions for each function.

**Table 3: Functional Requirements**

| Functional Requirement | Description |
|----------------------|-------------|
| **System Login** | The system must allow users to log into their accounts using credentials (username/email and password) based on their role (super administrator, faculty administrator, or student). |
| **Password Recovery** | The system should enable users to reset their password via a "Forgot Password" link sent to a verified email address. |
| **Student Data Management** | Administrators can manage comprehensive student profiles including personal information, academic records, contact details, and financial status. The system supports both old and new academic regulations. |
| **Advanced Search and Filtering** | Users can search for students using multiple criteria including name, student ID, faculty, department, level, GPA, and regulation type. Advanced filtering allows combination of multiple search criteria. |
| **Attendance Tracking** | Faculty members can record student attendance for lectures, sections, and laboratory sessions. The system automatically calculates attendance rates and identifies students at risk of academic warnings. |
| **Attendance Reports** | The system generates comprehensive attendance reports including individual student attendance, course attendance summaries, and attendance statistics. Reports can be exported in various formats. |
| **Academic Structure Management** | Administrators can define and manage faculties, departments, programs, courses, and academic regulations. The system supports complex academic rules including prerequisites and credit hour requirements. |
| **Academic Registration** | Students can view their academic registration status, and administrators can manage student course enrollments, registration blocks, and academic progression. |
| **Financial Management** | The system tracks student fees, processes payment permissions, and generates financial reports. Administrators can set up fees, collect payments, and generate financial summaries. |
| **GPA Management** | The system automatically calculates and tracks student GPAs. Administrators can modify GPAs when necessary and view GPA statistics and trends. |
| **Level Management** | Administrators can view and modify student levels, track level progression, and generate reports on student distribution across levels. |
| **Report Generation** | The system generates various reports including student lists, attendance summaries, academic performance reports, financial records, and regulatory compliance reports. Reports can be exported to Excel, PDF, or printed. |
| **Role-Based Access Control** | The system implements different access levels for super administrators (university-wide access), faculty administrators (faculty-specific access), and students (personal data access). |
| **Data Export** | Users can export data in various formats (Excel, CSV, PDF) for external analysis or record-keeping purposes. |
| **Bulk Operations** | Administrators can perform bulk operations on student data, such as updating multiple student records, generating batch reports, and managing group enrollments. |
| **Academic Rules Management** | Administrators can define and manage academic rules including registration rules, attendance policies, grading systems, and graduation requirements. |
| **Dashboard and Analytics** | The system provides dashboards with real-time statistics, charts, and analytics for administrators to monitor system usage, student performance, and institutional metrics. |

---

## 3.2 User Requirements

### 3.2.1 Super Administrators

The system must include comprehensive administrative functionalities allowing super administrators to manage the entire university system across all faculties.

Super administrators must be able to access and manage student data across all faculties in the university, including viewing, editing, and generating reports for any student regardless of their faculty affiliation.

The system should support faculty selection and switching, allowing super administrators to view faculty-specific analytics and manage data at both university-wide and faculty-specific levels.

Super administrators must be able to manage academic structures including creating, updating, and deleting faculties, departments, programs, and courses. They should have full control over academic regulations and rules.

The system must provide comprehensive reporting capabilities, allowing super administrators to generate university-wide reports on student enrollment, attendance, academic performance, and financial status.

Super administrators should have access to system-wide analytics and dashboards that provide insights into institutional performance, trends, and key metrics across all faculties.

The system must allow super administrators to manage user accounts, including creating administrator accounts, assigning roles, and managing access permissions for faculty administrators.

Super administrators must be able to perform system maintenance tasks including data backups, system updates, and configuration management.

### 3.2.2 Faculty Administrators

Faculty administrators must be able to manage student data within their specific faculty, including viewing student profiles, updating academic records, and generating faculty-specific reports.

The system should allow faculty administrators to record and monitor student attendance for courses within their faculty, with access to attendance reports and statistics.

Faculty administrators must be able to manage academic registrations for students in their faculty, including approving course enrollments, managing registration blocks, and tracking student progression.

The system must provide faculty administrators with tools to manage financial records for students in their faculty, including fee setup, payment tracking, and financial reporting.

Faculty administrators should have access to faculty-specific dashboards and analytics that provide insights into student performance, attendance trends, and academic metrics within their faculty.

The system must allow faculty administrators to generate and export various reports including student lists, attendance summaries, academic performance reports, and financial records specific to their faculty.

Faculty administrators must be able to manage academic structures within their faculty, including courses, programs, and academic regulations, subject to university-wide policies.

The system should provide faculty administrators with tools to identify and manage students at risk, including those with low attendance, poor academic performance, or financial issues.

### 3.2.3 Students

Students must be able to access their personal academic information including grades, attendance records, course schedules, and academic progress.

The system should allow students to view their financial status including fee payments, outstanding balances, and payment history.

Students must be able to access their academic registration information including enrolled courses, course schedules, and registration status.

The system should provide students with access to their attendance records, allowing them to monitor their attendance rates for each course and identify any attendance-related issues.

Students must be able to view their academic profile including GPA, level, academic standing, and graduation requirements progress.

The system should allow students to view and download official documents and reports related to their academic records.

Students must have access to a personalized dashboard that displays their key academic information, upcoming deadlines, and important notifications.

The system should provide students with the ability to view their complete academic history including past courses, grades, and academic achievements.

---

## 3.3 Development Methodology

After we knew the basic structure of the system, we are going to view all of its functions, the relation between them, and the sequence of their executions in the following subsections.

### 3.3.1 Use Case Diagram

A use case diagram, shown in Figure 2, is a way to summarize details of a system and the users within that system. It is generally shown as a graphic depiction of interactions among different elements in a system. Use case diagrams will specify the events in a system and how those events flow; however, use case diagrams do not describe how those events are implemented.

The DUMLIS use case diagram illustrates the interactions between three main actors (Super Administrator, Faculty Administrator, and Student) and the various functionalities of the system. Super Administrators have access to university-wide management functions including faculty management, system-wide reporting, and user account management. Faculty Administrators can manage student data, attendance, academic registrations, and financial records within their faculty. Students can access their personal academic information, view attendance records, and access academic reports.

**Figure 2: Use Case Diagram**

*[Insert: 3.3.1_use_case_diagram.png]*

---

### 3.3.2 Sequence Diagrams

Sequence diagrams show how users interact with the system during various operations. They explain the steps taken to perform specific tasks and how different system components interact to complete these operations.

#### 3.3.2.1 Student Sequence Diagram

The student sequence diagram, shown in Figure 3, demonstrates how students interact with the system to access their academic information, view attendance records, and retrieve personal data.

**Figure 3: Student Sequence Diagram**

*[Insert: 3.3.6.1_sequence_diagram_student.png]*

#### 3.3.2.2 Faculty Administrator Sequence Diagram

The faculty administrator sequence diagram, shown in Figure 4, shows how faculty administrators manage student data, record attendance, and generate reports within their faculty.

**Figure 4: Faculty Administrator Sequence Diagram**

*[Insert: 3.3.6.2_sequence_diagram_professor.png]*

#### 3.3.2.3 Advisor Sequence Diagram

The advisor sequence diagram, shown in Figure 5, illustrates how academic advisors interact with the system to view student information, provide guidance, and manage student academic progress.

**Figure 5: Advisor Sequence Diagram**

*[Insert: 3.3.6.3_sequence_diagram_advisor.png]*

#### 3.3.2.4 Administrator Sequence Diagram

The administrator sequence diagram, shown in Figure 6, demonstrates how super administrators manage the entire system, including faculty management, system-wide reporting, and user account management.

**Figure 6: Administrator Sequence Diagram**

*[Insert: 3.3.6.4_sequence_diagram_administrator.png]*

#### 3.3.2.5 Controller/System Sequence Diagram

The controller sequence diagram, shown in Figure 7, shows the internal system operations and how different system components interact to process requests and manage data flow.

**Figure 7: Controller Sequence Diagram**

*[Insert: 3.3.6.5_sequence_diagram_controller.png]*

---

### 3.3.3 Data Flow Diagram (DFD)

A Data Flow Diagram (DFD) is a graphical representation that illustrates the flow of data within a system and the processes that transform or manipulate that data. DFDs are widely used in system analysis and design to model the information flow and processes in a structured way. DFDs are divided into different types: (context diagram, DFD level 1, DFD level 2, etc.)

#### 3.3.3.1 Context Diagram (DFD Level 0)

Level 0 DFD, shown in Figure 8, is the highest level of abstraction in a DFD and is also known as a context diagram, which is the most basic data flow diagram. It provides a broad view that is easily digestible but offers little detail. Level 0 data flow diagram shows a single process node and its connections to external entities.

The context diagram for DUMLIS shows the system's interactions with external entities including Super Administrators, Faculty Administrators, Students, and external systems such as email services for notifications and file systems for report generation.

**Figure 8: Context Diagram**

*[Insert: 3.3.3_context_diagram.png]*

**Figure 9: DFD Level 0**

*[Insert: 3.3.4.1_dfd_level0.png]*

#### 3.3.3.2 Data Flow Diagram (Level 1)

A level 1 DFD, shown in Figure 10, is the second level in the hierarchy of DFDs and provides a more detailed view of the processes and data flows of a system than the level 0 DFD. It shows the highest-level processes and does not delve into the detailed subprocesses or data transformations within each process. They serve as a foundational diagram for understanding the system's overall structure and data flow at a high level.

The processes identified in the level 0 DFD are decomposed into sub-processes, and the data flows are further broken down into more specific data items. This level of detail allows for a more thorough understanding of the system's operations and helps identify potential issues or inefficiencies. In general, the level 1 DFD provides more detailed information about the system's processes and data flows than the level 0 DFD, but it is still at a high enough level of abstraction to be useful for communication and analysis.

**Figure 10: DFD Level 1**

*[Insert: 3.3.4.2_dfd_level1.png]*

#### 3.3.3.3 Data Flow Diagram (Level 2)

A level 2 DFD, shown in Figure 11, provides even more detailed decomposition of specific processes identified in level 1. This level focuses on detailed subprocesses within major system functions such as student registration management, attendance processing, or report generation.

**Figure 11: DFD Level 2**

*[Insert: 3.3.4.3_dfd_level2.png]*

---

### 3.3.4 Entity Relationship Diagram (ERD)

The Entity Relationship Diagram (ERD), shown in Figure 12, is a visual representation of the information created, stored, and used within the DUMLIS system. It illustrates the relationships between various entities and provides a structural overview of the database design.

The DUMLIS database is organized into the following main entities:

- **Users**: Stores user account information including username, email, password, and role (super_admin, faculty_admin, student).
- **Students**: Contains comprehensive student information including student ID, name, national ID, faculty, department, level, GPA, status, and regulation type.
- **Faculties**: Stores faculty information including faculty ID, name, code, student count, and staff count.
- **AcademicFaculty**: Represents the academic structure with faculty details, dean information, and associated departments.
- **AcademicDepartment**: Contains department information linked to faculties, including department head and associated programs.
- **AcademicProgram**: Stores program details including program name, code, degree type, credit hours, and associated courses.
- **AcademicCourse**: Contains course information including course code, name, credit hours, prerequisites, and course type.
- **StudyRegulation**: Stores academic regulation details including registration rules, attendance policies, and graduation requirements.
- **AcademicRules**: Comprehensive academic rules including study system, graduation requirements, level progression, and evaluation systems.
- **Attendance**: Records student attendance including student ID, course ID, session type, date, and attendance status.
- **FinancialRecords**: Tracks student financial information including fees, payments, and payment status.
- **Reports**: Stores generated reports and report configurations.

**Figure 12: Entity Relationship Diagram**

*[Insert: 3.3.2_erd_diagram.png]*

---

### 3.3.5 Activity Diagrams

An activity diagram describes how activities are coordinated to provide a service which can be at different levels of abstraction. Typically, an event needs to be achieved by some operations, particularly where the operation is intended to achieve several different things that require coordination, or how the events in a single use case relate to one another, in particular, use cases where activities may overlap and require coordination. It is also suitable for modeling how a collection of use cases coordinates to represent business workflows.

#### 3.3.5.1 Student Activity Diagram

The student activity diagram, shown in Figure 13, illustrates the workflow for student operations including accessing academic information, viewing attendance records, and retrieving personal data.

**Figure 13: Student Activity Diagram**

*[Insert: 3.3.5.1_activity_diagram_student.png]*

#### 3.3.5.2 Faculty Administrator Activity Diagram

The faculty administrator activity diagram, shown in Figure 14, demonstrates the workflow for faculty administrators managing student data, recording attendance, and generating reports.

**Figure 14: Faculty Administrator Activity Diagram**

*[Insert: 3.3.5.2_activity_diagram_professor.png]*

#### 3.3.5.3 Advisor Activity Diagram

The advisor activity diagram, shown in Figure 15, shows the workflow for academic advisors providing guidance and managing student academic progress.

**Figure 15: Advisor Activity Diagram**

*[Insert: 3.3.5.3_activity_diagram_advisor.png]*

#### 3.3.5.4 Administrator Activity Diagram

The administrator activity diagram, shown in Figure 16, illustrates the workflow for super administrators managing the entire system including faculty management and system-wide operations.

**Figure 16: Administrator Activity Diagram**

*[Insert: 3.3.5.4_activity_diagram_administrator.png]*

#### 3.3.5.5 Absence Warning Activity Diagram

The absence warning activity diagram, shown in Figure 17, demonstrates the automated process for identifying students with excessive absences and generating academic warnings.

**Figure 17: Absence Warning Activity Diagram**

*[Insert: 3.3.5.5_activity_diagram_absence_warning.png]*

#### 3.3.5.6 Academic Warning Activity Diagram

The academic warning activity diagram, shown in Figure 18, shows the process for identifying students with low GPAs and managing academic warning procedures.

**Figure 18: Academic Warning Activity Diagram**

*[Insert: 3.3.5.6_activity_diagram_academic_warning.png]*

---

### 3.3.6 System Architecture

The DUMLIS system follows a modern web application architecture with clear separation between frontend, backend, and database layers. The architecture is designed to be scalable, maintainable, and secure.

#### 3.3.6.1 Frontend Layer

The frontend is built using React with TypeScript, providing a responsive single-page application (SPA) that works seamlessly across desktop and mobile devices.

- **Technology Stack**: React 19.2.0, TypeScript 5.8.2, Tailwind CSS 4.1.17
- **Key Features**: 
  - Component-based architecture for reusability and maintainability
  - Responsive design using Tailwind CSS for mobile and desktop compatibility
  - Real-time data updates and interactive user interfaces
  - Role-based UI rendering based on user permissions

#### 3.3.6.2 Backend Layer

The backend handles business logic, data processing, and API endpoints. While the current implementation uses mock data, the architecture is designed to support integration with various backend technologies.

- **API Design**: RESTful API architecture for data exchange
- **Key Responsibilities**:
  - User authentication and authorization
  - Data validation and business rule enforcement
  - Data processing and calculations (GPA, attendance rates, etc.)
  - Report generation and data export

#### 3.3.6.3 Database Layer

The database stores all system data including student information, academic records, attendance data, and system configurations.

- **Data Storage**: Structured data storage for efficient querying and reporting
- **Key Entities**: Students, Courses, Attendance, Financial Records, Academic Structures
- **Data Relationships**: Complex relationships between entities as defined in the ERD

#### 3.3.6.4 System Architecture Diagram

**Figure 19: System Architecture**

*[Note: Create a system architecture diagram showing Frontend (React/TypeScript), Backend API, Database, and external integrations]*

The architecture diagram illustrates the three-tier architecture:
1. **Presentation Layer**: React-based frontend with responsive UI
2. **Application Layer**: Backend API handling business logic
3. **Data Layer**: Database storing all system data

---

### 3.3.7 Development Methodology

The DUMLIS project follows an Agile development methodology with iterative development cycles. The development process is divided into phases focusing on different aspects of the system.

#### 3.3.7.1 Agile Methodology

The Agile methodology is an iterative and incremental approach to project management, designed to accommodate change and deliver value continuously. It emphasizes collaboration, adaptability, and the delivery of small, functional increments to meet evolving project needs and stakeholder expectations.

In Agile, development is divided into short cycles called iterations, typically lasting one to four weeks. Each iteration involves planning, development, testing, and review, ensuring that progress is tangible and improvements are ongoing. This iterative process allows teams to adapt quickly to feedback and evolving requirements.

#### 3.3.7.2 Product Backlog Creation

**Stakeholder Meetings**: Initial meetings were conducted with stakeholders including university administrators, faculty members, and students to gather requirements and understand their needs and expectations.

**User Stories**: User stories were created based on requirements. Examples include:
- "As a super administrator, I want to manage student data across all faculties to maintain centralized control."
- "As a faculty administrator, I want to record student attendance efficiently to track student engagement."
- "As a student, I want to view my attendance records to monitor my academic standing."
- "As an administrator, I want to generate comprehensive reports to support decision-making."

**Prioritization**: User stories were prioritized based on value and urgency:
- **High Priority**: Student data management, attendance tracking, user authentication
- **Medium Priority**: Advanced search, reporting, financial management
- **Low Priority**: Advanced analytics, mobile app, third-party integrations

#### 3.3.7.3 Sprint Planning

**Sprint Goals**: Each sprint had defined goals such as "Implement student data management module" or "Develop attendance tracking system."

**Task Breakdown**: User stories were broken down into smaller, actionable tasks:
- "Implement student data management" divided into: UI design, data structure definition, search functionality, export capabilities
- "Develop attendance tracking" divided into: Attendance entry interface, attendance calculation logic, attendance reporting

**Estimation**: Tasks were estimated using story points based on complexity and size.

#### 3.3.7.4 Sprint Execution

**Daily Standups**: Daily standup meetings were conducted where team members shared:
- What they accomplished yesterday
- What they plan to do today
- Any impediments or blockers

**Task Management**: Tasks were tracked using version control (Git) and project management tools, moving through stages: "To Do" → "In Progress" → "Done"

**Collaboration Tools**: 
- Git: For version control and code repository management
- GitHub/GitLab: For code hosting and collaboration
- Communication: Team communication and updates

#### 3.3.7.5 Sprint Review and Retrospective

**Demonstration**: At the end of each sprint, completed features were demonstrated to stakeholders.

**Feedback Collection**: Stakeholder feedback was gathered to understand satisfaction and identify required adjustments.

**Backlog Update**: The product backlog was updated based on feedback, adding new features or reprioritizing existing ones.

**Retrospective**: Team meetings were held to evaluate the sprint process, identify improvements, and plan implementation for the next sprint.

---

## 3.4 Technologies Used

**Table 4: Technologies Used**

| Category | Tools/Technologies | Purpose |
|----------|-------------------|---------|
| **Analysis & Design** | Use Case Diagram, Context Diagram, ERD Diagram, DFD Diagrams, Activity Diagrams, Sequence Diagrams | System analysis and design documentation |
| **Diagram Editor** | Python (Matplotlib, Graphviz), Software Ideas Modeler | Creating UML and system diagrams |
| **Frontend Development** | React 19.2.0, TypeScript 5.8.2, Tailwind CSS 4.1.17 | Building responsive user interface |
| **UI Components** | Lucide React (Icons), Recharts (Charts) | User interface components and data visualization |
| **Build Tools** | Vite 6.2.0 | Fast build tool and development server |
| **Development Environment** | VS Code, Node.js | Code editor and runtime environment |
| **Version Control** | Git, GitHub/GitLab | Source code management and collaboration |
| **Backend (Future)** | Node.js/Express, Python/Flask, or PHP/Laravel | Backend API development (to be implemented) |
| **Database (Future)** | PostgreSQL, MySQL, or MongoDB | Data storage and management (to be implemented) |
| **Testing (Future)** | Jest, React Testing Library | Unit and integration testing (to be implemented) |
| **Deployment (Future)** | Docker, Cloud platforms (AWS, Azure, etc.) | Application deployment and hosting (to be implemented) |

---

## 3.5 Summary

In this chapter, we provide the reader with detailed knowledge about our system. Section 3.1 provides system requirements which are divided into functional and non-functional requirements. Section 3.2 provides user requirements which specify different specifications for different user types (super administrators, faculty administrators, and students). Section 3.3 provides development methodology which includes UML diagrams that show the details of how the system will function, including use case diagrams, sequence diagrams, data flow diagrams, entity relationship diagrams, and activity diagrams. Section 3.4 provides information about the technologies and tools used to build the system.

The system analysis and design phase has established a solid foundation for the DUMLIS system, defining clear requirements, user needs, system architecture, and development approach. The comprehensive diagrams and documentation provide a clear roadmap for system implementation and ensure that all stakeholders have a shared understanding of the system's functionality and structure.

---

## 49 | Page

