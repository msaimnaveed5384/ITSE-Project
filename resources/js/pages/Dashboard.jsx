import React, { useState } from "react";
import "../css/dashboard.css";
import {
  BookOpen,
  BarChart3,
  Clock,
  Award,
  LogOut,
  Bell,
  Settings,
  Edit2,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

function StudentDashboard() {
  const { users } = usePage().props;

  const [activeTab, setActiveTab] = useState("overview");
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 10)); // November 2023

  // Attendance data for November 2023
  const attendanceData = {
    1: "present",
    2: "present",
    3: "present",
    4: "present",
    5: "holiday",
    6: "present",
    7: "present",
    8: "present",
    9: "sick_leave",
    10: "sick_leave",
    11: "present",
    12: "holiday",
    13: "present",
    14: "present",
    15: "absent",
    16: "present",
    17: "present",
    18: "present",
    19: "holiday",
    20: "present",
    21: "present",
    22: "present",
    23: "absent",
    24: "present",
    25: "present",
    26: "holiday",
    27: "present",
    28: "present",
    29: "present",
    30: "present",
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "#22c55e"; // green
      case "sick_leave":
        return "#ef4444"; // red
      case "absent":
        return "#ef4444"; // red
      case "holiday":
        return "#eab308"; // yellow
      default:
        return "#f3f4f6"; // gray
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "present":
        return "Present";
      case "sick_leave":
        return "Sick leave";
      case "absent":
        return "Absent";
      case "holiday":
        return "Holiday";
      default:
        return "";
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="overview-full">
            {/* Stats Section */}
            <section className="stats-section">
              <div className="stat-card">
                <div className="stat-header">
                  <h3>Total Enrolled</h3>
                  <button className="stat-menu">⚙</button>
                </div>
                <p className="stat-value">6</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Completed</h3>
                  <button className="stat-menu">⚙</button>
                </div>
                <p className="stat-value">1</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>GPA</h3>
                  <button className="stat-menu">⚙</button>
                </div>
                <p className="stat-value">3.8</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <h3>Attendance</h3>
                  <button className="stat-menu">⚙</button>
                </div>
                <p className="stat-value">92%</p>
              </div>
            </section>

            {/* Charts Section */}
            <section className="charts-section">
              <div className="chart-container hours-chart">
                <h3 className="chart-title">Hours Spent This Month</h3>
                <div className="bar-chart">
                  <div className="bar-item">
                    <div className="bar bar-teal" style={{ height: "40%" }}></div>
                    <span className="bar-label">Week 1</span>
                  </div>
                  <div className="bar-item">
                    <div className="bar bar-teal" style={{ height: "60%" }}></div>
                    <span className="bar-label">Week 2</span>
                  </div>
                  <div className="bar-item">
                    <div className="bar bar-teal" style={{ height: "50%" }}></div>
                    <span className="bar-label">Week 3</span>
                  </div>
                  <div className="bar-item">
                    <div className="bar bar-teal" style={{ height: "70%" }}></div>
                    <span className="bar-label">Week 4</span>
                  </div>
                </div>
              </div>

              <div className="chart-container performance-chart">
                <h3 className="chart-title">Overall Performance</h3>
                <div className="performance-metric">
                  <div className="metric-label">Average Grade</div>
                </div>
                <div className="circular-progress">
                  <svg viewBox="0 0 120 120" className="progress-svg">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#e0e0e0"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray="235.5 314"
                      transform="rotate(-90 60 60)"
                    />
                    <circle cx="60" cy="60" r="8" fill="#22c55e" />
                  </svg>
                  <div className="progress-text">Grade Point:</div>
                  <div className="progress-value">3.8/4.0</div>
                </div>
              </div>
            </section>

            {/* Upcoming Deadlines */}
            <section className="upcoming-section">
              <h3 className="section-title">Upcoming Deadlines</h3>
              <div className="deadlines-list">
                <div className="deadline-item">
                  <div className="deadline-date">Dec 5</div>
                  <div className="deadline-info">
                    <h4>JavaScript Project Submission</h4>
                    <p>Web Development Course</p>
                  </div>
                  <span className="deadline-priority high">High</span>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">Dec 10</div>
                  <div className="deadline-info">
                    <h4>Data Structures Assignment</h4>
                    <p>Data Structures Course</p>
                  </div>
                  <span className="deadline-priority medium">Medium</span>
                </div>
                <div className="deadline-item">
                  <div className="deadline-date">Dec 15</div>
                  <div className="deadline-info">
                    <h4>Mobile App Midterm Exam</h4>
                    <p>Mobile Development Course</p>
                  </div>
                  <span className="deadline-priority high">High</span>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="recent-activity-section">
              <h3 className="section-title">Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-content">
                    <h4>Quiz 3 Graded</h4>
                    <p>JavaScript - Score: 18/20 (90%)</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <h4>New Assignment Posted</h4>
                    <p>Database Design - Assignment 5</p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">✅</div>
                  <div className="activity-content">
                    <h4>Assignment Submitted</h4>
                    <p>Web Development - Project 1</p>
                    <span className="activity-time">3 days ago</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        );
      
      case "courses":
        return (
          <section className="section-content">
            <div className="section-header">
              <h2>Courses</h2>
              <button className="btn-primary">Enroll New Course</button>
            </div>

            <div className="courses-grid">
              {[
                { id: 1, name: "Introduction to JavaScript", instructor: "Dr. Ahmed Hassan", progress: 75, credits: 3, status: "In Progress" },
                { id: 2, name: "Web Development Basics", instructor: "Prof. Sarah Khan", progress: 90, credits: 4, status: "In Progress" },
                { id: 3, name: "Data Structures", instructor: "Dr. Ali Mohamed", progress: 60, credits: 3, status: "In Progress" },
                { id: 4, name: "Database Design", instructor: "Prof. Fatima Al-Mansouri", progress: 100, credits: 4, status: "Completed" },
                { id: 5, name: "Mobile Development", instructor: "Dr. Hassan Ibrahim", progress: 45, credits: 3, status: "In Progress" },
                { id: 6, name: "Cloud Computing", instructor: "Prof. Zainab Ali", progress: 30, credits: 4, status: "In Progress" },
              ].map((course) => (
                <div key={course.id} className="course-card">
                  <div className="course-header">
                    <h3>{course.name}</h3>
                    <span className={`course-status ${course.status === "Completed" ? "completed" : "in-progress"}`}>
                      {course.status}
                    </span>
                  </div>
                  <p className="course-instructor">Instructor: {course.instructor}</p>
                  <p className="course-credits">Credits: {course.credits}</p>
                  
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{course.progress}%</span>
                  </div>

                  <button className="btn-secondary">View Details</button>
                </div>
              ))}
            </div>
          </section>
        );
      
      case "attendance":
        return (
          <section className="section-content">
            <div className="section-header">
              <h2>Attendance</h2>
            </div>

            <div className="attendance-stats">
              <div className="stat-box">
                <div className="stat-value" style={{ color: "#22c55e" }}>92%</div>
                <div className="stat-label">Total Attendance</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: "#22c55e" }}>92 Days</div>
                <div className="stat-label">Present</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: "#ef4444" }}>5 Days</div>
                <div className="stat-label">Sick Leave</div>
              </div>
              <div className="stat-box">
                <div className="stat-value" style={{ color: "#ef4444" }}>3 Days</div>
                <div className="stat-label">Absent</div>
              </div>
            </div>

            <div className="calendar-section-large">
              <h3>Monthly Attendance View</h3>
              <div className="calendar-wrapper">
                <div className="calendar-controls">
                  <button 
                    className="calendar-nav-btn"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="calendar-month-label">{monthName}</span>
                  <button 
                    className="calendar-nav-btn"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="calendar-grid-large">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
                    (day) => (
                      <div key={day} className="calendar-day-header">
                        {day}
                      </div>
                    )
                  )}

                  {Array.from({ length: getDaysInMonth(currentMonth) }).map((_, index) => {
                    const day = index + 1;
                    const status = attendanceData[day];

                    return (
                      <div key={day} className="calendar-date-cell">
                        <div className="date-number">{day}</div>
                        {status && (
                          <div 
                            className="status-badge"
                            style={{ backgroundColor: getStatusColor(status) }}
                            title={getStatusLabel(status)}
                          >
                            {getStatusLabel(status)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        );
      
      case "marks":
        return (
          <section className="section-content">
            <div className="section-header">
              <h2>Marks & Assessments</h2>
            </div>

            <div className="assessments-table-wrapper">
              <table className="assessments-table">
                <thead>
                  <tr>
                    <th>Assessment Title</th>
                    <th>Course</th>
                    <th>Type</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, title: "Midterm Exam", course: "JavaScript", type: "Exam", obtained: 85, total: 100, percentage: 85, grade: "A", status: "Graded" },
                    { id: 2, title: "Assignment 1", course: "Web Dev", type: "Assignment", obtained: 45, total: 50, percentage: 90, grade: "A+", status: "Graded" },
                    { id: 3, title: "Project 1", course: "Data Structures", type: "Project", obtained: 38, total: 50, percentage: 76, grade: "B", status: "Graded" },
                    { id: 4, title: "Quiz 3", course: "JavaScript", type: "Quiz", obtained: 18, total: 20, percentage: 90, grade: "A+", status: "Graded" },
                    { id: 5, title: "Final Project", course: "Mobile Dev", type: "Project", obtained: 0, total: 100, percentage: 0, grade: "-", status: "Pending" },
                    { id: 6, title: "Database Assignment", course: "Database Design", type: "Assignment", obtained: 48, total: 50, percentage: 96, grade: "A+", status: "Graded" },
                  ].map((assessment) => (
                    <tr key={assessment.id} className={assessment.status === "Pending" ? "pending-row" : ""}>
                      <td className="bold">{assessment.title}</td>
                      <td>{assessment.course}</td>
                      <td><span className="badge-type">{assessment.type}</span></td>
                      <td>{assessment.obtained}</td>
                      <td>{assessment.total}</td>
                      <td className="bold">{assessment.percentage}%</td>
                      <td>
                        <span className={`grade-badge grade-${assessment.grade.toLowerCase()}`}>
                          {assessment.grade}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${assessment.status.toLowerCase()}`}>
                          {assessment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      
      case "certification":
        return (
          <section className="section-content">
            <div className="section-header">
              <h2>Certifications</h2>
            </div>

            <div className="certifications-grid">
              {[
                { id: 1, title: "JavaScript Fundamentals Certificate", issuer: "FreeCodeCamp", date: "2024-06-15", status: "Earned" },
                { id: 2, title: "Web Development Professional", issuer: "Coursera", date: "2024-08-20", status: "Earned" },
                { id: 3, title: "Data Structures Mastery", issuer: "Udemy", date: "2024-09-10", status: "Earned" },
                { id: 4, title: "Cloud Computing Fundamentals", issuer: "AWS Academy", date: "2025-01-15", status: "In Progress" },
                { id: 5, title: "Mobile App Development", issuer: "Google", date: "", status: "Not Started" },
                { id: 6, title: "Full Stack Developer", issuer: "LinkedIn Learning", date: "", status: "Not Started" },
              ].map((cert) => (
                <div key={cert.id} className="certification-card">
                  <div className="cert-icon">
                    <Award size={40} />
                  </div>
                  <h3>{cert.title}</h3>
                  <p className="cert-issuer">Issued by: {cert.issuer}</p>
                  {cert.date && <p className="cert-date">Date Earned: {cert.date}</p>}
                  
                  <div className={`cert-status ${cert.status === "Earned" ? "earned" : cert.status === "In Progress" ? "in-progress" : "not-started"}`}>
                    {cert.status}
                  </div>

                  {cert.status === "Earned" && (
                    <div className="cert-actions">
                      <button className="btn-secondary">View Certificate</button>
                      <button className="btn-secondary">Download</button>
                    </div>
                  )}
                  {cert.status === "In Progress" && (
                    <button className="btn-secondary">Continue Learning</button>
                  )}
                  {cert.status === "Not Started" && (
                    <button className="btn-primary">Enroll Now</button>
                  )}
                </div>
              ))}
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box">
            <span className="logo-dot"></span>
          </div>
          <span className="logo-text">Student LMS Project</span>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Overview</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "courses" ? "active" : ""}`}
            onClick={() => setActiveTab("courses")}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Courses</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "attendance" ? "active" : ""}`}
            onClick={() => setActiveTab("attendance")}
          >
            <span className="nav-icon">📋</span>
            <span className="nav-text">Attendance</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "marks" ? "active" : ""}`}
            onClick={() => setActiveTab("marks")}
          >
            <span className="nav-icon">✏</span>
            <span className="nav-text">Marks/ Assessments</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === "certification" ? "active" : ""}`}
            onClick={() => setActiveTab("certification")}
          >
            <span className="nav-icon">🏆</span>
            <span className="nav-text">Certification</span>
          </button>
        </nav>

        <button className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>STUDENT DASHBOARD</h1>
          </div>
          <div className="header-center">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search from courses..."
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn notification-btn">
              <Bell size={20} />
              <span className="notification-badge">1</span>
            </button>
            <button className="icon-btn settings-btn">
              <Settings size={20} />
            </button>
          </div>
        </header>
        
        {/* Tab Content */}
        {renderTabContent()}
      </main>
    </div>
  );
}

export default StudentDashboard;