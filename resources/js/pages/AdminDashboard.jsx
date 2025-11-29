import React, { use, useState } from 'react'; 
import { Link, useForm, usePage} from '@inertiajs/react';
import '../css/admin.css'; 
import { Trash2, Edit2, Info, Plus, UserPlus, BookOpen } from 'lucide-react'; 

export default function AdminDashboard() {
  // Normalize page props and ensure `users` is always an array.
  const pageProps = usePage().props || {};
  const usersProp = pageProps.users;
  const courseProp = pageProps.courses;
  const enrollmentsProp = pageProps.enrollments;
  console.log(enrollmentsProp);
  let users = [];
  
  if (Array.isArray(usersProp)) {
    users = usersProp;
  } else if (usersProp && Array.isArray(usersProp.data)) {
    users = usersProp.data;
  } else if (usersProp && typeof usersProp === 'object') {
    users = Object.values(usersProp);
  } else {
    users = [];
  }

  const { courses = [], enrollments = [], attendance = [], results = [] } = pageProps;
  const [activeSection, setActiveSection] = useState('overview'); 
  const [activeTab, setActiveTab] = useState('data'); // 'data' or 'description'
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddEnrollment, setShowAddEnrollment] = useState(false);
  
  // UseForm for course
  const { data: courseData, setData: setCourseData, post: postCourse, processing: courseProcessing, errors: courseErrors, reset: resetCourse } = useForm({
    name: '',
    credits: '',
    teacher_id: ''
  });
  
  // UseForm for user
  const { data: userData, setData: setUserData, post: postUser, processing: userProcessing, errors: userErrors, reset: resetUser } = useForm({
    name: '',
    username: '',
    email: '',
    role: 'student',
    password: '',
    password_confirmation: ''
  });

  // UseForm for enrollment
  const { data: enrollmentData, setData: setEnrollmentData, post: postEnrollment, processing: enrollmentProcessing, errors: enrollmentErrors, reset: resetEnrollment } = useForm({
    student_id: '',
    course_id: ''
  });
  
  const totalStudents = users.filter(u => u.role === 'student').length; 
  const totalTeachers = users.filter(u => u.role === 'teacher').length; 
  const totalCourses = courses.length; 
 
  const handleDeleteCourse = (courseId) => { 
    if (!confirm('Delete this course?')) return; 
  };

  const handleDeleteEnrollment = (enrollmentId) => { 
    if (!confirm('Delete this enrollment?')) return; 
  }; 

  // Add Course functionality
  const handleAddCourse = () => {
    setShowAddCourse(true);
  };

  const handleCourseInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData(name, value);
  };

  const handleSubmitCourse = (e) => {
    e.preventDefault();
    postCourse('/addcourse', {
      onSuccess: () => {
        setShowAddCourse(false);
        resetCourse();
      },
      onError: () => {
        // Errors will be available in courseErrors
      }
    });
  };

  const handleCancelAddCourse = () => {
    setShowAddCourse(false);
    resetCourse();
  };

  // Add User functionality
  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(name, value);
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    postUser('/adduser', {
      onSuccess: () => {
        setShowAddUser(false);
        resetUser();
      },
      onError: () => {
        // Errors will be available in userErrors
      }
    });
  };

  const handleCancelAddUser = () => {
    setShowAddUser(false);
    resetUser();
  };

  // Add Enrollment functionality
  const handleAddEnrollment = () => {
    setShowAddEnrollment(true);
  };

  const handleEnrollmentInputChange = (e) => {
    const { name, value } = e.target;
    setEnrollmentData(name, value);
  };

  const handleSubmitEnrollment = (e) => {
    e.preventDefault();
    postEnrollment('/enrollstudent', {
      onSuccess: () => {
        setShowAddEnrollment(false);
        resetEnrollment();
      },
      onError: () => {
        // Errors will be available in enrollmentErrors
      }
    });
  };

  const handleCancelAddEnrollment = () => {
    setShowAddEnrollment(false);
    resetEnrollment();
  };

  // Description content for each section
  const sectionDescriptions = {
    overview: {
      title: "Dashboard Overview",
      content: "This overview provides a high-level summary of your educational platform. Monitor key metrics including student enrollment, teacher allocation, course offerings, and overall system activity. Use this section to quickly assess the health and scale of your institution."
    },
    courses: {
      title: "Course Management",
      content: "Manage all academic courses offered by your institution. This section allows you to view existing courses, create new ones, assign teachers, and modify course details. Each course includes information about credits, assigned instructors, and enrollment capacity."
    },
    teachers: {
      title: "Faculty Management",
      content: "Oversee your teaching staff and faculty members. This section provides access to teacher profiles, contact information, and course assignments. You can add new instructors, update existing records, and manage teaching assignments across different courses."
    },
    students: {
      title: "Student Administration",
      content: "Manage student records and enrollment information. This section contains comprehensive student data including personal details, academic progress, and course enrollments. Monitor student performance and manage student accounts efficiently."
    },
    enrollments: {
      title: "Enrollment Management",
      content: "Manage student course enrollments and registrations. This section allows you to enroll students in courses, track enrollment status, and manage class rosters. Monitor student course loads and ensure proper course assignments."
    },
    results: {
      title: "Academic Results",
      content: "Access and manage student academic performance and examination results. This section provides tools for recording grades, generating transcripts, and analyzing student achievement across various courses and semesters."
    }
  };

  const renderTabButtons = () => (
    <div className="tab-buttons">
      <button 
        className={`tab-btn ${activeTab === 'data' ? 'active' : ''}`}
        onClick={() => setActiveTab('data')}
      >
        Data
      </button>
      <button 
        className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
        onClick={() => setActiveTab('description')}
      >
        <Info size={14} />
        Description
      </button>
    </div>
  );

  const renderDescription = () => {
    const description = sectionDescriptions[activeSection];
    return (
      <div className="description-tab">
        <div className="description-header">
          <h3>{description.title}</h3>
        </div>
        <div className="description-content">
          <p>{description.content}</p>
        </div>
      </div>
    );
  };

  const renderAddCourseForm = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Course</h3>
          <button className="close-btn" onClick={handleCancelAddCourse}>×</button>
        </div>
        <form onSubmit={handleSubmitCourse} className="modal-form">
          <div className="form-group">
            <label htmlFor="courseName" className="form-label">
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              name="name"
              value={courseData.name}
              onChange={handleCourseInputChange}
              className={`form-input ${courseErrors.name ? 'error' : ''}`}
              placeholder="Enter course name"
              required
            />
            {courseErrors.name && (
              <span className="error-message">{courseErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="courseCredits" className="form-label">
              Credits *
            </label>
            <input
              type="number"
              id="courseCredits"
              name="credits"
              value={courseData.credits}
              onChange={handleCourseInputChange}
              className={`form-input ${courseErrors.credits ? 'error' : ''}`}
              placeholder="Enter number of credits"
              min="1"
              max="10"
              required
            />
            {courseErrors.credits && (
              <span className="error-message">{courseErrors.credits}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="courseTeacher" className="form-label">
              Assign Teacher *
            </label>
            <select
              id="courseTeacher"
              name="teacher_id"
              value={courseData.teacher_id}
              onChange={handleCourseInputChange}
              className={`form-input ${courseErrors.teacher_id ? 'error' : ''}`}
              required
            >
              <option value="">Select a teacher</option>
              {users.filter(u => u.role === 'teacher').map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.email})
                </option>
              ))}
            </select>
            {courseErrors.teacher_id && (
              <span className="error-message">{courseErrors.teacher_id}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCancelAddCourse}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={courseProcessing}>
              <Plus size={16} />
              {courseProcessing ? 'Adding...' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New User</h3>
          <button className="close-btn" onClick={handleCancelAddUser}>×</button>
        </div>
        <form onSubmit={handleSubmitUser} className="modal-form">
          <div className="form-group">
            <label htmlFor="userName" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="userName"
              name="name"
              value={userData.name}
              onChange={handleUserInputChange}
              className={`form-input ${userErrors.name ? 'error' : ''}`}
              placeholder="Enter full name"
              required
            />
            {userErrors.name && (
              <span className="error-message">{userErrors.name}</span>
            )}
            <br/>
            <label htmlFor="username" className="form-label">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleUserInputChange}
              className={`form-input ${userErrors.username ? 'error' : ''}`}
              placeholder="Enter Username"
              required
            />
            {userErrors.username && (
              <span className="error-message">{userErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userEmail" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="userEmail"
              name="email"
              value={userData.email}
              onChange={handleUserInputChange}
              className={`form-input ${userErrors.email ? 'error' : ''}`}
              placeholder="Enter email address"
              required
            />
            {userErrors.email && (
              <span className="error-message">{userErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userRole" className="form-label">
              Role *
            </label>
            <select
              id="userRole"
              name="role"
              value={userData.role}
              onChange={handleUserInputChange}
              className={`form-input ${userErrors.role ? 'error' : ''}`}
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
            {userErrors.role && (
              <span className="error-message">{userErrors.role}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userPassword" className="form-label">
              Password *
            </label>
            <input
              type="password"
              id="userPassword"
              name="password"
              value={userData.password}
              onChange={handleUserInputChange}
              className={`form-input ${userErrors.password ? 'error' : ''}`}
              placeholder="Enter password"
              required
            />
            {userErrors.password && (
              <span className="error-message">{userErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="userPasswordConfirmation" className="form-label">
              Confirm Password *
            </label>
            <input
              type="password"
              id="userPasswordConfirmation"
              name="password_confirmation"
              value={userData.password_confirmation}
              onChange={handleUserInputChange}
              className={`form-input ${userErrors.password_confirmation ? 'error' : ''}`}
              placeholder="Confirm password"
              required
            />
            {userErrors.password_confirmation && (
              <span className="error-message">{userErrors.password_confirmation}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCancelAddUser}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={userProcessing}>
              <UserPlus size={16} />
              {userProcessing ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAddEnrollmentForm = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Enroll Student in Course</h3>
          <button className="close-btn" onClick={handleCancelAddEnrollment}>×</button>
        </div>
        <form onSubmit={handleSubmitEnrollment} className="modal-form">
          <div className="form-group">
            <label htmlFor="enrollmentStudent" className="form-label">
              Student *
            </label>
            <select
              id="enrollmentStudent"
              name="student_id"
              value={enrollmentData.student_id}
              onChange={handleEnrollmentInputChange}
              className={`form-input ${enrollmentErrors.student_id ? 'error' : ''}`}
              required
            >
              <option value="">Select a student</option>
              {users.filter(u => u.role === 'student').map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
            {enrollmentErrors.student_id && (
              <span className="error-message">{enrollmentErrors.student_id}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="enrollmentCourse" className="form-label">
              Course *
            </label>
            <select
              id="enrollmentCourse"
              name="course_id"
              value={enrollmentData.course_id}
              onChange={handleEnrollmentInputChange}
              className={`form-input ${enrollmentErrors.course_id ? 'error' : ''}`}
              required
            >
              <option value="">Select a course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} - {course.credits} credits
                </option>
              ))}
            </select>
            {enrollmentErrors.course_id && (
              <span className="error-message">{enrollmentErrors.course_id}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleCancelAddEnrollment}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={enrollmentProcessing}>
              <BookOpen size={16} />
              {enrollmentProcessing ? 'Enrolling...' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderOverview = () => ( 
    <div className="admin-overview"> 
      {activeTab === 'data' ? (
        <>
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
            <button onClick={handleAddCourse} className="btn-primary">
              <Plus size={16} />
              Add Course
            </button> 
            <button onClick={handleAddUser} className="btn-secondary">
              <UserPlus size={16} />
              Add User
            </button> 
            <button onClick={handleAddEnrollment} className="btn-secondary">
              <BookOpen size={16} />
              Add Enrollment
            </button> 
          </div>
        </>
      ) : (
        renderDescription()
      )}
    </div> 
  ); 

  const renderCourses = () => ( 
    <div className="table-card"> 
      <div className="table-header"> 
        <h3>Courses</h3> 
        {activeTab === 'data' && (
          <button onClick={handleAddCourse} className="btn-primary">
            <Plus size={16} />
            New Course
          </button>
        )}
      </div> 
      {activeTab === 'data' ? (
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
                <td>{c.id}</td> 
                <td>{c.name}</td> 
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
      ) : (
        renderDescription()
      )}
    </div> 
  ); 

  const renderUsers = (role) => ( 
    <div className="table-card"> 
      <div className="table-header"> 
        <h3>{role === 'teacher' ? 'Teachers' : 'Students'}</h3> 
        {activeTab === 'data' && (
          <button onClick={handleAddUser} className="btn-primary">
            <UserPlus size={16} />
            New {role === 'teacher' ? 'Teacher' : 'Student'}
          </button>
        )}
      </div> 
      {activeTab === 'data' ? (
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
      ) : (
        renderDescription()
      )}
    </div> 
  ); 

  const renderEnrollments = () => ( 
    <div className="table-card"> 
      <div className="table-header"> 
        <h3>Enrollments</h3> 
        {activeTab === 'data' && (
          <button onClick={handleAddEnrollment} className="btn-primary">
            <BookOpen size={16} />
            New Enrollment
          </button>
        )}
      </div> 
      {activeTab === 'data' ? (
        <table className="data-table"> 
          <thead> 
            <tr> 
              <th>Enrollment ID</th> 
              <th>Student</th> 
              <th>Course</th> 
              <th>Enrolled Date</th> 
              <th>Actions</th> 
            </tr> 
          </thead> 
          <tbody> 
            {enrollments.map((enrollment) => {
              const student = users.find(u => u.id === enrollment.student_id);
              const course = courses.find(c => c.id === enrollment.course_id);
              return (
                <tr key={enrollment.id}> 
                  <td>{enrollment.id}</td> 
                  <td>{student ? student.name : 'Unknown Student'}</td> 
                  <td>{course ? course.name : 'Unknown Course'}</td> 
                  <td>{new Date(enrollment.created_at).toLocaleDateString()}</td> 
                  <td> 
                    <button className="icon-btn danger" onClick={() => handleDeleteEnrollment(enrollment.id)}>
                      <Trash2 size={14} />
                    </button> 
                  </td> 
                </tr> 
              );
            })} 
          </tbody> 
        </table>
      ) : (
        renderDescription()
      )}
    </div> 
  ); 

  return ( 
    <div className="admin-dashboard layout"> 
      <aside className="sidebar"> 
        <div className="brand">Admin</div> 
        <nav className="nav"> 
          <button className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => { setActiveSection('overview'); setActiveTab('data'); }}>Overview</button> 
          <button className={`nav-item ${activeSection === 'courses' ? 'active' : ''}`} onClick={() => { setActiveSection('courses'); setActiveTab('data'); }}>Courses</button> 
          <button className={`nav-item ${activeSection === 'teachers' ? 'active' : ''}`} onClick={() => { setActiveSection('teachers'); setActiveTab('data'); }}>Teachers</button> 
          <button className={`nav-item ${activeSection === 'students' ? 'active' : ''}`} onClick={() => { setActiveSection('students'); setActiveTab('data'); }}>Students</button> 
          <button className={`nav-item ${activeSection === 'enrollments' ? 'active' : ''}`} onClick={() => { setActiveSection('enrollments'); setActiveTab('data'); }}>Enrollments</button> 
          <button className={`nav-item ${activeSection === 'results' ? 'active' : ''}`} onClick={() => { setActiveSection('results'); setActiveTab('data'); }}>Results</button> 
        </nav> 
      </aside> 
      <main className="main-content"> 
        <header className="page-header"> 
          <h2>Admin Dashboard</h2> 
          <div className="header-actions"> 
            {renderTabButtons()}
            <button className="btn-secondary">Export</button> 
          </div> 
        </header> 
        <section className="page-body"> 
          {activeSection === 'overview' && renderOverview()} 
          {activeSection === 'courses' && renderCourses()} 
          {activeSection === 'teachers' && renderUsers('teacher')} 
          {activeSection === 'students' && renderUsers('student')} 
          {activeSection === 'enrollments' && renderEnrollments()} 
          {activeSection === 'results' && ( 
            <div className="table-card"> 
              <div className="table-header">
                <h3>Results</h3>
                {activeTab === 'data' && (
                  <button className="btn-primary">Generate Reports</button>
                )}
              </div>
              {activeTab === 'data' ? (
                <p>Exam results management will appear here.</p>
              ) : (
                renderDescription()
              )}
            </div> 
          )} 
        </section> 
      </main> 
      
      {/* Add Course Modal */}
      {showAddCourse && renderAddCourseForm()}
      
      {/* Add User Modal */}
      {showAddUser && renderAddUserForm()}

      {/* Add Enrollment Modal */}
      {showAddEnrollment && renderAddEnrollmentForm()}
    </div> 
  ); 
}