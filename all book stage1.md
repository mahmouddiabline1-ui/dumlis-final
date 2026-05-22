                                                                                                

 

Dumlis  

Team Members  

- 

Academic Number 

Name 

Department 

1 

806528738 

Mahmoud Abdelaziz Diab 

Is 

2 

804616614 

Ahmed Ahmed Abdelsalam 

Is 

3 

804626310 

Abdelrahman Elaraby Abdelaziz  

IT 

4 

808971654 

Ebrahim Sami Mohammed 

IS 

5 

804616210 

Ebrahim Alaa Mohammed 

It 

6 

800167546 

Fares Tarek Hassan 

IS 

7 

804621664 

Khaled Kadry Elsaid 

IS 

Supervised By  

Professor. Wael Abd Elkader Awad   

Dr.Nesma Ibrahim 

 

Acknowledgment 

We begin by expressing our sincere gratitude to Allah for His endless blessings and guidance, which have been our source of strength and perseverance throughout the journey of this project. Without His grace, this achievement would not have been possible. 

We would like to extend our heartfelt appreciation to our advisors, Professor Wael Abd Elkader Awad and Dr. Nesma Ibrahim, for their invaluable guidance, continuous support, and constructive feedback throughout the development of this project. Their expertise, encouragement, and trust played a vital role in shaping this work and ensuring its success. 

We are also deeply thankful to the teaching assistants who generously offered their time, support, and technical assistance, helping us overcome challenges and refine our work at different stages of the project. 

Our deepest gratitude goes to our parents and families for their unconditional love, patience, and encouragement, which have been the foundation of our success. We also extend our thanks to our friends and colleagues for their continuous motivation and support. 

Finally, we would like to acknowledge the dedication, cooperation, and teamwork of our project group. This project has been a valuable learning experience that strengthened our knowledge, skills, and confidence, and we hope that this work serves as a meaningful contribution and a source of inspiration for future students. 

 

 

 

 

 

 

 

 

 

Abstract  

 

Student affairs management is one of the most critical functions in any educational institution, directly impacting the quality of education and administrative efficiency. Egyptian universities, with their large student populations and complex academic structures, face significant challenges in managing student data, academic records, attendance, and administrative processes using traditional methods. DUMLIS (Damietta University Management and Learning Information System) is a comprehensive graduation project developed to modernize and streamline student affairs management at Damietta University by integrating advanced web technologies into a cohesive, user-friendly platform. 

 

The project comprises a responsive web application that aims to deliver a seamless, efficient, and comprehensive experience for administrators, faculty members, and students. By utilizing modern web technologies including React, TypeScript, and responsive design principles, the system brings student affairs management into the digital age, allowing users to manage student data, track attendance, handle academic registrations, and generate reports in ways never before possible. 

 

In the student data management module, administrators can manage comprehensive student profiles for over 3,500 students, including personal information, academic records, contact details, and financial status. The system supports both old and new academic regulations, allowing for flexible management of different student cohorts. Advanced search and filtering capabilities enable quick access to specific student information, while bulk operations facilitate efficient data management. 

 

The attendance tracking system provides a robust solution for recording and monitoring student attendance across multiple courses and sessions. With over 10,000 attendance records, the system allows professors to easily record attendance for lectures, sections, and laboratory sessions. Real-time statistics and attendance summaries help identify students at risk of academic warnings due to excessive absences, ensuring compliance with university attendance policies. 

 

An additional feature is the comprehensive academic structure management system, allowing administrators to define and manage faculties, departments, programs, courses, and academic regulations. The system supports complex academic rules including credit hour requirements, prerequisite management, grading systems, and graduation requirements. This ensures consistency and accuracy in academic planning and student progression tracking. 

 

To further enhance administrative efficiency, the platform includes a financial management module for tracking student fees, payment permissions, and financial reports. The system also provides extensive reporting capabilities, generating various reports for student data, attendance summaries, academic performance, and financial records. 

 

By making student affairs management more automated, accessible, and data-driven, DUMLIS not only improves administrative efficiency but also enhances the overall educational experience for students and faculty members. The system's role-based access control ensures that each user type (super administrators, faculty administrators, and students) has appropriate access to relevant features and data, maintaining security while promoting transparency. 

 

 

 

Table of Contents  

 

Acknowledgement ..................................................................................................................... 2  

Abstract ...................................................................................................................................... 3   

Table of Contents ...................................................................................................................... 4   

List of Tables ............................................................................................................................. 6   

List of Figures ............................................................................................................................ 7   

CHAPTER 1 Introduction.................................................................................................11 

    1.1  overview ....................................................................................................................... 12  

     1.2 Problem Definition ............................ ............................................................... 13  

    1.3Project Objectives ....................................................................................................... 14 

    1.4 Project Scope........................................................................................................16  

CHAPTER 2 Background and related work ............................................................... 17   

    2.1background .................................................................................................................... 18      2.2related work .................................................................................................................. 20   

CHAPTER 3 System Analysis and Design .................................................................. 24   

   3.1Project Methodology .................................................................................................. 25   

   3.2System Requirements ............................................................................................ 36   

   3.3Use Case Diagrams ....................................................................................................... 39   

   3.4Context Diagram ......................................................................................................... 43   

   3.5ERD Diagram (Database Schema) ................................................................ 44   

   3.6Sequence Diagram ....................................................................................................... 45   

   3.7System Architecture ..................................................................................................... 53   

   3.8Technologies Used ..................................................................................................... 56   

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

