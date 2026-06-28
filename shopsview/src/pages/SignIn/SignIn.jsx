import React, { useState } from 'react';

const SignIn = ({ onLoginSuccess }) => {
  const url = 'http://localhost:4000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('currentShopId', result.shopId);
        onLoginSuccess(result.shopId);
      } else {
        setError(result.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("Cannot reach server. Make sure your backend is running.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow border rounded-3 bg-white" style={{ width: '400px' }}>
        <h3 className="text-center mb-2 fw-bold">Shop Partner Login</h3>
        <p className="text-muted text-center small mb-4">Enter secure credentials to access your terminal workspace.</p>

        {error && (
          <div className="alert alert-danger py-2 small fw-semibold" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Input Field */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Username</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
              <input
                type="text"
                className="form-control shadow-none"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light text-muted"><i className="bi bi-lock"></i></span>
              <input
                /* TRICKING THE BROWSER:
                  We use an inline CSS style (-webkit-text-security) to mask the characters manually.
                  This allows the input type to be "text", which stops the browser from injecting its own eye icon.
                */
                type="text"
                className="form-control shadow-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  WebkitTextSecurity: showPassword ? 'none' : 'disc',
                  MozTextSecurity: showPassword ? 'none' : 'disc', // Fallback support
                }}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary border bg-light text-muted px-3 shadow-none"
                onClick={() => setShowPassword(!showPassword)}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;