import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store';

const fields = [
  { name: 'firstName', label: 'First name', placeholder: 'Enter your first name', type: 'text' },
  { name: 'lastName', label: 'Last name', placeholder: 'Enter your last name', type: 'text' },
  { name: 'email', label: 'Email address', placeholder: 'you@example.com', type: 'email' },
  { name: 'password', label: 'Password', placeholder: 'At least 8 characters', type: 'password' },
];

function Layout({ children }) {
  return (
    <main className="page-shell">
      <aside className="brand-panel">
        <div className="brand-mark" aria-hidden="true"><span /></div>
        <div className="brand-copy">
          <p className="eyebrow">Welcome to</p>
          <h1>Gather<span>.</span></h1>
          <p className="brand-description">A simple place to connect, share, and build something meaningful together.</p>
        </div>
        <div className="aside-note">
          <span className="quote-mark">“</span>
          <p>Great things happen when we gather around good ideas.</p>
        </div>
      </aside>
      <section className="content-panel">{children}</section>
    </main>
  );
}

function AuthRedirect({ children }) {
  const token = useSelector((state) => state.token);
  const location = useLocation();
  if (token && location.pathname === '/') return <Navigate to="/profile" replace />;
  if (!token && location.pathname === '/profile') return <Navigate to="/" replace />;
  return children;
}

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setError('');
  };

  const submit = (event) => {
    event.preventDefault();
    if (Object.values(form).some((value) => !value.trim())) {
      setError('Please complete all fields to continue.');
      return;
    }
    if (form.password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    const user = { ...form };
    delete user.password;
    const token = `${crypto.randomUUID()}-${Date.now()}`;
    dispatch({ type: 'auth/signUp', payload: { user, token } });
    setSuccess('Account created successfully! Taking you to your profile…');
    setTimeout(() => navigate('/profile'), 700);
  };

  return (
    <Layout>
      <div className="form-wrap">
        <div className="mobile-logo"><div className="brand-mark"><span /></div><strong>Gather<span>.</span></strong></div>
        <div className="form-heading">
          <p className="eyebrow accent">Get started</p>
          <h2>Create your account</h2>
          <p>Join a growing community of people making ideas happen.</p>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="field-grid">
            {fields.map((field) => (
              <label className={field.name === 'email' || field.name === 'password' ? 'full-field' : ''} key={field.name}>
                <span>{field.label}</span>
                <input name={field.name} type={field.type} placeholder={field.placeholder} value={form[field.name]} onChange={updateField} autoComplete={field.name === 'password' ? 'new-password' : field.name} />
              </label>
            ))}
          </div>
          {error && <p className="message error" role="alert">{error}</p>}
          {success && <p className="message success" role="status">{success}</p>}
          <button className="primary-button" type="submit">Create account <span aria-hidden="true">↗</span></button>
        </form>
        <p className="terms">By creating an account, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </div>
    </Layout>
  );
}

function Profile() {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) navigate('/', { replace: true });
  }, [user, navigate]);
  if (!user) return null;

  return (
    <Layout>
      <div className="profile-wrap">
        <div className="profile-top"><div className="mobile-logo"><div className="brand-mark"><span /></div><strong>Gather<span>.</span></strong></div><button className="logout-button" onClick={() => { dispatch(logout()); navigate('/'); }}>Log out <span>↗</span></button></div>
        <div className="profile-heading">
          <div className="avatar">{user.firstName[0]}{user.lastName[0]}</div>
          <p className="eyebrow accent">Your profile</p>
          <h2>Welcome, {user.firstName}.</h2>
          <p>Your account is ready. Here’s the information you signed up with.</p>
        </div>
        <div className="details-card">
          <div className="card-label">Account details</div>
          <div className="detail-row"><span>Full name</span><strong>{user.firstName} {user.lastName}</strong></div>
          <div className="detail-row"><span>Email address</span><strong>{user.email}</strong></div>
          <div className="detail-row"><span>Member status</span><strong className="status"><i /> Active</strong></div>
        </div>
      </div>
    </Layout>
  );
}

export default function App() {
  return <AuthRedirect><Routes><Route path="/" element={<Signup />} /><Route path="/profile" element={<Profile />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes></AuthRedirect>;
}