List of Tables  

 

Table 1: Team Members ........................................................................................................ 2   

Table 2.1: Related Work Summary ................................................................................... 22   

Table 2.2: Comparison between Previous Applications & Our System ............ 23   

Table 3.1: Non-Functional Requirements ..................................................................... 36   

Table 3.2: Admin Functional Requirements ................................................................. 37   

Table 3.3: User Functional Requirements ..................................................................... 38   

Table 3.4: Technologies Used ............................................................................................. 56   

 

 

 

 

 

 

 

 

 

 

 

List of Figures  

 

Figure 1-1: Project Timeline ................................................................................................... 17   

Figure 3-1: Use Case Diagram ................................................................................................ 39   

Figure 3-2: Student Sequence Diagram ................................................................................. 45   

Figure 3-3: Faculty Administrator Sequence Diagram ......................................................... 45   

Figure 3-4: Advisor Sequence Diagram ................................................................................. 45   

Figure 3-5: Administrator Sequence Diagram ....................................................................... 45   

Figure 3-6: Controller Sequence Diagram .............................................................................. 45   

Figure 3-7: Context Diagram ................................................................................................... 43   

Figure 3-8: DFD Level 0 .......................................................................................................... 43   

Figure 3-9: DFD Level 1 .......................................................................................................... 43   

Figure 3-10: DFD Level 2 ........................................................................................................ 43   

Figure 3-11: ERD Diagram (Database Schema) ...................................................................... 44   

Figure 3-12: Student Activity Diagram ................................................................................. 45   

Figure 3-13: Faculty Administrator Activity Diagram ........................................................... 45   

Figure 3-14: Advisor Activity Diagram .................................................................................. 45   

Figure 3-15: Administrator Activity Diagram .......................................................................... 45   

Figure 3-16: Absence Warning Activity Diagram .................................................................... 45   

Figure 3-17: Academic Warning Activity Diagram ................................................................. 45   

Figure 3-18: System Architecture ............................................................................................ 53   

 

 

 

 

 

 

 

 

 

 

 

 

 

 

 

CHAPTER 1 

Introduction 

 

 

 

 

 

 

 

 

 

Overview  

 

 

DUMLIS (Damietta University Management and Learning Information System) is a web-based student affairs management system for Damietta University. It centralizes student data and supports daily operations for administrators, faculty administrators, and students. 

 

**Key Features:** 

 

- **Student Records**: Profiles, academic records, and financial status management. 

- **Attendance**: Recording, calculations, and attendance reporting. 

- **Academic Structure**: Faculties, departments, programs, courses, and regulations. 

- **Search & Reports**: Multi-criteria search, exports, and analytics. 

- **Security & UI**: Role-based access control and responsive web interface. 

 

The system supports both old and new academic regulations. 

 

In this chapter, we introduce our proposed project. First, in section 1.2, we discuss the problem definition behind the project, highlighting the need for a modern student affairs management solution. In section 1.3, we outline the key objectives of DUMLIS, detailing the major features and goals that drive the project. Next, section 1.4 defines the scope of the project, setting boundaries for what DUMLIS intends to achieve. Finally, section 1.5 presents the project timeline and phases. 

 

 

 

 

 

 

 

 

1.1 PROBLEM DEFINITION 

 

Universities today face significant challenges in efficiently managing student affairs, particularly as institutions grow and academic processes become more complex. One of the most pressing issues is the lack of a centralized, integrated system to manage student data, attendance, academic structures, financial records, and regulatory compliance. Current administrative methods rely heavily on fragmented systems, manual data entry, and paper-based records, which are time-consuming, error-prone, and inefficient. 

Student information is often scattered across multiple departments, leading to data duplication, inconsistencies, and difficulties in updating or retrieving accurate records. Similarly, attendance tracking is largely manual, making it difficult for faculty and administrators to monitor student engagement or identify at-risk students in a timely manner. Managing complex academic structures and multiple regulations without a unified platform further complicates administrative processes, increasing the likelihood of errors in course registration, GPA calculation, and graduation tracking. Financial management and reporting also suffer from manual processes, creating inefficiencies and reducing transparency for both administrators and students. 

In response to these challenges, there is a need for a comprehensive, technology-driven solution that integrates all aspects of student affairs management into a single, secure platform. The DUMLIS project aims to address these issues by providing a centralized system for student information management, automated attendance tracking, academic structure administration, financial management, and role-based access control. This system will enable accurate, real-time data management, streamline administrative workflows, improve operational efficiency, and support data-driven decision-making, ultimately enhancing the overall student experience and university effectiveness. 

 

1.2 project Objectives 

 

The objectives of the DUMLIS project focus on creating a comprehensive, secure, and user-friendly system to improve the management of student affairs at Damietta University. Key objectives include: 

Centralize Student Data Management – Integrate all student information (personal, academic, financial, and administrative data) into a single system to ensure accuracy, consistency, and easy access. 

Automate Attendance Tracking – Implement an automated system to record attendance, calculate rates, and identify students at risk, improving efficiency and supporting academic success. 

