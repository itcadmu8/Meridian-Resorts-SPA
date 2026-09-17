/**
 * @file StaffLogin.jsx
 * @description Page view component for StaffLogin.
 */
import { LoginForm } from '../../components/auth/LoginForm'

export default function StaffLogin({ onNavigate }) {
	return (
		<main className="login-page">
			<header className="login-header">
				<button type="button" onClick={() => onNavigate('/')}>Meridian Resorts &amp; Spa</button>
				<button type="button" onClick={() => onNavigate('/')}>Guest home</button>
			</header>
			<section className="login-panel">
				<p className="eyebrow">Internal resort operations</p>
				<h1>Staff portal</h1>
				<p>Sign in to manage arrivals, spa scheduling, and F&amp;B operations.</p>
				<LoginForm role="STAFF" onSuccess={() => onNavigate('/staff/dashboard')} />
				<button className="text-link" type="button" onClick={() => onNavigate('/guest/login')}>Guest login</button>
			</section>
		</main>
	)
}