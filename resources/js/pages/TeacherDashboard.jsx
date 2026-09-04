import React, { useState } from 'react';
import { usePage, Inertia, Link } from '@inertiajs/react';
import '../css/dashboard.css';
import { Edit2, UploadCloud, CheckSquare } from 'lucide-react';

export default function TeacherDashboard() {
  const { user = {}, courses = [], enrollments = [], attendance = [], results = [] } = usePage().props;
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [announcementText, setAnnouncementText] = useState('');

  const handleMarkAttendance = (enrollId, status) => {
    Inertia.post('/teacher/attendance', { enroll_id: enrollId, status });
  };

  const handleUploadMarks = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    Inertia.post('/teacher/results/upload', data);
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    Inertia.post('/teacher/announcements', { message: announcementText });
    setAnnouncementText('');
  };

  const overview = (
    <div className="overview-full">
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-header"><h3>My Courses</h3></div>
          <p className="stat-value">{courses.length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-header"><h3>My Students</h3></div>
          <p className="stat-value">{enrollments.length}</p>
        </div>
        <div className="stat-card">
          <div className="stat-header"><h3>Announcements</h3></div>
          <p className="stat-value">{0}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h4 className="chart-title">Quick Actions</h4>
          <div style={{display:'flex',gap:12}}>
            <Link href="#" onClick={() => setActiveTab('attendance')} className="btn-primary">Mark Attendance</Link>
            <Link href="#" onClick={() => setActiveTab('marks')} className="btn-secondary">Upload Marks</Link>
          </div>
        </div>

        <div className="chart-container">
          <h4 className="chart-title">Recent Activity</h4>
          <p>No recent actions</p>
        </div>
      </div>
    </div>
  );

  const marksTab = (
    <div className="section-content">
      <div className="section-header">
        <h2>Upload Marks</h2>
      </div>
      <form onSubmit={handleUploadMarks} encType="multipart/form-data">
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <select name="course_id" className="metric-select" value={selectedCourse || ''} onChange={(e)=>setSelectedCourse(e.target.value)}>
            <option value="">Select course</option>
            {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.title}</option>)}
          </select>
          <input type="file" name="marks_csv" accept=".csv" className="btn-secondary" />
          <button type="submit" className="btn-primary"><UploadCloud size={14} /> Upload</button>
        </div>
      </form>
    </div>
  );

  const attendanceTab = (
    <div className="section-content">
      <div className="section-header">
        <h2>Mark Attendance</h2>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr><th>Enrollment</th><th>Student</th><th>Course</th><th>Mark</th></tr>
          </thead>
          <tbody>
            {enrollments.map(en => (
              <tr key={en.enroll_id}>
                <td>{en.enroll_id}</td>
                <td>{(en.student_name) || en.student_id}</td>
                <td>{(en.course_title) || en.course_id}</td>
                <td>
                  <button className="btn-secondary" onClick={()=>handleMarkAttendance(en.enroll_id,'present')}>Present</button>
                  <button className="btn-secondary" onClick={()=>handleMarkAttendance(en.enroll_id,'absent')}>Absent</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const announcementsTab = (
    <div className="section-content">
      <div className="section-header">
        <h2>Announcements</h2>
      </div>
      <form onSubmit={handleCreateAnnouncement}>
        <textarea placeholder="Write announcement..." value={announcementText} onChange={(e)=>setAnnouncementText(e.target.value)} style={{width:'100%',minHeight:120,padding:12,borderRadius:8,border:'1px solid #e5e7eb'}} />
        <div style={{marginTop:12}}>
          <button className="btn-primary" type="submit">Post Announcement</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="teacher-dashboard layout">
      <aside className="sidebar">
        <div className="logo-box"><div className="logo-dot"></div></div>
        <div style={{marginTop:12,fontWeight:700}}>Teacher</div>
        <nav className="nav" style={{marginTop:16}}>
          <button className={activeTab==='overview'? 'active':''} onClick={()=>setActiveTab('overview')}>Overview</button>
          <button className={activeTab==='marks'? 'active':''} onClick={()=>setActiveTab('marks')}>Upload Marks</button>
          <button className={activeTab==='attendance'? 'active':''} onClick={()=>setActiveTab('attendance')}>Mark Attendance</button>
          <button className={activeTab==='announcements'? 'active':''} onClick={()=>setActiveTab('announcements')}>Announcements</button>
        </nav>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-left"><h1>Teacher Dashboard</h1></div>
        </header>
        <div className="page-body">
          {activeTab==='overview' && overview}
          {activeTab==='marks' && marksTab}
          {activeTab==='attendance' && attendanceTab}
          {activeTab==='announcements' && announcementsTab}
        </div>
      </main>
    </div>
  );
}