Streamline Academic Structure Management – Manage faculties, departments, programs, courses, prerequisites, credit hours, and graduation requirements in an integrated and flexible platform. 

Enable Comprehensive Reporting – Provide real-time, customizable reports and analytics on student performance, attendance, financials, and other metrics to support informed decision-making. 

Implement Role-Based Access Control (RBAC) – Ensure secure access for super administrators, faculty administrators, and students with granular permissions and audit logging. 

Support Multiple Academic Regulations – Handle both old and new regulations simultaneously, accommodating different student cohorts and ensuring smooth transitions. 

Automate Financial Management – Manage student fees, payments, invoices, and reports efficiently, reducing manual errors and supporting payment plans. 

Provide Advanced Search and Filtering – Enable powerful search and filtering to quickly locate student information, generate targeted reports, and perform bulk operations. 

Ensure Cross-Platform Accessibility – Design a responsive web application compatible with desktops, tablets, and mobile devices, ensuring access for all users. 

Enhance User Experience – Create an intuitive, user-friendly interface that improves productivity for administrators and makes it easy for students to access their information. 

Maintain Data Integrity and Security – Implement validation, backup, encryption, and other security measures to protect sensitive student data and ensure accuracy. 

Facilitate Academic Decision-Making – Provide dashboards, analytics, predictive insights, and resource allocation tools to support data-driven decisions for academic planning and interventions. 

 

1.3 Contributions 

Comprehensive Student Data Management: 
DUMLIS centralizes all student information in a single platform, including personal details, academic records, financial status, and enrollment history. This ensures that administrators have accurate, flexible, and easily accessible data, facilitating efficient management of the student lifecycle. 

Automated Attendance Tracking: 
The system automates the recording and monitoring of student attendance across lectures, laboratory sessions, and sections. Real-time calculations, alerts for low attendance, and detailed reports enable faculty and administrators to identify students at risk and take proactive measures. 

Efficient Academic Structure Management: 
DUMLIS manages the hierarchical academic organization of the university, including faculties, departments, programs, courses, and academic regulations. The system automatically tracks prerequisites, credit hours, GPA calculations, and graduation requirements, ensuring academic compliance and smooth progression. 

Integrated Financial Management: 
The platform automates student fee calculations, payment tracking, and reporting. Integration with academic data allows administrators to identify students with financial issues and coordinate support, providing a holistic approach to student administration. 

Advanced Reporting and Analytics: 
DUMLIS provides both pre-built and ad-hoc reports, as well as real-time analytics on student performance, attendance trends, and financial metrics. These capabilities enable data-driven decision-making, program evaluation, and strategic planning. 

Role-Based Access Control: 
Secure access control ensures that users only access data relevant to their role, including super administrators, faculty administrators, and students. Security measures such as encryption, audit logging, and least-privilege access protect sensitive information while maintaining workflow efficiency. 

Support for Multiple Academic Regulations: 
The system accommodates students enrolled under different academic regulations, automatically applying the appropriate rules based on cohort. This feature ensures flexibility and adaptability to policy changes. 

User-Friendly Interface and Accessibility: 
DUMLIS offers an intuitive interface and supports multiple devices, ensuring that administrators, faculty, and students can efficiently interact with the system. Workflows are simplified to enhance productivity and usability. 

Cost-Effective and Scalable Solution: 
Designed to be lightweight and affordable, DUMLIS can scale to support thousands of users and large datasets without requiring heavy infrastructure, making it suitable for universities of varying sizes. 

 

1.4 Project Scope 

The DUMLIS project provides a comprehensive solution for student affairs management at Damietta University by integrating student data management, attendance tracking, academic structure management, financial management, and reporting systems into a unified web-based platform. The system is designed to streamline administrative processes, ensure data consistency, and enhance decision-making through real-time analytics and automation. 

The platform centralizes student information, including personal details, academic records, financial status, and enrollment information, while supporting multiple academic regulations and complex program structures. Automated features such as bulk updates, prerequisite checks, GPA calculations, and attendance monitoring reduce administrative workload and improve accuracy. 

Administrators, faculty members, and students interact with the system through a responsive web interface, optimized for desktop, tablet, and mobile devices. Advanced search, filtering, and role-based access control ensure that users can efficiently access relevant information while maintaining data security. 

Future expansion possibilities include: 

Integration with external university systems (e.g., libraries, email, payment gateways) 

Advanced analytics and predictive tools for student performance and retention 

Mobile native applications for enhanced accessibility 

Extended reporting and business intelligence features 

Enhanced student self-service capabilities, including course registration and grade submissions 

DUMLIS aims to modernize student affairs management, reduce manual administrative effort, and provide a flexible, scalable foundation for future digital transformation at Damietta University. 

 

 

 

 

 

 

 

 

 

Chapter 2 

 Background and Related Work 

 

 

In this chapter, we provide a background about our system. We also review the previous related work to our system. At the end of the chapter, we provide a comparison between the system we are going to build and the related systems. 

 

 

 

2.1 Background 

