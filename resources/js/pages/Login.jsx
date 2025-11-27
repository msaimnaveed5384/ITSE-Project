import React from "react";
import "../css/login.css";
import { useForm } from "@inertiajs/react";


function Login() {

const { data, setData, post, processing, errors } = useForm({
    username: '',
    password: '',
    remember: false,
});

function submit(e) {
    e.preventDefault();
    post('/login')
}
  return (
    <div className="login-wrapper container-fluid p-0">
      <div className="row g-0 min-vh-100">
        {/* Left side – form */}
        <div className="col-lg-8 d-flex flex-column login-left">
          {/* Top logo */}
          <header className="pt-4 ps-5">
            <div className="d-flex align-items-center">
              <div className="logo-box d-flex align-items-center justify-content-center me-2">
                <span className="logo-dot" />
              </div>
              <span className="fw-semibold small text-secondary">
                Student LMS Project
              </span>
            </div>
          </header>

          {/* Center form */}
          <main className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="login-card w-100">
              <h3 className="text-center mb-2 fw-semibold">Account Log In</h3>
              <p className="text-center text-muted mb-4 small letter-space">
                PLEASE LOGIN TO CONTINUE TO YOUR ACCOUNT
              </p>

              <form onSubmit={submit} autoComplete="off">
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label small text-muted mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg rounded-0"
                    placeholder="Username"
                    onChange={(e) => {setData('username',e.target.value)}}
                  />
                </div>

                {/* Password */}
                <div className="mb-3 position-relative">
                  <label className="form-label small text-muted mb-1">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control form-control-lg rounded-0"
                      placeholder="Password"
                      
                      onChange={(e)=>{setData('password', e.target.value)}}
                    />

                    
                    <span className="input-group-text rounded-0 bg-white border-start-0 eye-icon">
                      <i className="bi bi-eye" />
                    </span>
                  </div>
                </div>

                {/* Remember and forgot */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      defaultChecked
                    />
                    <label
                      className="form-check-label small text-muted"
                      htmlFor="rememberMe"
                    >
                      Remember Me
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0 small text-muted text-decoration-none"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary btn-login w-100 py-2 fw-semibold"
                >
                  LOG IN
                </button>
              </form>
            </div>
          </main>

          {/* Footer */}
          <footer className="pb-3 text-center small text-muted">
            © 2021 - 2025 All Rights Reserved, Opay
          </footer>
        </div>

        {/* Right side – illustration */}
        <div className="col-lg-4 d-none d-lg-flex align-items-center justify-content-center login-right">
          <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
            {/* Simple laptop illustration */}
            <div className="laptop-body mb-2" />
            <div className="laptop-base" />

            {/* Dots under laptop */}
            <div className="mt-3 d-flex gap-2">
              <span className="dot dot-active" />
              <span className="dot" />
              <span className="dot" />
            </div>

            {/* Designed by text */}
            <div className="position-absolute bottom-0 pb-4 text-center text-white small">
              <div className="quote-mark mb-1">“</div>
              <div>Designed by,</div>
              <div className="fw-semibold">M. Ahmed N.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;