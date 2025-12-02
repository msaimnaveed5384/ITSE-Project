import React, { useState, useEffect } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import '../css/teacher.css';
import { UploadCloud, CheckSquare, Bell, X, Calendar, Save, BookOpen, Users, BarChart, Clock, Eye, Search } from 'lucide-react';

export default function TeacherDashboard() {
  const { user = {}, courses = [], enrollments = [], students = [], attendance: serverAttendance = [], results = [], flash = [] } = usePage().props;

  const { data, setData, post, processing, errors } = useForm({
    date: new Date().toISOString().split('T')[0],
    course_id: '',
    attendance: {}
  });

  const uploadMarks = useForm({
    type: '',
    total_marks: '',
    obtained_marks: '',
    courseId: '',
    studentId: ''
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [flasMsg, setFlasMsg] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (flash.message) {
      setFlasMsg(flash.message);
      const timer = setTimeout(() => setFlasMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [flash.message]);

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

    const missing = attendances.filter(a => !a.status || a.status === '-');
    if (missing.length > 0) {
      alert('Please select attendance status for all students before submitting.');
      return;
    }

    setData('attendance', attendances);
    post('/markattendance');
  };

  const handleStatusChange = (en, value) => {
    const enrollId = en.enroll_id ?? en.id;
    if (value === '-') {
      const copy = { ...data.attendance };
      delete copy[enrollId];
      setData('attendance', copy);
      return;
    }
    handleAttendanceChange(enrollId, value);
  };

  const openUploadModal = (courseId = null) => {
    if (courseId) setSelectedCourse(courseId);
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedCourse(null);
    uploadMarks.setData({
      type: '',
      total_marks: '',
      obtained_marks: '',
      courseId: '',
      studentId: ''
    });
  };

  const submitMarks = (e) => {
    e.preventDefault();
    uploadMarks.post('/uploadmarks');
  };

  useEffect(() => {
    if (data.date && data.course_id) {
      const history = serverAttendance.filter(record => {
        const en = enrollments.find(e => e.id === record.enroll_id);
        return record.date === data.date && en?.course_id == data.course_id;
      });

      const initialAttendance = {};
      history.forEach(record => {
        initialAttendance[record.enroll_id] = record.status;
      });

      setData('attendance', initialAttendance);
    }
  }, [data.date, data.course_id]);

  return (
    <div className="teacher-dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="teacher-avatar">
            <div className="avatar-initials">
              {user.name ? user.name.charAt(0).toUpperCase() : 'T'}
            </div>
          </div>
          <div className="teacher-info">
            <h3>{user.name || 'Teacher'}</h3>
            <p>Instructor</p>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <BarChart size={20} />
            <span>Overview</span>
          </button>
          <button className={`nav-item ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}>
            <UploadCloud size={20} />
            <span>Upload Marks</span>
          </button>
          <button className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            <CheckSquare size={20} />
            <span>Mark Attendance</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="current-date">
            <Clock size={16} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Teacher Dashboard</h1>
            <p className="subtitle">Manage courses, attendance, and student assessments</p>
          </div>
          <div className="header-right">
            <button className="icon-btn notification-btn">
              <Bell size={20} />
            </button>
            <button className="btn btn-primary" onClick={() => openUploadModal()}>
              <UploadCloud size={16} /> Quick Upload
            </button>
          </div>
        </header>

        {flasMsg && (
          <div className="alert-message">
            <div className="alert-content">
              {flasMsg}
              <button className="alert-close" onClick={() => setFlasMsg(null)}>×</button>
            </div>
          </div>
        )}

        <div className="dashboard-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <BookOpen size={24} />
                  </div>
                  <div className="stat-details">
                    <h3>{courses.length}</h3>
                    <p>My Courses</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <Users size={24} />
                  </div>
                  <div className="stat-details">
                    <h3>{enrollments.length}</h3>
                    <p>Total Students</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <CheckSquare size={24} />
                  </div>
                  <div className="stat-details">
                    <h3>{serverAttendance.length}</h3>
                    <p>Attendance Records</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">
                    <UploadCloud size={24} />
                  </div>
                  <div className="stat-details">
                    <h3>{results.length}</h3>
                    <p>Graded Assessments</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions-section">
                <div className="section-card">
                  <h3>Quick Actions</h3>
                  <div className="action-buttons">
                    <button className="action-btn" onClick={() => setActiveTab('attendance')}>
                      <CheckSquare size={20} />
                      <span>Mark Attendance</span>
                    </button>
                    <button className="action-btn" onClick={() => setActiveTab('marks')}>
                      <UploadCloud size={20} />
                      <span>Upload Marks</span>
                    </button>
                    <button className="action-btn" onClick={() => openUploadModal()}>
                      <UploadCloud size={20} />
                      <span>Quick Upload</span>
                    </button>
                  </div>
                </div>

                <div className="section-card">
                  <h3>Recent Courses</h3>
                  <div className="courses-list">
                    {courses.slice(0, 3).map(course => (
                      <div key={course.id} className="course-item">
                        <div className="course-icon">
                          <BookOpen size={18} />
                        </div>
                        <div className="course-info">
                          <h4>{course.name || course.title}</h4>
                          <p>{course.code || `ID: ${course.id}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marks' && (
            <div className="marks-tab">
              <div className="tab-header">
                <div>
                  <h2>Upload Marks</h2>
                  <p>Manage student assessments and grades</p>
                </div>
                <div className="header-actions">
                  <div className="search-container">
                    <Search size={18} />
                    <input 
                      type="text" 
                      placeholder="Search students..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-secondary" onClick={() => openUploadModal()}>
                    <UploadCloud size={16} /> CSV Upload
                  </button>
                </div>
              </div>

              <div className="courses-grid">
                {courses.map(c => (
                  <div key={c.id || c.course_id} className="course-card">
                    <div className="course-card-header">
                      <div className="course-card-icon">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <h3>{c.name || c.title}</h3>
                        <p>{c.code || `Course ID: ${c.id}`}</p>
                      </div>
                    </div>
                    <div className="course-card-stats">
                      <div className="course-stat">
                        <Users size={16} />
                        <span>{students.filter(s => s.cid == (c.id || c.course_id)).length} Students</span>
                      </div>
                    </div>
                    <div className="course-card-actions">
                      <button className="btn btn-primary" onClick={() => openUploadModal(c.id || c.course_id)}>
                        <UploadCloud size={16} /> Upload Marks
                      </button>
                      <button className="btn btn-outline">
                        <Eye size={16} /> View Roster
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="attendance-tab">
              <div className="tab-header">
                <div>
                  <h2>Mark Attendance</h2>
                  <p>Record student attendance for selected course</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); submitAttendance(); }} className="attendance-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <div className="input-with-icon">
                        <Calendar size={18} />
                        <input 
                          type="date" 
                          value={data.date}
                          onChange={(e) => setData('date', e.target.value)} 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Course</label>
                      <div className="input-with-icon">
                        <BookOpen size={18} />
                        <select 
                          value={data.course_id}
                          onChange={(e) => setData('course_id', e.target.value)}
                        >
                          <option value="">Select Course</option>
                          {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="invisible-label">Save</label>
                      <button className="btn btn-primary" disabled={processing || !data.course_id}>
                        <Save size={16} /> Save Attendance
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {data.course_id ? (
                <div className="attendance-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Status</th>
                        <th>Mark Attendance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnrollments.map(en => (
                        <tr key={en.id}>
                          <td className="student-id">{en.id}</td>
                          <td>
                            <div className="student-info">
                              <div className="student-avatar">
                                {en.uname?.charAt(0) || 'S'}
                              </div>
                              <span>{en.uname}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${data.attendance[en.id] === 'P' ? 'present' : data.attendance[en.id] === 'A' ? 'absent' : data.attendance[en.id] === 'L' ? 'leave' : 'pending'}`}>
                              {data.attendance[en.id] === 'P' ? 'Present' : 
                               data.attendance[en.id] === 'A' ? 'Absent' : 
                               data.attendance[en.id] === 'L' ? 'Leave' : 'Not Marked'}
                            </span>
                          </td>
                          <td>
                            <select
                              className="attendance-select"
                              value={data.attendance[en.id] || '-'}
                              onChange={(e) => handleStatusChange(en, e.target.value)}
                            >
                              <option value="-">Select Status</option>
                              <option value="P">Present</option>
                              <option value="A">Absent</option>
                              <option value="L">Leave</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <Calendar size={48} />
                  <h3>Select a Course</h3>
                  <p>Please select a course from the dropdown above to mark attendance</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {uploadModalOpen && (
        <div className="modal-overlay">
           
          <div className="bg-white">
          
            <div className="modal-header">
              
              <h3>Upload Marks</h3>
              <button className="modal-close" onClick={closeUploadModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={submitMarks}>
                <div className="form-group">
                  <label>Select Student</label>
                  <select 
                    value={uploadMarks.data.studentId}
                    onChange={(e) => {uploadMarks.setData('studentId', e.target.value)}}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.filter(st => st.cid == selectedCourse).map((st) => (
                      <option value={st.stid} key={st.eid}>{st.uname} - {st.cname}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Exam Type</label>
                  <select 
                    value={uploadMarks.data.type}
                    onChange={(e) => {
                      uploadMarks.setData('type', e.target.value);
                      uploadMarks.setData('courseId', selectedCourse);
                    }}
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Exam">Exam</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Project">Project</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Total Marks</label>
                    <input 
                      type="number" 
                      value={uploadMarks.data.total_marks}
                      onChange={(e) => {uploadMarks.setData('total_marks', e.target.value)}}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Obtained Marks</label>
                    <input 
                      type="number" 
                      value={uploadMarks.data.obtained_marks}
                      onChange={(e) => {uploadMarks.setData('obtained_marks', e.target.value)}}
                      required
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-outline" onClick={closeUploadModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <UploadCloud size={16} /> Upload Marks
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}