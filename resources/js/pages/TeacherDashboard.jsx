// Fixed TeacherDashboard component
// (Complete cleaned, optimized, corrected version)

import React, { useState, useEffect } from 'react';
import { usePage, Link, useForm } from '@inertiajs/react';
import '../css/teacher.css';
import { Edit2, UploadCloud, CheckSquare, Bell, X, Calendar, Save } from 'lucide-react';
import FlashMessage from '../components/FlashMessage';

export default function TeacherDashboard() {
  const { user = {}, courses = [], enrollments = [],students = [], attendance = [], results = [], flash = {} } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    date: new Date().toISOString().split('T')[0],
    course_id: '',
    attendance: {}
  });

  const attendanceForm = useForm({
    enroll_id: '',
    markby: '',
    status:''
    
  });


  const uploadMarks = useForm({
    type: '',
    total_marks: '',
    obtained_marks: '',
    courseId: '',
    studentId: ''
  });
  
  console.log(uploadMarks.data);
  console.log(uploadMarks.errors);


  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const filteredEnrollments = data.course_id
    ? enrollments.filter(en => en.course_id == data.course_id)
    : [];

  const handleAttendanceChange = (enrollId, status) => {
    setData('attendance', {
      ...data.attendance,
      [enrollId]: status
    });
  };



  const submitAttendance = () => {
    // Build attendances array from selected course enrollments
    if (!data.course_id) {
      alert('Please select a course before submitting attendance.');
      return;
    }

    const attendances = filteredEnrollments.map(en => {
      const enrollId = en.enroll_id ?? en.id;
      return {
        enroll_id: enrollId,
        status: data.attendance[enrollId]
      };
    });

    // validate none are missing
    const missing = attendances.filter(a => !a.status || a.status === '-');
    if (missing.length > 0) {
      alert('Please select attendance status for all students before submitting.');
      return;
    }

    // POST JSON to backend
    const payload = {
      date: data.date,
      course_id: data.course_id,
      attendances: attendances
    };

    const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    fetch('/markattendance', {
      method: 'POST',
      credentials: 'same-origin', // include session cookie so Laravel can validate CSRF
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': csrf,
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(payload)
    }).then(async res => {
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || 'Submission failed');
      }
      // success - reload to reflect saved attendance
      window.location.reload();
    }).catch(err => {
      console.error('Attendance submit error', err);
      alert('Failed to submit attendance. See console for details.');
    });
  };

  const handleStatusChange = (en, value) => {
    // Normalize id
    const enrollId = en.enroll_id ?? en.id;

    // Optimistically update UI
    // if user selected the placeholder '-' do not send to server; just clear
    if (value === '-' ) {
      // remove entry locally
      const copy = { ...data.attendance };
      delete copy[enrollId];
      setData('attendance', copy);
      return;
    }

    // optimistic UI update, keep previous value to rollback if needed
    const prevValue = data.attendance[enrollId];
    handleAttendanceChange(enrollId, value);
    // We only update local form state here. Final submission of all records happens
    // when the teacher clicks the Save button which sends a batch request.
  };

  // Upload modal controls (moved above tab content so marksTab can reference them)
  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setFilePreview(null);
  };


  const overviewTab = (
    <div className="overview-full">
      <div className="stats-section">
        <div className="stat-card"><div className="stat-header"><h3>My Courses</h3></div><p className="stat-value">{courses.length}</p></div>
        <div className="stat-card"><div className="stat-header"><h3>Students</h3></div><p className="stat-value">{enrollments.length}</p></div>
      </div>
      <div className="charts-section">
        <div className="chart-container">
          <h4 className="chart-title">Quick Actions</h4>
          <div style={{display:'flex',gap:12}}>
            <button className="btn-primary" onClick={()=>setActiveTab('attendance')}>Mark Attendance</button>
            <button className="btn-secondary" onClick={()=>setActiveTab('marks')}>Upload Marks</button>
          </div>
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
      <div className="cards-grid">
        {courses.map(c => (
          
          <div key={c.id || c.course_id} className="course-card teacher-card">
            <div className="course-header"><h3>{c.name || c.title}</h3><div className="course-status in-progress">{c.code || c.id}</div></div>
            <p className="course-instructor">Instructor: {user.name || user.email}</p>
            <div style={{display:'flex',gap:8}}>
              <button className="btn-primary" onClick={()=>{ setSelectedCourse(c.id || c.course_id); openUploadModal(); }}>Upload Marks</button>
              <button className="btn-secondary">Roster</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    if (data.date && data.course_id) {
      const history = attendance.filter(record => {
        const en = enrollments.find(e => e.id === record.enroll_id);
        return record.date === data.date && en?.course_id == data.course_id;
      });

      const initialAttendance = {};
      history.forEach(record => {
        initialAttendance[record.enroll_id] = record.status;
      });

      setData('attendance', initialAttendance);
      setAttendanceHistory(history);
    }
  }, [data.date, data.course_id]);


  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return setFilePreview(null);
    setFilePreview({ name: f.name, size: f.size });
  };

 

  const handleUploadMarks = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
  };

