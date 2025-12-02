import React, { useEffect, useMemo, useState } from "react";
import "../css/studashboard.css";
import { LogOut, Bell, Settings } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
// import FlashMessage from "../components/FlashMessage";

function StudentDashboard() {
  // Expect Inertia props: user (object) or users (collection), enrollments (array), courses (array), attendances (array), marks (array)
  const props = usePage().props || {};
  const { user, users, enrollments = [], courses = [], attendances = [], marks = [], flash = [] } = props;

  // Determine current user object (the controller previously passed `users` collection)
  const currentUser = useMemo(() => {
    if (user) return user;
    if (Array.isArray(users) && users.length > 0) return users[0];
    // fallback to empty object
    return {};
  }, [user, users]);

  const [activeTab, setActiveTab] = useState("overview");
const [flasMsg, setFlasMsg] = useState(null);

useEffect(() => {
  if (flash.message) {
    setFlasMsg(flash.message);

    const timer = setTimeout(() => {
      setFlasMsg(null);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [flash.message]);

  // Derive enrollments for this student. If enrollments list is global, filter by student id.
  const studentEnrollments = useMemo(() => {
    if (!enrollments || enrollments.length === 0) {
      // try relations on user
      return (currentUser.enrollments && Array.isArray(currentUser.enrollments)) ? currentUser.enrollments : [];
    }
    const sid = currentUser.id;
    // if enrollments appear to belong only to this student, return all
    const looksGlobal = enrollments.some((e) => e.student_id || e.studentId || e.student);
    if (!looksGlobal) return enrollments;
    return enrollments.filter((e) => {
      if (!sid) return false;
      if (e.student_id) return e.student_id === sid;
      if (e.studentId) return e.studentId === sid;
      if (e.student && e.student.id) return e.student.id === sid;
      return false;
    });
  }, [enrollments, currentUser]);

  // Map enrollments to course objects (if course list provided)
  const enrolledCourses = useMemo(() => {
    return studentEnrollments.map((en) => {
      const courseFromList = courses.find((c) => c.id === (en.course_id || en.courseId || (en.course && en.course.id))) || en.course || null;
      return {
        enroll: en,
        course: courseFromList,
      };
    });
  }, [studentEnrollments, courses]);

  // Attendance records for this student
  const studentAttendances = useMemo(() => {
    if (!attendances || attendances.length === 0) return [];
    const sid = currentUser.id;
    return attendances.filter((a) => {
      if (!sid) return false;
      if (a.student_id) return a.student_id === sid;
      if (a.studentId) return a.studentId === sid;
      if (a.enroll_id && studentEnrollments.some((e) => e.id === a.enroll_id || e.enroll_id === a.enroll_id)) return true;
      return false;
    });
  }, [attendances, currentUser, studentEnrollments]);

  // Marks for this student (via enrollments)
  const studentMarks = useMemo(() => {
    if (!marks || marks.length === 0) return [];
    const enrollIds = studentEnrollments.map((e) => e.id || e.enroll_id);
    return marks.filter((m) => enrollIds.includes(m.enroll_id || m.enrollId || m.enrollId));
  }, [marks, studentEnrollments]);

  // Attendance summary
  const attendanceSummary = useMemo(() => {
    const summary = { P: 0, A: 0, L: 0, total: 0 };
    for (const a of studentAttendances) {
      const s = (a.status || a.status_code || '').toString().toUpperCase();
      if (s === 'P') summary.P++;
      else if (s === 'A') summary.A++;
      else if (s === 'L') summary.L++;
      summary.total++;
    }
    summary.percent = summary.total === 0 ? 0 : Math.round((summary.P / summary.total) * 100);
    return summary;
  }, [studentAttendances]);

  // Group marks by course for display
  const marksByCourse = useMemo(() => {
    const map = {};
    for (const m of studentMarks) {
      // attempt to resolve course id via enrollment
      const enrollId = m.enroll_id || m.enrollId || m.enrollId;
      const enroll = studentEnrollments.find((e) => (e.id || e.enroll_id) === enrollId) || {};
      const course = enroll.course || courses.find((c) => c.id === (m.course_id || m.courseId)) || null;
      const key = course ? course.id : enrollId || 'unknown';
      if (!map[key]) map[key] = { course, items: [] };
      map[key].items.push(m);
    }
    return map;
  }, [studentMarks, studentEnrollments, courses]);

  // Group attendances by course id for course-wise tables
  const attendancesByCourse = useMemo(() => {
    const map = {};
    // helper to resolve course id from attendance record
    const resolveCourseId = (a) => {
      if (!a) return null;
      if (a.course_id) return a.course_id;
      if (a.courseId) return a.courseId;
      if (a.course && a.course.id) return a.course.id;
      // fallback: try to find via enrollment on client side (studentEnrollments)
      if (a.enroll_id) {
        const en = studentEnrollments.find((e) => (e.id || e.enroll_id) === a.enroll_id);
        if (en) return en.course_id || (en.course && en.course.id) || null;
      }
      return null;
    };

    for (const a of studentAttendances) {
      const cid = resolveCourseId(a) || 'unknown';
      if (!map[cid]) map[cid] = [];
      map[cid].push(a);
    }

    // sort each group's records by date descending
    Object.keys(map).forEach((k) => {
      map[k].sort((x, y) => {
        const dx = new Date(x.date || x.att_date || x.created_at || x.created_at || 0).getTime();
        const dy = new Date(y.date || y.att_date || y.created_at || y.created_at || 0).getTime();
        return dy - dx;
      });
    });

    return map;
  }, [studentAttendances, studentEnrollments]);

  // Per-course attendance summary and low-attendance warnings
  const courseAttendanceSummary = useMemo(() => {
    const summary = {};
    // For every enrolled course, compute percentage using attendancesByCourse
    enrolledCourses.forEach(({ enroll, course }) => {
      const cid = (course && course.id) || enroll.course_id || 'unknown';
      const records = attendancesByCourse[cid] || [];
      const total = records.length;
      const present = records.reduce((acc, r) => {
        const s = (r.status || r.status_code || '').toString().toUpperCase();
        return acc + (s === 'P' ? 1 : 0);
      }, 0);
      const percent = total === 0 ? 0 : Math.round((present / total) * 100);
      summary[cid] = {
        course: course || {},
        enroll,
        total,
        present,
        percent,
      };
    });
    return summary;
  }, [enrolledCourses, attendancesByCourse]);

  // Warnings list for courses below threshold (only when there are attendance records)
  const lowAttendanceWarnings = useMemo(() => {
    const items = [];
    const THRESHOLD = 80;
    Object.keys(courseAttendanceSummary).forEach((cid) => {
      const s = courseAttendanceSummary[cid];
      // Only warn when some attendance data exists for the course
      if (s && s.total > 0 && s.percent < THRESHOLD) {
        const cname = (s.course && (s.course.name || s.course.title)) || s.enroll.course_title || 'Course';
        items.push({ cid, courseName: cname, percent: s.percent });
      }
    });
    return items;
  }, [courseAttendanceSummary]);

  const statusLabel = (s) => {
    const st = (s || '').toString().toUpperCase();
    if (st === 'P') return 'Present';
    if (st === 'A') return 'Absent';
    if (st === 'L') return 'Sick Leave';
    if (st === 'H' || st === 'HOLIDAY') return 'Holiday';
    return st || '-';
  };

  // UI renderers
  const renderOverview = () => (
    <div className="overview-full">
      <section className="stats-section">
        <div className="stat-card">
          <div className="stat-header"><h3>Enrolled Courses</h3></div>
          <p className="stat-value">{enrolledCourses.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header"><h3>Attendance</h3></div>
          <p className="stat-value">{attendanceSummary.percent}%</p>
          <small className="muted">{attendanceSummary.P} present • {attendanceSummary.A} absent • {attendanceSummary.L} leave</small>
        </div>

        <div className="stat-card">
          <div className="stat-header"><h3>Assessments</h3></div>
          <p className="stat-value">{studentMarks.length}</p>
        </div>

        <div className="stat-card">
          <div className="stat-header"><h3>Profile</h3></div>
          <p className="stat-value">{currentUser.name || currentUser.username || '-'}</p>
          <small className="muted">{currentUser.email || 'No email'}</small>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-container performance-chart">
          <h3 className="chart-title">Overall Performance</h3>
          <div className="performance-metric">
            <div className="metric-label">Average Grade</div>
          </div>
          <div className="circular-progress">
            <svg viewBox="0 0 120 120" className="progress-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e0e0e0" strokeWidth="8" />
            </svg>
            <div className="progress-text">GPA</div>
            <div className="progress-value">{currentUser.gpa ?? 'N/A'}</div>
          </div>
        </div>

        <div className="chart-container hours-chart">
          <h3 className="chart-title">Enrolled Courses</h3>
          <div className="courses-grid small">
            {enrolledCourses.length === 0 && <div className="muted">No enrolled courses found.</div>}
            {enrolledCourses.map(({ enroll, course }) => (
              <div key={enroll.id || enroll.enroll_id || (course && course.id) || Math.random()} className="course-card small">
                <div className="course-header">
                  <h4>{(course && course.name) || enroll.course_title || 'Course'}</h4>
                  <span className={`course-status ${(enroll.status || course?.status || '').toString().toLowerCase() === 'completed' ? 'completed' : 'in-progress'}`}>
                    {(enroll.status && enroll.status) || (course && course.status) || 'In Progress'}
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(enroll.progress || course?.progress || 0)}%` }} />
                  </div>
                  <span className="progress-text">{enroll.progress ?? course?.progress ?? 0}%</span>
                </div>
                <Link href={`/courses/${(course && course.id) || ''}`} className="btn-secondary">View</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderCourses = () => (
    <section className="section-content">
      <div className="section-header">
        <h2>Courses</h2>
      </div>
      <div className="courses-grid">
        {enrolledCourses.length === 0 && <div className="muted">You are not enrolled in any courses.</div>}
        {enrolledCourses.map(({ enroll, course }) => (
          <div key={enroll.id || enroll.enroll_id || (course && course.id)} className="course-card">
            <div className="course-header">
              <h3>{(course && course.name) || enroll.course_title || 'Course'}</h3>
              <span className={`course-status ${(enroll.status || '').toString().toLowerCase() === 'completed' ? 'completed' : 'in-progress'}`}>
                {(enroll.status && enroll.status) || (course && course.status) || 'In Progress'}
              </span>
            </div>
            <p className="course-instructor">Instructor: {(course && course.teacher_name) || course?.teacher || 'TBD'}</p>
            <p className="course-credits">Credits: {(course && course.credits) ?? '-'}</p>

            

            <div className="course-actions">
              <Link className="btn-primary" href={`/courses/${course?.id || ''}`}>Open</Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderAttendance = () => (
    <section className="section-content">
      <div className="section-header"><h2>Attendance</h2></div>
      <div className="attendance-stats">
        <div className="stat-box"><div className="stat-value" style={{ color: '#22c55e' }}>{attendanceSummary.percent}%</div><div className="stat-label">Total Attendance</div></div>
        <div className="stat-box"><div className="stat-value" style={{ color: '#22c55e' }}>{attendanceSummary.P}</div><div className="stat-label">Present</div></div>
        <div className="stat-box"><div className="stat-value" style={{ color: '#ef4444' }}>{attendanceSummary.L}</div><div className="stat-label">Sick Leave</div></div>
        <div className="stat-box"><div className="stat-value" style={{ color: '#ef4444' }}>{attendanceSummary.A}</div><div className="stat-label">Absent</div></div>
      </div>

      <div className="bottom-section" style={{ paddingTop: 20 }}>
        {enrolledCourses.length === 0 && <div className="muted">No enrolled courses to show attendance for.</div>}

        {enrolledCourses.map(({ enroll, course }) => {
          const cid = (course && course.id) || enroll.course_id || 'unknown';
          const records = attendancesByCourse[cid] || [];
          return (
            <div key={cid} className="section-content" style={{ margin: 0 }}>
              <div className="section-header">
                <h3 style={{ margin: 0 }}>{(course && course.name) || enroll.course_title || 'Course'}</h3>
                <div className="stat-label">{(course && course.credits) ? `${course.credits} credits` : ''}</div>
              </div>

              <div className="assessments-table-wrapper">
                <table className="assessments-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 && (
                      <tr><td colSpan={2} className="muted">No attendance records for this course.</td></tr>
                    )}
                    {records.map((r) => (
                      <tr key={r.id || `${r.enroll_id}-${r.date || r.att_date || r.created_at}`}>
                        <td>{new Date(r.date || r.att_date || r.created_at).toLocaleDateString()}</td>
                        <td><span className={`status-badge`} style={{ backgroundColor: r.status === 'P' ? '#22c55e' : '#ef4444' }}>{statusLabel(r.status)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderMarks = () => (
    <section className="section-content">
      <div className="section-header"><h2>Marks & Assessments</h2></div>
      <div className="assessments-table-wrapper">
        <table className="assessments-table">
          <thead>
            <tr>
              <th>Assessment</th>
              <th>Course</th>
              <th>Type</th>
              <th>Obtained</th>
              <th>Total</th>
              <th>%</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {studentMarks.length === 0 && (
              <tr><td colSpan={7} className="muted">No marks available.</td></tr>
            )}
            {studentMarks.map((m) => {
              const enroll = studentEnrollments.find((e) => (e.id || e.enroll_id) === m.enroll_id) || {};
              const course = enroll.course || courses.find((c) => c.id === (m.course_id || m.courseId)) || {};
              const percent = m.total_marks ? Math.round((m.obtained_marks / m.total_marks) * 100) : 0;
              const grade = m.grade || (percent >= 90 ? 'A+' : percent >= 80 ? 'A' : percent >= 70 ? 'B' : percent >= 60 ? 'C' : 'D');
              return (
                <tr key={m.id || `${m.enroll_id}-${m.type}-${m.marked_by || ''}`}>
                  <td className="bold">{m.title || m.type || 'Assessment'}</td>
                  <td>{course.name || enroll.course_title || '-'}</td>
                  <td><span className="badge-type">{m.type}</span></td>
                  <td>{m.obtained_marks ?? m.obtained ?? '-'}</td>
                  <td>{m.total_marks ?? m.total ?? '-'}</td>
                  <td className="bold">{percent}%</td>
                  <td><span className={`grade-badge grade-${String(grade).toLowerCase().replace('+','plus')}`}>{grade}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );

  // Results tab: show subject-wise assessments and aggregated result per subject
  const renderResults = () => (
    <section className="section-content">
      <div className="section-header"><h2>Results</h2></div>

      {enrolledCourses.length === 0 && <div className="muted">No enrolled courses to show results for.</div>}

      {enrolledCourses.map(({ enroll, course }) => {
        const cid = (course && course.id) || enroll.course_id || 'unknown';
        const key = cid;
        const group = marksByCourse[key] || marksByCourse[enroll.id] || { items: [] };
        const items = Array.isArray(group.items) ? group.items : [];

        // compute aggregated sums
        let sumObtained = 0;
        let sumTotal = 0;
        for (const m of items) {
          const obtained = Number(m.obtained_marks ?? m.obtained ?? 0) || 0;
          const total = Number(m.total_marks ?? m.total ?? 0) || 0;
          // only add when numbers are meaningful
          sumObtained += obtained;
          sumTotal += total;
        }
        const aggPercent = sumTotal > 0 ? Math.round((sumObtained / sumTotal) * 100) : null;

        return (
          <div key={key} className="subject-results" style={{ marginBottom: 24 }}>
            <div className="section-header">
              <h3 style={{ margin: 0 }}>{(course && (course.name || course.title)) || enroll.course_title || 'Course'}</h3>
              <div className="stat-label">{(course && course.credits) ? `${course.credits} credits` : ''}</div>
            </div>

            <div className="assessments-table-wrapper">
              <table className="assessments-table">
                <thead>
                  <tr>
                    <th>Assessment</th>
                    <th>Type</th>
                    <th>Obtained</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr><td colSpan={5} className="muted">No assessments recorded for this subject.</td></tr>
                  )}
                  {items.map((m) => {
                    const obtained = Number(m.obtained_marks ?? m.obtained ?? 0) || 0;
                    const total = Number(m.total_marks ?? m.total ?? 0) || 0;
                    const percent = total > 0 ? Math.round((obtained / total) * 100) : '—';
                    return (
                      <tr key={m.id || `${m.enroll_id}-${m.type}-${m.title || ''}`}>
                        <td className="bold">{m.title || m.type || 'Assessment'}</td>
                        <td><span className="badge-type">{m.type || '-'}</span></td>
                        <td>{m.obtained_marks ?? m.obtained ?? '-'}</td>
                        <td>{m.total_marks ?? m.total ?? '-'}</td>
                        <td className="bold">{percent}{percent !== '—' ? '%' : ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
                {items.length > 0 && (
                  <tfoot>
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'right', paddingRight: 12 }} className="bold">Subject Total:</td>
                      <td className="bold">{sumObtained}</td>
                      <td className="bold">{sumTotal}</td>
                      <td className="bold">{aggPercent !== null ? `${aggPercent}%` : '—'}</td>
                    </tr>
                    <tr>
                      <td colSpan={5} style={{ paddingTop: 8 }}>
                        <div className="result-description muted">Result Description: This subject aggregates all assessments. Obtained {sumObtained} out of {sumTotal}{sumTotal > 0 ? `, Final ${aggPercent}%` : ''}.</div>
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        );
      })}
    </section>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'courses': return renderCourses();
      case 'attendance': return renderAttendance();
      case 'marks': return renderMarks();
      case 'results': return renderResults();
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box"><span className="logo-dot" /></div>
          <span className="logo-text">Student LMS</span>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Overview</span>
          </button>
          <button className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>
            <span className="nav-icon">📚</span>
            <span className="nav-text">Courses</span>
          </button>
          <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            <span className="nav-icon">📋</span>
            <span className="nav-text">Attendance</span>
          </button>
          <button className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}>
            <span className="nav-icon">✏</span>
            <span className="nav-text">Marks</span>
          </button>
          <button className={`nav-item ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
            <span className="nav-icon">🧾</span>
            <span className="nav-text">Results</span>
          </button>
        </nav>

        <Link href="/logout" className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </Link>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left"><h1>STUDENT DASHBOARD</h1></div>
          <div className="header-center">
            <div className="search-box">
              <input type="text" placeholder="Search courses..." className="search-input" />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          <div className="header-right">
            <button className="icon-btn notification-btn"><Bell size={18} /><span className="notification-badge">{props.unreadNotifications ?? 0}</span></button>
            <button className="icon-btn settings-btn"><Settings size={18} /></button>
          </div>
          {flasMsg && (
  <div 
    className="position-fixed top-0 end-0 p-3" 
    style={{ zIndex: 9999 }}
  >
    <div 
      className="alert alert-info alert-dismissible fade show shadow" 
      role="alert"
    >
      {flasMsg}

      <button 
        type="button" 
        className="btn-close" 
        data-bs-dismiss="alert" 
        aria-label="Close"
      ></button>
    </div>
  </div>
)}
        </header>

  {/* Flash message from server (auto-fades) */}
  

  {/* Inline styles for the low-attendance flash warnings */}
        <style>{`
          .low-attendance-wrap { margin: 12px 20px; }
          .low-attendance-alert { background: #fff5f5; border: 1px solid #fca5a5; color: #991b1b; padding: 12px 14px; border-radius: 6px; display:flex; align-items:center; gap:12px; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
          .low-attention-icon { display:inline-block; width:18px; height:18px; background:#ef4444; border-radius:50%; color:white; font-weight:bold; text-align:center; line-height:18px; }
          .blink { animation: blinkAnim 1s linear infinite; }
          @keyframes blinkAnim { 0% { opacity:1 } 50% { opacity:0.25 } 100% { opacity:1 } }
          .low-attendance-list { display:flex; flex-direction:column; gap:8px; }
          .low-attendance-course { font-weight:600; }
        `}</style>

        {/* Flash warnings for low attendance per course (appear immediately) */}
        {lowAttendanceWarnings && lowAttendanceWarnings.length > 0 && (
          <div className="low-attendance-wrap">
            <div className="low-attendance-alert" role="alert" aria-live="assertive">
              <div className="low-attention-icon blink">!</div>
              <div className="low-attendance-list">
                {lowAttendanceWarnings.map((w) => (
                  <div key={w.cid}>
                    <div className="low-attendance-course">Low Attendance Alert: Your attendance in {w.courseName} is below 80% ({w.percent}%).</div>
                    <div>Please attend more classes to avoid penalties.</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {renderTabContent()}
      </main>
    </div>
  );
}

export default StudentDashboard;