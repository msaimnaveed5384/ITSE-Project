import React, { useState } from 'react';
import { Link, usePage, Inertia } from '@inertiajs/react';
import '../css/dashboard.css';
import { Trash2, Edit2 } from 'lucide-react';

export default function AdminDashboard() {
  const { users = [], courses = [], enrollments = [], attendance = [], results = [] } = usePage().props;
  const [activeSection, setActiveSection] = useState('overview');

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalCourses = courses.length;

  const handleDeleteCourse = (courseId) => {
    if (!confirm('Delete this course?')) return;
    Inertia.post(`/courses/${courseId}/delete`);
  };

  const renderOverview = () => (
    <div className="admin-overview">
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Students</h4>
          <p className="stat-value">{totalStudents}</p>
        </div>
        <div className="stat-card">
          <h4>Teachers</h4>
          <p className="stat-value">{totalTeachers}</p>
        </div>
        <div className="stat-card">
          <h4>Courses</h4>
          <p className="stat-value">{totalCourses}</p>
        </div>
        <div className="stat-card">
          <h4>Enrollments</h4>
          <p className="stat-value">{enrollments.length}</p>
        </div>
      </div>
      <div className="admin-actions">
        <Link href="/courses/create" className="btn-primary">Add Course</Link>
        <Link href="/users/create" className="btn-secondary">Add User</Link>
      </div>
    </div>
  );

  const renderCourses = () => (
    <div className="table-card">
      <div className="table-header">
        <h3>Courses</h3>
        <Link href="/courses/create" className="btn-primary">New Course</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Title</th>
            <th>Teacher</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.course_id}>
              <td>{c.course_id}</td>
              <td>{c.title}</td>
              <td>{(users.find(u => u.id === c.teacher_id) || {}).name || '—'}</td>
              <td>{c.credits ?? '-'}</td>
              <td>
                <Link href={`/courses/${c.course_id}/edit`} className="icon-btn"><Edit2 size={14} /></Link>
                <button className="icon-btn danger" onClick={() => handleDeleteCourse(c.course_id)}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderUsers = (role) => (
    <div className="table-card">
      <div className="table-header">
        <h3>{role === 'teacher' ? 'Teachers' : 'Students'}</h3>
        <Link href="/users/create" className="btn-primary">New {role === 'teacher' ? 'Teacher' : 'Student'}</Link>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => u.role === role).map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <Link href={`/users/${u.id}/edit`} className="icon-btn"><Edit2 size={14} /></Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="admin-dashboard layout">
      <aside className="sidebar">
        <div className="brand">Admin</div>
        <nav className="nav">
          <button className={activeSection === 'overview' ? 'active' : ''} onClick={() => setActiveSection('overview')}>Overview</button>
          <button className={activeSection === 'courses' ? 'active' : ''} onClick={() => setActiveSection('courses')}>Courses</button>
          <button className={activeSection === 'teachers' ? 'active' : ''} onClick={() => setActiveSection('teachers')}>Teachers</button>
          <button className={activeSection === 'students' ? 'active' : ''} onClick={() => setActiveSection('students')}>Students</button>
          <button className={activeSection === 'attendance' ? 'active' : ''} onClick={() => setActiveSection('attendance')}>Attendance</button>
          <button className={activeSection === 'results' ? 'active' : ''} onClick={() => setActiveSection('results')}>Results</button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <h2>Admin Dashboard</h2>
          <div className="header-actions">
            <button className="btn-secondary">Export</button>
          </div>
        </header>

        <section className="page-body">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'courses' && renderCourses()}
          {activeSection === 'teachers' && renderUsers('teacher')}
          {activeSection === 'students' && renderUsers('student')}
          {activeSection === 'attendance' && (
            <div className="table-card">
              <h3>Attendance Records</h3>
              <p>Use filters on the server to fetch paged attendance data.</p>
            </div>
          )}
          {activeSection === 'results' && (
            <div className="table-card">
              <h3>Results</h3>
              <p>Exam results management will appear here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
