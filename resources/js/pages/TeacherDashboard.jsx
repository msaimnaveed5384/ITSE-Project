import React, { useState, useEffect } from 'react';
import { usePage,  Link } from '@inertiajs/react';
import '../css/teacher.css';
import { Edit2, UploadCloud, CheckSquare, Bell, X, Calendar } from 'lucide-react';

export default function TeacherDashboard() {
  const { user = {}, courses = [], enrollments = [], attendance = [], results = [] } = usePage().props;
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [announcementText, setAnnouncementText] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [localAnnouncements, setLocalAnnouncements] = useState([]);
  const [activeMetric, setActiveMetric] = useState('today');

  const handleMarkAttendance = (enrollId, status) => {
    Inertia.post('/teacher/attendance', { enroll_id: enrollId, status });
  };

  const handleUploadMarks = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
  };

  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setFilePreview(null);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) { setFilePreview(null); return; }
    setFilePreview({ name: f.name, size: f.size });
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
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
        <div>
          <button className="btn-secondary" onClick={openUploadModal}><UploadCloud size={14} /> CSV Upload</button>
        </div>
      </div>

      <p className="muted">You can upload a CSV with columns: student_id,enroll_id,assessment,score,max_score — or open the guided uploader.</p>

      <div className="cards-grid">
        {courses.map(c => (
          <div key={c.course_id} className="course-card teacher-card">
            <div className="course-header">
              <h3>{c.title}</h3>
              <div className="course-status in-progress">{c.code || c.course_id}</div>
            </div>
            <p className="course-instructor">Instructor: {user.name || user.email}</p>
            <div className="progress-bar-container">
              <div className="progress-bar"><div className="progress-fill" style={{width: (c.progress_pct || 30) + '%'}}></div></div>
              <div className="progress-text">{c.progress_pct || 30}%</div>
            </div>
            <div style={{display:'flex',gap:8}}>
              <button className="btn-primary" onClick={()=>{ setSelectedCourse(c.course_id); openUploadModal(); }}>Upload Marks</button>
              <button className="btn-secondary">Roster</button>
            </div>
          </div>
        ))}
      </div>
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
      <form onSubmit={(e)=>{ handleCreateAnnouncement(e); setLocalAnnouncements([announcementText, ...localAnnouncements]); }} className="announce-form">
        <textarea className="announce-textarea" placeholder="Share an update with your class..." value={announcementText} onChange={(e)=>setAnnouncementText(e.target.value)} />
        <div className="announce-actions">
          <div className="announce-meta">
            <span className="chip">To: All Students</span>
            <span className="chip muted">Schedule</span>
          </div>
          <div>
            <button className="btn-secondary" type="button">Preview</button>
            <button className="btn-primary" type="submit">Post <Bell size={14} /></button>
          </div>
        </div>
      </form>

      <div className="announcements-list">
        {localAnnouncements.length === 0 && (<div className="muted">No announcements yet — your published announcements will appear here.</div>)}
        {localAnnouncements.map((a, idx) => (
          <div key={idx} className="announcement-item">
            <div className="announcement-body">
              <div className="announcement-text">{a}</div>
              <div className="announcement-meta">Just now • {user.name || 'You'}</div>
            </div>
            <button className="icon-btn" onClick={()=>{
              setLocalAnnouncements(localAnnouncements.filter((_,i)=>i!==idx));
            }}><X size={14} /></button>
          </div>
        ))}
      </div>
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
        <header className="dashboard-header teacher-hero">
          <div className="header-left">
            <h1>Teacher Dashboard</h1>
            <p className="muted">Welcome back, <span className="user-name">{user.name || user.email}</span> — manage classes, attendance and marks.</p>
          </div>
          <div className="header-right">
            <div className="metric-pill">Today: <strong> {activeMetric === 'today' ? 'In class' : 'Idle'}</strong></div>
            <button className="icon-btn" title="Notifications"><Bell size={18} /></button>
            <button className="btn-primary" onClick={()=>{ setActiveTab('marks'); openUploadModal(); }}><UploadCloud size={14} /> Quick Upload</button>
          </div>
        </header>
        <div className="page-body">
          {activeTab==='overview' && overview}
          {activeTab==='marks' && marksTab}
          {activeTab==='attendance' && attendanceTab}
          {activeTab==='announcements' && announcementsTab}
        </div>

        {uploadModalOpen && (
          <div className="modal-overlay" onClick={closeUploadModal}>
            <div className="modal" onClick={(e)=>e.stopPropagation()}>
              <div className="modal-header">
                <h3>Upload Marks</h3>
                <button className="icon-btn" onClick={closeUploadModal}><X size={16} /></button>
              </div>
              <form onSubmit={(e)=>{ handleUploadMarks(e); closeUploadModal(); }} encType="multipart/form-data">
                <div className="modal-body">
                  <label className="field-label">Course</label>
                  <select name="course_id" className="metric-select" value={selectedCourse || ''} onChange={(e)=>setSelectedCourse(e.target.value)}>
                    <option value="">Select course</option>
                    {courses.map(c => <option key={c.course_id} value={c.course_id}>{c.title}</option>)}
                  </select>

                  <label className="field-label" style={{marginTop:12}}>CSV File</label>
                  <input type="file" name="marks_csv" accept=".csv" className="file-input" onChange={handleFileChange} />
                  {filePreview && (<div className="file-preview">Selected: {filePreview.name} • {(filePreview.size/1024).toFixed(1)} KB</div>)}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-secondary" onClick={closeUploadModal}>Cancel</button>
                  <button type="submit" className="btn-primary">Upload <UploadCloud size={14} /></button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}