This chapter provides a comprehensive background on the DUMLIS system, exploring its theoretical foundations, technological context, and practical considerations. The aim is to present a detailed understanding of the system’s architecture, modules, and functionalities, and to explain the rationale behind our design choices. Additionally, this chapter reviews related work, highlighting similarities, differences, and the innovations DUMLIS introduces compared to existing solutions. 

The development of DUMLIS was guided by extensive research into student information systems (SIS), educational administration practices, and modern web application architecture. The study traced the evolution of student information systems from early mainframe-based solutions, through client-server architectures, to modern cloud-based platforms. This evolution was analyzed to identify best practices, common pitfalls, and features that improve usability, scalability, and maintainability. 

Moreover, DUMLIS design specifically addresses the needs of Egyptian universities and similar institutions in developing countries. These considerations include: 

Arabic language support and right-to-left (RTL) interface compatibility, ensuring accessibility for all users. 

Compliance with local academic regulations, including support for multiple academic cohorts, transitional rules, and program-specific exceptions. 

Resource optimization, allowing the system to function efficiently even with limited IT infrastructure. 

User-centered design, prioritizing simplicity and clarity in workflows for administrators, faculty, and students. 

By integrating these considerations, DUMLIS ensures that the system is both technologically advanced and practically relevant, bridging the gap between international SIS standards and local institutional requirements. 

 

 

 

 

2.1.1 Primary Components of DUMLIS 

Student Data Management Module 
The Student Data Management Module is the core of DUMLIS, centralizing all student information into a single, coherent platform. It manages: 

Personal information (demographics, contact info, emergency contacts, special accommodations) 

Academic records (course registrations, grades, GPAs, academic standing, progression tracking) 

Financial data (fees, payments, outstanding balances) 

Enrollment history and cohort management 

Built on modern web technologies with robust database design, the module ensures data integrity, consistency, and flexibility. Features include: 

Quick access to complete student profiles 

Navigation across related data with minimal clicks 

Bulk operations (e.g., updating multiple records or generating cohort reports) 

Dual-regulation support, enabling automatic application of academic rules according to each student’s cohort 

This module guarantees a powerful and adaptable system that remains compliant with changing policies while supporting large-scale academic administration. 

Attendance Tracking System 
This module automates attendance management across courses and sessions. Features include: 

Easy marking of present, absent, excused, or late students 

Real-time calculation of attendance rates per student, per course, and institution-wide trends 

Alerts for students falling below thresholds 

Notes for special cases 

By automating attendance monitoring, the system provides actionable insights that allow early intervention for students at risk of poor engagement or academic failure. 

Academic Structure Management 
This module manages the university’s hierarchical academic organization, including faculties, departments, programs, courses, and regulations. It supports: 

Credit hour requirements, prerequisites, grading systems, and graduation criteria 

Automatic progress calculation, GPA tracking, and prerequisites enforcement 

Detailed reporting for advisors, administrators, and students 

It ensures accurate academic data management, facilitates planning, and supports complex academic structures efficiently. 

Financial Management Module 
Automates calculation, tracking, and reporting of student fees, integrating with academic data to: 

Support multiple fee types (tuition, registration, labs, special fees) 

Handle various payment methods and gateways 

Provide real-time financial reporting for individuals, faculties, and the institution 

Identify students at financial risk 

The module’s integration of financial and academic data enables coordinated intervention for at-risk students, improving retention and academic success. 

Reporting and Analytics System 
DUMLIS provides extensive reporting and analytics, including: 

Pre-built and customizable reports with filters, sorting, and export to PDF/Excel/CSV 

Real-time analytics on academic performance, attendance, and financial metrics 

Decision-support tools for administrators and faculty 

These features enable data-driven decision-making and strategic planning at all levels of the institution. 

Role-Based Access Control 
To protect sensitive information, DUMLIS implements role-based access: 

Super Administrators: full access 

Faculty Administrators: faculty-specific access 

Students: personal data only 

Security is reinforced with least-privilege access, encryption, and audit logging, balancing protection with workflow efficiency. 

 

 

 

 

2.2 Review of Relevant Work 

This section reviews previous work related to DUMLIS, analyzing existing student information systems, their strengths and limitations, and how these influenced DUMLIS design decisions. Understanding the historical and technological evolution of SIS is crucial to ensure DUMLIS addresses gaps and improves on existing solutions. 

2.2.1 Evolution of Student Information Systems 

Student information systems have evolved from mainframe-based solutions in the 1970s and 1980s, to client-server architectures in the 1990s, and finally to modern web- and cloud-based platforms. 

Early systems offered high computational power but were resource-heavy, requiring specialized knowledge and infrastructure. 

Client-server systems improved accessibility but still relied on desktop applications and complex maintenance. 

Modern web-based and cloud-based solutions provide universal access, mobile support, cost efficiency, and scalability, though many still fail to meet localized needs (e.g., Arabic support, multiple regulations, flexible reporting). 

This evolution revealed a trade-off between system complexity, cost, and feature availability, which DUMLIS addresses by combining advanced features with simplicity and local relevance. 

 

2.2.2 Selected Existing Systems 

Ellucian Banner 

Advantages: Comprehensive integration, scalability, regulatory compliance, multi-institution support, advanced reporting 

Disadvantages: High cost, complex implementation, limited Arabic support, heavy infrastructure 

DUMLIS: Cost-effective, rapid deployment, full Arabic support, lightweight infrastructure 

