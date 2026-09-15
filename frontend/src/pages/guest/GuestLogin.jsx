import { LoginForm } from '../../components/auth/LoginForm'

export default function GuestLogin({ onNavigate }) {
	function handleSuccess() {
		window.localStorage.setItem('open_ai_after_login', 'true')
				onNavigate('/guest')
	}

	return (
		<main className="login-page">
			<header className="login-header">
				<button type="button" onClick={() => onNavigate('/')}>Meridian Resorts &amp; Spa</button>
				<button type="button" onClick={() => onNavigate('/')}>Back to resort home</button>
			</header>
			<section className="login-panel">
				<p className="eyebrow">Guest portal access</p>
				<h1>Welcome to Meridian</h1>
				<p>Sign in to access personalized concierge guidance and spa booking.</p>
				<LoginForm role="GUEST" onSuccess={handleSuccess} />
				<button className="text-link" type="button" onClick={() => onNavigate('/staff/login')}>Staff login</button>
			</section>
		</main>
	)
}