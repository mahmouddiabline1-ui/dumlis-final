// src/__tests__/FacultyAnalytics.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import FacultyAnalytics from "../components/FacultyAnalytics";
import { BrowserRouter } from "react-router-dom";

// Mock API responses
const server = setupServer(
  rest.get("/api/activity-logs", (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, faculty_id: "FCAI", category: "students", description: "Student created" },
        { id: 2, faculty_id: "FCAI", category: "fees", description: "Fee paid" },
        { id: 3, faculty_id: "FCAI", category: "students", description: "Student updated" },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders faculty analytics with correct counts", async () => {
  render(
    <BrowserRouter>
      <FacultyAnalytics facultyId="FCAI" />
    </BrowserRouter>
  );

  // Loading state
  expect(screen.getByText(/جاري تحميل الإحصائيات.../i)).toBeInTheDocument();

  // Wait for data to load
  await waitFor(() => {
    // Sidebar shows categories with counts
    const studentsItem = screen.getByText(/students/i);
    expect(studentsItem).toBeInTheDocument();
    const feesItem = screen.getByText(/fees/i);
    expect(feesItem).toBeInTheDocument();
  });

  // Verify that the activities list contains the mocked entries
  expect(screen.getByText(/Student created/i)).toBeInTheDocument();
  expect(screen.getByText(/Fee paid/i)).toBeInTheDocument();
});
