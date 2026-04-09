import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Stethoscope, ArrowRight, Activity, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('patient'); // 'patient' or 'doctor'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorObj, setErrorObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorObj(null);

    try {
      // Offline/LocalTunnel Demo Hackathon bypass
      if (email === 'doctor@aegis.com' && password === 'password123') {
        localStorage.setItem('aegis_token', 'mock_jwt_token_doc');
        localStorage.setItem('aegis_user', JSON.stringify({ firstName: 'Aris', lastName: 'Vance', role: 'doctor' }));
        setLoading(false);
        navigate('/doctor-dashboard');
        return;
      }
      if (email === 'patient@aegis.com' && password === 'password123') {
        localStorage.setItem('aegis_token', 'mock_jwt_token_pat');
        localStorage.setItem('aegis_user', JSON.stringify({ firstName: 'Test', lastName: 'Patient', role: 'patient' }));
        setLoading(false);
        navigate('/patient-dashboard');
        return;
      }

      // Prompt 5: Mapped functional POST Request to custom backend
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
         throw new Error(data.error || "Authentication failed.");
      }

      // Secure JWT Storage
      localStorage.setItem('aegis_token', data.token);
      localStorage.setItem('aegis_user', JSON.stringify(data.user));

      // Global Redirection mapping
      if (data.user.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }

    } catch (err) {
      setErrorObj(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <Activity size={48} className="brand-icon" />
          <h1 className="text-gradient">Aegis Health Analytics</h1>
          <p className="subtitle">Secure JWT Handshake Portal</p>
        </div>

        <div className="role-selector">
          <button 
            type="button"
            className={`role-btn ${role === 'patient' ? 'active' : ''}`}
            onClick={() => setRole('patient')}
          >
            <User size={20} /> Patient Portal
          </button>
          <button 
            type="button"
            className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
            onClick={() => setRole('doctor')}
          >
            <Stethoscope size={20} /> Medical Staff
          </button>
        </div>

        {errorObj && (
           <div className="error-banner mb-4 p-3 bg-red-900/40 border border-red-500 rounded-md text-red-200 text-sm flex items-center gap-2">
             <AlertCircle size={14}/> {errorObj}
           </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>{role === 'doctor' ? 'Medical Email ID' : 'Patient Registration Email'}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`e.g. ${role}@aegis.com`} 
              required 
            />
          </div>
          
          <div className="input-group">
            <label>Secure Passcode</label>
            <div className="password-wrapper">
              <Shield size={18} className="input-icon" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password123" 
                required 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className={`btn btn-primary login-submit ${loading ? 'opacity-50' : ''}`}>
            {loading ? 'Verifying...' : 'Secure Login'} <ArrowRight size={18} />
          </button>
          
          <p className="text-gray-500 text-xs text-center mt-6">Hackathon Node.js Seed Data: <br/> doctor@aegis.com / patient@aegis.com <br/> PW: password123</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