Oracle PeopleSoft Campus Solutions 

Advantages: Enterprise integration, mobile access, advanced analytics 

Disadvantages: Extremely high cost, complex setup, limited Arabic support 

DUMLIS: Affordable, essential features for Egyptian universities, native Arabic support, simplified architecture 

PowerSchool 

Advantages: Cloud-based, user-friendly, real-time updates, parent portal 

Disadvantages: Primarily K-12, limited higher education support, basic financial management 

DUMLIS: Focus on higher education, advanced academic and financial management, university-specific reporting 

OpenSIS 

Advantages: Open-source, customizable, multi-language support 

Disadvantages: Outdated technology, limited higher education features 

DUMLIS: Modern tech stack, full Arabic support, advanced reporting 

Local Egyptian University Systems 

Advantages: Local compliance, Arabic support, custom maintenance 

Disadvantages: Limited features, outdated tech, poor UX, limited integration 

DUMLIS: Comprehensive modern platform, scalable, excellent UX, professional documentation 

 

2.2.3 Comparative Summary 

Table 2.1: Related Work Summary 

System 

Type 

Key Strengths 

Key Limitations 

Ellucian Banner 

Commercial ERP 

Comprehensive, scalable, regulatory compliance 

High cost, limited Arabic support 

Oracle PeopleSoft 

Commercial ERP 

Comprehensive, enterprise integration 

Very high cost, complex setup 

PowerSchool 

Commercial SIS 

User-friendly, mobile, real-time updates 

K-12 focus, limited higher ed features 

OpenSIS 

Open-source SIS 

Free, customizable 

Outdated tech, limited higher ed features 

Local Egyptian Systems 

Custom 

Local compliance, Arabic support 

Limited features, poor UX 

 

 

 

Table 2.2: DUMLIS vs Existing Systems 

 

Feature 

Ellucian 

PeopleSoft 

PowerSchool 

OpenSIS 

Local Systems 

DUMLIS 

Student Data Management 

✓ 

✓ 

✓ 

✓ 

✓ 

✓ 

Attendance Tracking 

✓ 

✓ 

✓ 

✓ 

Limited 

✓ 

Academic Structure Management 

✓ 

✓ 

Limited 

Limited 

Limited 

✓ 

Financial Management 

✓ 

✓ 

Basic 

Basic 

Limited 

✓ 

Multiple Regulations 

✓ 

✓ 

✗ 

Limited 

Limited 

✓ 

Advanced Search & Filtering 

✓ 

✓ 

Basic 

Basic 

Limited 

✓ 

Real-Time Analytics 

✓ 

✓ 

Limited 

Limited 

✗ 

✓ 

Arabic Language Support 

Limited 

Limited 

Limited 

Limited 

✓ 

✓ 

Cost-Effective 

✗ 

✗ 

Moderate 

✓ 

Varies 

✓ 

Modern Technology Stack 

Moderate 

Moderate 

✓ 

✗ 

✗ 

✓ 

 

 

 

 

 

 

Chapter 3 

System Analysis and Design 

 

 

 

 

 

In this chapter, we provide detailed knowledge about our system including functional requirements, non-functional requirements, user requirements, system architecture, use case, and sequence diagrams. We can divide the process of analysis into three parts: 

Determining requirements 

Determining system architecture 

Determining development methodology 

At the end of this chapter, we provide information about the tools and languages needed to build our system. 

 

3.1 System Requirements 

System requirements form the foundation of any software development project, defining: 

Functional requirements – what the system must do. 

Non-functional requirements – how well the system performs. 

User requirements – what different users need from the system. 

These requirements are derived from extensive analysis of stakeholder needs, existing system limitations, and best practices in educational technology. The specification process involved consultations with university administrators, faculty members, students, and IT staff to ensure that the system addresses real-world needs and challenges. 

The requirements are organized into three categories: functional, non-functional, and user requirements. This ensures the system is both functionally complete and high quality. 

 

 

 

 

3.1.1 Non-Functional Requirements 

Non-functional requirements define the quality attributes, constraints, and performance characteristics of the system. They ensure the system performs its functions reliably, efficiently, and securely. 

Table 3.1: Non-Functional Requirements 

 

Non-Functional Requirement 

Description 

Performance 

Seamless system interactions, fast data retrieval, and optimized performance for large datasets (3,500+ students, 10,000+ attendance records). Response time < 3 seconds. 

Scalability 

Handle large numbers of users and allow easy addition of new faculties, departments, programs, and courses without extensive rework. Support hundreds to thousands of concurrent users. 

Usability 

Intuitive interface, easy navigation for diverse users, smooth experience across devices, max 2–3 clicks to reach any content. 

Security 

Strong security protocols, role-based access, protection of sensitive student information and financial data. 

Compatibility 

Work across devices (desktop, tablet, mobile) and modern browsers (Chrome, Firefox, Safari, Edge). 

Reliability 

High availability, minimal downtime, robust backend operations. System uptime 99.9%. 

Maintainability 

Evolvable, scalable, testable, maintainable. Clean code, exception handling. 

Data Integrity 

Secure database, regular backups, recovery mechanisms to prevent data loss. 

 

 

 

 

 

 

 

 

