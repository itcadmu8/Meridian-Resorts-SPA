/**
 * @file GuestRegistration.tsx
 * @description Page view component for GuestRegistration.
 */
import React, { useState } from 'react';

export default function GuestRegistration({ onNavigate }: { onNavigate: (path: string) => void }) {
  const redirect = new URLSearchParams(window.location.search).get('redirect') || '/booking';
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '', phone: '', country: '', dob: '' });
  const [error, setError] = useState('');

  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirm) return setError('Please complete all required fields.');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    const accounts = JSON.parse(localStorage.getItem('meridian_guest_accounts') || '{}');
    if (accounts[form.email]) return setError('An account already exists for this email.');
    accounts[form.email] = { ...form, username: form.email };
    localStorage.setItem('meridian_guest_accounts', JSON.stringify(accounts));
    window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}&registered=1`);
  };

  return <main className="guest-auth-page"><div className="guest-auth-art"><div><span>MERIDIAN RESORTS &amp; SPAS</span><h1>Begin Your Meridian Journey</h1><p>Create your guest account to manage stays, preferences and experiences across Meridian Resorts &amp; Spas.</p></div></div><form className="guest-auth-card" onSubmit={submit}><button type="button" className="guest-auth-brand" onClick={() => window.location.assign('/guest')}>MERIDIAN <small>RESORTS &amp; SPAS</small></button><p className="guest-auth-eyebrow">Guest registration</p><h2>Create your account</h2><p className="guest-auth-copy">A more personal stay begins here.</p><div className="guest-form-grid"><Field label="First Name" value={form.firstName} onChange={(v) => update('firstName', v)} required /><Field label="Last Name" value={form.lastName} onChange={(v) => update('lastName', v)} required /><Field label="Email Address" type="email" value={form.email} onChange={(v) => update('email', v)} required /><Field label="Phone Number" value={form.phone} onChange={(v) => update('phone', v)} /><Field label="Country" value={form.country} onChange={(v) => update('country', v)} /><Field label="Date of Birth" type="date" value={form.dob} onChange={(v) => update('dob', v)} /><Field label="Password" type="password" value={form.password} onChange={(v) => update('password', v)} required /><Field label="Confirm Password" type="password" value={form.confirm} onChange={(v) => update('confirm', v)} required /></div>{error && <p className="guest-form-error">{error}</p>}<button className="guest-auth-submit" type="submit">Create Account</button><p className="guest-auth-switch">Already have an account? <button type="button" onClick={() => window.location.assign(`/login?redirect=${encodeURIComponent(redirect)}`)}>Sign in</button></p></form></main>;
}

function Field({ label, type = 'text', value, onChange, required = false }: { label: string; type?: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return <label className="guest-form-field"><span>{label}{required ? ' *' : ''}</span><input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