const submitMarks = (e) => {
    e.preventDefault();
    uploadMarks.post('/uploadmarks');
}
  return (
    <div className="dashboard-container teacher-dashboard layout">
  <aside className="sidebar">
        <div className="logo-box"><div className="logo-dot"></div></div>
        <div style={{ marginTop:12, fontWeight:700 }}>Teacher</div>
        <nav className="nav" style={{ marginTop:16 }}>
          <button
            type="button"
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`}
            onClick={() => setActiveTab('marks')}
          >
            Upload Marks
          </button>
          <button
            type="button"
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Mark Attendance
          </button>
        </nav>
      </aside>

      <main className="main-content">
        <header className="dashboard-header teacher-hero">
          <div className="header-left">
            <h1>Teacher Dashboard</h1>
            <p className="muted">Welcome back, <span className="user-name">{user.name || user.email}</span></p>
          </div>
          <div className="header-right">
            <button className="icon-btn"><Bell size={18} /></button>
            <button className="btn-primary" onClick={() => { setActiveTab('marks'); openUploadModal(); }}>
              <UploadCloud size={14} /> Quick Upload
            </button>
          </div>
  </header>

  {/* Server flash message (auto-fades) */}
  <FlashMessage message={flash?.message} />

  <div className="page-body">

          {activeTab === 'overview' && overviewTab}
          {activeTab === 'marks' && marksTab}
          {activeTab === 'attendance' && (
            <div className="section-content">
              <div className="section-header">
                <h2>Mark Attendance</h2>
                <form onSubmit={(e) => { e.preventDefault(); submitAttendance(); }} className="attendance-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="field-label">Date</label>
                      <input type="date" className="date-input" value={data.date}
                        onChange={(e) => setData('date', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="field-label">Course</label>
                      <select className="course-select" value={data.course_id}
                        onChange={(e) => setData('course_id', e.target.value)}>
                        <option value="">Select Course</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <button className="btn-primary" disabled={processing || !data.course_id}>
                        <Save size={14} /> Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {data.course_id ? (
                <div className="attendance-table-container">
                  <table className="data-table attendance-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.map(en => (
                      <tr key={en.id}>
                        <td>{en.id}</td>
                        <td>{en.uname}</td>

                        <td>
                          <span className={`attendance-status ${data.attendance[en.id] || '-'}`}>
                            {data.attendance[en.id] || 'Not Marked'}
                          </span>
                        </td>

                        <td>
                          <div className="attendance-buttons">
                            <select
                              className="form-control"
                              value={data.attendance[en.id] || '-'}
                              onChange={(e) => handleStatusChange(en, e.target.value)}
                            >
                              <option value="-">-</option>
                              <option value="P">Present</option>
                              <option value="A">Absent</option>
                              <option value="L">Leave</option>
                            </select>
                          </div>
                        </td>
                      </tr>

                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>Select a course to mark attendance</h3>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Upload modal */}
        
        {uploadModalOpen && (
          
          <div className="modal-overlay" >
            <div>
           <X size={40} onClick={closeUploadModal}/>
           </div>

           <div className="container bg-white p-5">
           <form className='form-group' onSubmit={submitMarks}>

            <h3 className='text-center'>Upload Marks</h3>
<label htmlFor="">Select Student</label>
           <select name="" id="" className='form-control' onChange={(e) => {uploadMarks.setData('studentId',e.target.value)}}>
              <option value="" disabled selected>Select</option>
              {students.map((st) => (
                st.cid == selectedCourse ? (
                  <option className='form-control' value={st.stid} key={st.eid}>{st.uname} - {st.cname}</option>
                ) : null
                
              ))}
              
            </select>

            <label htmlFor="">Exam Type: </label>
           
                 <select name="" onChange={(e) => {
                  uploadMarks.setData('type',e.target.value);
                  uploadMarks.setData('courseId', selectedCourse);
                  
                  }} id="" className='form-control'>
                  <option value="" disabled selected>Select</option>
                  <option value="Exam">Exam</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Project">Project</option>
                 </select>
                  <label htmlFor="">Total Marks: </label>
                 <input type="number" onChange={(e) => {uploadMarks.setData('total_marks', e.target.value)}} className='form-control'  name="" id="" />
                 <label htmlFor="">Obtained Marks</label>
                 <input type="number" onChange={(e) => {uploadMarks.setData('obtained_marks', e.target.value)}} className='form-control' name="" id="" />

                 <button type='submit' className='bg-primary p-3 rounded text-white font-bold text-center my-2'>Upload</button>
           </form>
          
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