3.1.2 Functional Requirements 

Functional requirements specify system services and behavior, organized by user role. 

Table 3.2: Admin Functional Requirements 

Admin Functional Requirement 

Description 

Admin User Authentication and Access Control 

Login using credentials (username/email and password), role-based access for super or faculty administrators. 

User Management 

Create and manage administrator accounts, assign roles, manage permissions, monitor activities. 

Student Data Management 

Manage student profiles including personal info, academic records, financial status, old and new regulations. 

Advanced Search and Filtering 

Search students by multiple criteria (name, ID, faculty, GPA, regulation type). Combine multiple filters. 

Attendance Tracking and Management 

Record student attendance for lectures, sections, labs. Auto-calculate rates and identify at-risk students. 

Attendance Reports 

Generate individual and course attendance reports; exportable in multiple formats. 

Academic Structure Management 

Define faculties, departments, programs, courses, regulations. Support prerequisites, credit requirements. 

Academic Registration Management 

Manage enrollments, registration blocks, academic progression. Track registration workflows. 

Financial Management 

Track fees, payments, generate financial reports. Setup fees and collect payments. 

GPA Management 

Auto-calculate GPAs, modify if needed, view trends. 

Level Management 

Track student levels, progression, generate distribution reports. 

Report Generation 

Generate student lists, attendance summaries, academic performance, financial records. Export to Excel, PDF. 

Data Export 

Export data in Excel, CSV, PDF for external analysis. 

Bulk Operations 

Update multiple student records, generate batch reports, manage group enrollments. 

Academic Rules Management 

Define and manage rules for registration, attendance, grading, graduation. 

Dashboard and Analytics 

Real-time dashboards with statistics, charts, analytics. 

System Monitoring and Maintenance 

Data backups, system updates, configuration management, monitoring. 

 

Table 3.3: User Functional Requirements 

User Functional Requirement 

Description 

User Registration and Authentication 

Students create accounts and log in with credentials. System manages sessions. 

Password Recovery 

Reset password via verified email link. 

Dashboard Display 

Personalized dashboards showing academic info, attendance, financial status, notifications. 

View Academic Records 

Courses, grades, GPA, level, academic progress. 

View Attendance Records 

Attendance rates, absences, history. 

View Financial Status 

Fees, payments, account balances. 

View Academic Registration 

Enrolled courses, schedules, registration history. 

Data Tracking and History 

Historical records of academics, attendance, financial transactions. 

Feedback and Reviews 

Provide feedback on courses, services, system functionality. 

Customer Support and Help Resources 

Access help resources, documentation, and guides. 

 

3.2 User Requirements 

3.2.1 Super Administrators 

Manage entire university system across all faculties. 

Access and manage student data across faculties. 

Manage academic structures: faculties, departments, programs, courses, regulations. 

Generate university-wide reports on enrollment, attendance, academics, finances. 

Access system-wide dashboards and analytics. 

Manage user accounts for administrators and faculty. 

Perform system maintenance: backups, updates, configuration. 

 

3.2.2 Faculty Administrators 

Manage student data within their faculty. 

Record and monitor attendance; generate reports. 

Manage academic registration, enrollment approvals, registration blocks. 

Manage financial records: fees, payments, reporting. 

Access faculty-specific dashboards and analytics. 

Generate and export reports specific to faculty. 

Manage academic structures within faculty. 

Identify and manage at-risk students. 

 

3.2.3 Students 

Access personal academic info: grades, attendance, schedules, progress. 

View financial status and history. 

View academic registration info and schedules. 

Access attendance records and track attendance rates. 

View GPA, level, academic standing, graduation progress. 

View and download official academic documents. 

Personalized dashboards with key info and notifications. 

Access complete academic history including past courses, grades, achievements. 

 

3.3 Development Methodology 

After defining the system structure, we review functions, relationships, and sequence of executions. 

 

3.3.1 Use Case Diagram 

Graphical depiction of system interactions and users. 

Specifies events in the system and their flow. 

Does not describe how events are implemented. 

 

The DUMLIS use case diagram illustrates the interactions between three main actors (Super Administrator, Faculty Administrator, and Student) and the various functionalities of the system. Super Administrators have access to university-wide management functions including faculty management, system-wide reporting, and user account management. Faculty Administrators can manage student data, attendance, academic registrations, and financial records within their faculty. Students can access their personal academic information, view attendance records, and access academic reports. 

 

**Figure 2: Use Case Diagram** 

 

 

--- 

 

### 3.3.2 Sequence Diagrams 

 

Sequence diagrams show how users interact with the system during various operations. They explain the steps taken to perform specific tasks and how different system components interact to complete these operations. 

 

#### 3.3.2.1 Student Sequence Diagram 

 

The student sequence diagram, shown in Figure 3, demonstrates how students interact with the system to access their academic information, view attendance records, and retrieve personal data. 

 

**Figure 3: Student Sequence Diagram** 

 

 

 

#### 3.3.2.2 Faculty Administrator Sequence Diagram 

 

The faculty administrator sequence diagram, shown in Figure 4, shows how faculty administrators manage student data, record attendance, and generate reports within their faculty. 

 

**Figure 4: Faculty Administrator Sequence Diagram** 

 

 

 

