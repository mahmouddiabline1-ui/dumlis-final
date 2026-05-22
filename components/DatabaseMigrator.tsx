import React, { useEffect, useState } from 'react';
import { 
  committeesApi, 
  studentRequirementsApi, 
  studentDocumentsApi, 
  activityLogsApi,
  facultiesApi
} from '../api';

/**
 * DatabaseMigrator
 * ────────────────
 * A background utility that runs once on startup.
 * It detects legacy localStorage data, pushes it to the FastAPI backend,
 * and then clears the local storage to ensure the DB is the single source of truth.
 */
const DatabaseMigrator: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    const migrate = async () => {
      // Check if migration is needed (if significant localStorage keys exist)
      const keys = Object.keys(localStorage);
      const hasLegacyData = keys.some(k => 
        k === 'committees' || 
        k.startsWith('student_affairs_requirements:') ||
        k.startsWith('student_affairs_documents:') ||
        k === 'student_affairs_activity'
      );

      if (!hasLegacyData) return;

      console.log("DatabaseMigrator: Legacy localStorage data detected. Starting migration...");
      setIsMigrating(true);

      try {
        // 1. Migrate Committees
        const rawCommittees = localStorage.getItem('committees');
        if (rawCommittees) {
          const committees = JSON.parse(rawCommittees);
          if (Array.isArray(committees)) {
            for (const com of committees) {
              try {
                // Simplified creation for migration
                await committeesApi.create({
                  name: com.name,
                  room_id: com.roomId || 'R101',
                  capacity: com.capacity || 50,
                  exam_date: com.examDate,
                  exam_time: com.examTime,
                  supervisor: com.supervisor,
                  status: com.status,
                  semester: 'الفصل الدراسي الأول 2023/2024'
                });
              } catch (e) {
                console.error("Migration failed for committee:", com.name, e);
              }
            }
          }
          localStorage.removeItem('committees');
        }

        // 2. Migrate Student Requirements
        for (const key of keys) {
          if (key.startsWith('student_affairs_requirements:')) {
            const studentId = key.split(':')[1];
            const rawReqs = localStorage.getItem(key);
            if (rawReqs) {
              const reqs = JSON.parse(rawReqs);
              // reqs is likely an object { photo: 'submitted', ... } or array
              if (typeof reqs === 'object') {
                const bulkData = Object.entries(reqs).map(([reqKey, status]) => ({
                  student_id: studentId,
                  requirement_key: reqKey,
                  status: (status === 'submitted' || status === 'verified') ? status : 'pending'
                }));
                if (bulkData.length > 0) {
                  await studentRequirementsApi.bulkCreate(bulkData as any);
                }
              }
            }
            localStorage.removeItem(key);
          }
        }

        // 3. Migrate Student Documents (Base64)
        for (const key of keys) {
          if (key.startsWith('student_affairs_documents:')) {
            const studentId = key.split(':')[1];
            const rawDocs = localStorage.getItem(key);
            if (rawDocs) {
              const docs = JSON.parse(rawDocs);
              if (Array.isArray(docs)) {
                for (const d of docs) {
                  await studentDocumentsApi.create({
                    student_id: studentId,
                    type: d.type,
                    title: d.title,
                    filename: d.filename,
                    mime_type: d.mimeType,
                    size: d.size,
                    data_url: d.dataUrl
                  });
                }
              }
            }
            localStorage.removeItem(key);
          }
        }

        // 4. Migrate Activity Logs
        const rawLogs = localStorage.getItem('student_affairs_activity');
        if (rawLogs) {
          const logs = JSON.parse(rawLogs);
          if (Array.isArray(logs)) {
            for (const log of logs) {
              await activityLogsApi.create({
                user_id: undefined, // Unknown legacy user
                entity_type: log.type || 'system',
                entity_id: log.studentId,
                action: log.action || 'Legacy Action',
                description: log.details || '',
              });
            }
          }
          localStorage.removeItem('student_affairs_activity');
        }
        
        // 5. Migrate Custom Faculties
        const rawCustomFaculties = localStorage.getItem('customFaculties');
        if (rawCustomFaculties) {
          const customFaculties = JSON.parse(rawCustomFaculties);
          if (Array.isArray(customFaculties)) {
            for (const f of customFaculties) {
              try {
                // Map to backend FacultyCreate schema
                await (facultiesApi as any).create({
                  id: f.id,
                  name: f.name,
                  code: f.id.toUpperCase(),
                  icon: f.icon,
                  color: f.color
                });
              } catch (e) {
                console.error("Migration failed for custom faculty:", f.name, e);
              }
            }
          }
          localStorage.removeItem('customFaculties');
        }

        console.log("DatabaseMigrator: Migration completed successfully. Local storage cleaned.");
      } catch (error) {
        console.error("DatabaseMigrator: Migration failed.", error);
      } finally {
        setIsMigrating(false);
      }
    };

    migrate();
  }, []);

  if (!isMigrating) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-primary-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-3 animate-pulse">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span className="text-sm font-medium">جاري مزامنة البيانات مع قاعدة البيانات...</span>
    </div>
  );
};

export default DatabaseMigrator;
