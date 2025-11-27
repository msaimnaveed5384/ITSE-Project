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
} from "lucide-react";

const Dashboard = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: "ITSE Project", time: "08:00 AM", completed: false },
    { id: 2, text: "Figma", time: "", completed: false },
    { id: 3, text: "SRS Document", time: "", completed: false },
    { id: 4, text: "COM Assignment 3", time: "02:40 PM", completed: false },
    { id: 5, text: "Data Structures- Project", time: "06:50 PM", completed: true },
  ]);

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
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
          <a href="#" className="nav-item active">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Overview</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📚</span>
            <span className="nav-text">Courses</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">📋</span>
            <span className="nav-text">Attendance</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">✏</span>
            <span className="nav-text">Marks/ Assessments</span>
          </a>
          <a href="#" className="nav-item">
            <span className="nav-icon">🏆</span>
            <span className="nav-text">Certification</span>
          </a>
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

        {/* Greeting */}
        <section className="greeting-section">
          <div className="greeting-text">
            <h2>
              👋 Welcome, <span className="user-name">Ahmad N.</span>
            </h2>
            <p className="greeting-subtitle">
              Let's keep watching new today!
            </p>
          </div>
        </section>

        {/* Stats Cards */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-header">
              <h3>Total Enrolled</h3>
              <button className="stat-menu">⚙</button>
            </div>
            <p className="stat-value">5000</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Completed</h3>
              <button className="stat-menu">⚙</button>
            </div>
            <p className="stat-value">50</p>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>Quiz Score</h3>
              <button className="stat-menu">⚙</button>
            </div>
            <p className="stat-value">50</p>
          </div>
        </section>

        {/* Charts Section */}
        <section className="charts-section">
          <div className="chart-container hours-chart">
            <h3 className="chart-title">Hours Spent</h3>
            <div className="bar-chart">
              <div className="bar-item">
                <div className="bar bar-orange" style={{ height: "40%" }}></div>
                <span className="bar-label">Jan</span>
              </div>
              <div className="bar-item">
                <div className="bar bar-teal" style={{ height: "20%" }}></div>
                <span className="bar-label">Feb</span>
              </div>
              <div className="bar-item">
                <div className="bar bar-orange" style={{ height: "50%" }}></div>
                <span className="bar-label">Mar</span>
              </div>
              <div className="bar-item">
                <div
                  className="bar bar-teal"
                  style={{ height: "65%" }}
                ></div>
                <span className="bar-label">Apr</span>
              </div>
              <div className="bar-item">
                <div className="bar bar-orange" style={{ height: "35%" }}></div>
                <span className="bar-label">May</span>
              </div>
            </div>
          </div>

          <div className="chart-container performance-chart">
            <h3 className="chart-title">Performance</h3>
            <div className="performance-metric">
              <div className="metric-label">Point Progress</div>
              <select className="metric-select">
                <option>Monthly</option>
              </select>
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
                  stroke="#ff9999"
                  strokeWidth="8"
                  strokeDasharray="157 314"
                  transform="rotate(-90 60 60)"
                />
                <circle cx="60" cy="60" r="8" fill="#ff9999" />
              </svg>
              <div className="progress-text">Your Point:</div>
              <div className="progress-value">8.966</div>
            </div>
          </div>
        </section>

        {/* Bottom Section: To-Do List and Profile */}
        <section className="bottom-section">
          <div className="todo-container">
            <h3 className="todo-title">To Do List</h3>
            <div className="todo-list">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className={todo.completed ? "completed" : ""}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                  {todo.time && <span className="todo-time">{todo.time}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="profile-container">
            <div className="profile-header">
              <h3>Profile</h3>
              <button className="edit-btn">
                <Edit2 size={16} />
              </button>
            </div>

            <div className="profile-avatar">
              <img
                src="https://ui-avatars.com/api/?name=Ahmad+Naeem&background=4f46e5&color=fff&size=120"
                alt="Profile"
                className="avatar-img"
              />
              <span className="verified-badge">✓</span>
            </div>

            <h4 className="profile-name">M. Ahmad Naeem</h4>
            <p className="profile-id">SE-3A</p>

            <div className="profile-calendar">
              <div className="calendar-header">
                <button className="calendar-nav">&lt;</button>
                <span className="calendar-month">November 2025</span>
                <button className="calendar-nav">&gt;</button>
              </div>
              <div className="calendar-grid">
                <div className="calendar-day">S</div>
                <div className="calendar-day">M</div>
                <div className="calendar-day">T</div>
                <div className="calendar-day">W</div>
                <div className="calendar-day">T</div>
                <div className="calendar-day">F</div>
                <div className="calendar-day">S</div>

                {[
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  1,
                  2,
                  3,
                  4,
                  5,
                  6,
                  7,
                  8,
                  9,
                  10,
                  11,
                  12,
                  13,
                  14,
                  15,
                  16,
                  17,
                  18,
                  19,
                  20,
                  21,
                  22,
                  23,
                  24,
                  25,
                ].map((day, idx) => (
                  <div key={idx} className="calendar-date">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;