#### 3.3.2.3 Advisor Sequence Diagram 

 

The advisor sequence diagram, shown in Figure 5, illustrates how academic advisors interact with the system to view student information, provide guidance, and manage student academic progress. 

 

**Figure 5: Advisor Sequence Diagram** 

 

 

 

#### 3.3.2.4 Administrator Sequence Diagram 

 

The administrator sequence diagram, shown in Figure 6, demonstrates how super administrators manage the entire system, including faculty management, system-wide reporting, and user account management. 

 

**Figure 6: Administrator Sequence Diagram** 

 

 

 

#### 3.3.2.5 Controller/System Sequence Diagram 

 

The controller sequence diagram, shown in Figure 7, shows the internal system operations and how different system components interact to process requests and manage data flow. 

 

**Figure 7: Controller Sequence Diagram** 

 

 

 

--- 

 

### 3.3.3 Data Flow Diagram (DFD) 

 

A Data Flow Diagram (DFD) is a graphical representation that illustrates the flow of data within a system and the processes that transform or manipulate that data. DFDs are widely used in system analysis and design to model the information flow and processes in a structured way. DFDs are divided into different types: (context diagram, DFD level 1, DFD level 2, etc.) 

 

#### 3.3.3.1 Context Diagram (DFD Level 0) 

 

Level 0 DFD, shown in Figure 8, is the highest level of abstraction in a DFD and is also known as a context diagram, which is the most basic data flow diagram. It provides a broad view that is easily digestible but offers little detail. Level 0 data flow diagram shows a single process node and its connections to external entities. 

 

The context diagram for DUMLIS shows the system's interactions with external entities including Super Administrators, Faculty Administrators, Students, and external systems such as email services for notifications and file systems for report generation. 

 

**Figure 8: Context Diagram** 

 

 

 

**Figure 9: DFD Level 0** 

 

 

 

#### 3.3.3.2 Data Flow Diagram (Level 1) 

 

A level 1 DFD, shown in Figure 10, is the second level in the hierarchy of DFDs and provides a more detailed view of the processes and data flows of a system than the level 0 DFD. It shows the highest-level processes and does not delve into the detailed subprocesses or data transformations within each process. They serve as a foundational diagram for understanding the system's overall structure and data flow at a high level. 

 

The processes identified in the level 0 DFD are decomposed into sub-processes, and the data flows are further broken down into more specific data items. This level of detail allows for a more thorough understanding of the system's operations and helps identify potential issues or inefficiencies. In general, the level 1 DFD provides more detailed information about the system's processes and data flows than the level 0 DFD, but it is still at a high enough level of abstraction to be useful for communication and analysis. 

 

**Figure 10: DFD Level 1** 

 

 

 

#### 3.3.3.3 Data Flow Diagram (Level 2) 

 

A level 2 DFD, shown in Figure 11, provides even more detailed decomposition of specific processes identified in level 1. This level focuses on detailed subprocesses within major system functions such as student registration management, attendance processing, or report generation. 

 

**Figure 11: DFD Level 2** 

 

 

 

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

 

 

 

--- 

 

### 3.3.5 Activity Diagrams 

 

An activity diagram describes how activities are coordinated to provide a service which can be at different levels of abstraction. Typically, an event needs to be achieved by some operations, particularly where the operation is intended to achieve several different things that require coordination, or how the events in a single use case relate to one another, in particular, use cases where activities may overlap and require coordination. It is also suitable for modeling how a collection of use cases coordinates to represent business workflows. 

 

#### 3.3.5.1 Student Activity Diagram 

 

The student activity diagram, shown in Figure 13, illustrates the workflow for student operations including accessing academic information, viewing attendance records, and retrieving personal data. 

 

**Figure 13: Student Activity Diagram** 

 

 

 

#### 3.3.5.2 Faculty Administrator Activity Diagram 

 

The faculty administrator activity diagram, shown in Figure 14, demonstrates the workflow for faculty administrators managing student data, recording attendance, and generating reports. 

 

**Figure 14: Faculty Administrator Activity Diagram** 

 

 

 

#### 3.3.5.3 Advisor Activity Diagram 

 

The advisor activity diagram, shown in Figure 15, shows the workflow for academic advisors providing guidance and managing student academic progress. 

 

**Figure 15: Advisor Activity Diagram** 

 

 

 

#### 3.3.5.4 Administrator Activity Diagram 

 

The administrator activity diagram, shown in Figure 16, illustrates the workflow for super administrators managing the entire system including faculty management and system-wide operations. 

 

**Figure 16: Administrator Activity Diagram** 

 

 

#### 3.3.5.5 Absence Warning Activity Diagram 

 

The absence warning activity diagram, shown in Figure 17, demonstrates the automated process for identifying students with excessive absences and generating academic warnings. 

 

**Figure 17: Absence Warning Activity Diagram** 

 

 

#### 3.3.5.6 Academic Warning Activity Diagram 

 

The academic warning activity diagram, shown in Figure 18, shows the process for identifying students with low GPAs and managing academic warning procedures. 

 

**Figure 18: Academic Warning Activity Diagram** 

 

 

 

--- 

 

3.3.6 System Architecture 

The DUMLIS system follows a modern web application architecture based on a three-tier architecture, separating the frontend, application logic, and data layers. This modular design enhances maintainability, scalability, and security, allowing the system to handle growth in users and data while ensuring robustness and flexibility. 

The architecture is informed by software engineering best practices including separation of concerns, single responsibility principle, and dependency inversion. Each layer has a clearly defined role, enabling independent development, testing, and maintenance. Design patterns, such as component-based architecture in the frontend and Repository pattern in the data layer, ensure code reusability, maintainability, and adaptability. 

 

3.3.6.1 Frontend Layer 

The frontend is built using React (v19), TypeScript (v5), and Tailwind CSS (v4), providing a responsive single-page application (SPA) that works seamlessly across desktop and mobile devices. 

Key Features: 

Component-based architecture: Reusable and testable UI components (buttons, tables, forms, dashboards) reduce code duplication and improve maintainability. 

Responsive design: Tailwind CSS ensures mobile-first layouts that adapt to multiple screen sizes and devices. 

Real-time updates: React state management (useState, useEffect, useContext) provides dynamic, interactive user interfaces with instant feedback. 

Role-based UI rendering: Interfaces adapt to user roles, showing only relevant features to super administrators, faculty administrators, and students. 

 

3.3.6.2 Data Management Layer 

The data management layer handles all interactions with the system’s data. It is designed using abstraction patterns and the Repository pattern, allowing the system to operate with different data sources without affecting other layers. 

Note: The system currently utilizes a Repository Pattern with in-memory data structures   for prototyping and testing purposes. This data accurately represents the database schema and system behavior. In production, the data layer can be seamlessly connected to a real database (e.g., PostgreSQL or MySQL) without major changes to the application logic. 

Key Responsibilities: 

Student data management: CRUD operations for student profiles, ensuring validation, integrity, and compliance with academic rules. 

Attendance tracking: Automatic calculation of attendance rates, identification of at-risk students, and generation of attendance reports. 

Academic structure management: Maintaining faculties, departments, programs, and courses with hierarchical and referential integrity. 

Financial management: Tracking fees, payments, permissions, and account balances, synchronized with academic data. 

Report generation and data export: Creation of detailed reports in PDF, Excel, or CSV formats for administrative and analytical purposes. 

Data validation and business rule enforcement: Ensures compliance with institutional policies before storing or processing any data. 

The data layer also includes caching mechanisms to improve performance and reduce load on the data source. 

 

3.3.6.3 Data Architecture 

Data Structure: Defined using TypeScript interfaces matching the ERD schema, providing type safety and documentation. 

Key Entities: Students, Courses, Attendance, Financial Records, Academic Structures, Users, Faculties, Departments, Programs. 

Data Relationships: Implemented using references and lookup functions, supporting one-to-many, many-to-many, and hierarchical relationships. 

Data Storage: Structured in-memory repositories containing comprehensive seed data representing realistic scenarios, including 3,500+ student records and 10,000+ attendance records. 

3.3.6.4 System Architecture Diagram 

 

 

 

 

Figure 19: System Architecture 

Presentation Layer: React frontend with responsive UI components. 

Application Logic Layer: React components and hooks handling business logic and calculations. 

Data Layer: Abstracted data repository implementing the Repository Pattern; currently utilizing in-memory data structures for rapid prototyping, with a decoupled design allowing seamless migration to a relational database. 

 

 

 

 

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

 

**Table 3.4: Technologies Used** 

Category 

Tools / Technologies 

Purpose 

Analysis & Design 

Use Case Diagram, Context Diagram, ERD Diagram, DFD Diagrams, Activity Diagrams, Sequence Diagrams 

System analysis and design documentation 

Diagram Editor 

Python (Matplotlib, Graphviz), Software Ideas Modeler 

Creating UML and system diagrams 

Frontend Development 

React 19, TypeScript 5, Tailwind CSS 4 

Building responsive user interface 

UI Components 

Lucide React (Icons), Recharts (Charts) 

User interface components and data visualization 

Build Tools 

Vite 6.2.0 

Fast build tool and development server 

Development Environment 

VS Code, Node.js 

Code editor and runtime environment 

Version Control 

Git, GitHub / GitLab 

Source code management and collaboration 

Data Management 

In-Memory Data / Repository Pattern 

Student data, attendance records, and academic structures stored in-memory using TypeScript data structures 

State Management 

React Hooks (useState, useEffect) 

Component-level state management for user interactions and data flow 

 

 

--- 

 

## 3.5 Summary 

 

In this chapter, we provide the reader with detailed knowledge about our system. Section 3.1 provides system requirements which are divided into functional and non-functional requirements. Section 3.2 provides user requirements which specify different specifications for different user types (super administrators, faculty administrators, and students). Section 3.3 provides development methodology which includes UML diagrams that show the details of how the system will function, including use case diagrams, sequence diagrams, data flow diagrams, entity relationship diagrams, and activity diagrams. Section 3.4 provides information about the technologies and tools used to build the system. 

 

The system analysis and design phase has established a solid foundation for the DUMLIS system, defining clear requirements, user needs, system architecture, and development approach. The comprehensive diagrams and documentation provide a clear roadmap for system implementation and ensure that all stakeholders have a shared understanding of the system's functionality and structure. 

 

--- 

 

 

 

 