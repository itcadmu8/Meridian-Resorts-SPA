// Meridian Guest Home: public resort information plus the "Ask Meridian AI" entry point.
// UI styled in complete harmony with the Meridian operations dashboard & design system.
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import AiChatWidget from '../../components/ai/AiChatWidget'
import AiLauncher from '../../components/ai/AiLauncher'
import { useAuth } from '../../hooks/useAuth'

const GUEST_HOME_STYLES = `
.guest-home {
	min-height: 100vh;
	background: #f4f6f5;
	color: #17201f;
	font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

.guest-home-topbar {
	background: #ffffff;
	border-bottom: 1px solid #d3e4e6;
	padding: 14px 36px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
}

.guest-home-brand {
	display: flex;
	align-items: center;
	gap: 12px;
	text-decoration: none;
	color: inherit;
}

.guest-home-brand-mark {
	display: grid;
	place-items: center;
	width: 34px;
	height: 34px;
	border-radius: 9px;
	background: #176b63;
	color: #ffffff;
	font-size: 22px;
	font-weight: 700;
}

.guest-home-brand-text strong {
	display: block;
	font-size: 14px;
	font-weight: 800;
	letter-spacing: 0.14em;
	color: #163d4a;
}

.guest-home-brand-text small {
	display: block;
	color: #496a73;
	font-size: 10px;
	letter-spacing: 0.14em;
	margin-top: 2px;
}

.guest-home-nav-links {
	display: flex;
	align-items: center;
	gap: 24px;
}

.guest-home-nav-links a {
	color: #496a73;
	font-size: 13px;
	font-weight: 500;
	text-decoration: none;
	transition: color 0.15s ease;
}

.guest-home-nav-links a:hover {
	color: #176b63;
}

.guest-home-topbar-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.guest-home-user-pill {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 6px 12px;
	border-radius: 7px;
	background: #eaf5f6;
	border: 1px solid #d3e4e6;
	font-size: 12px;
	color: #163d4a;
}

.guest-home-user-badge {
	padding: 3px 6px;
	border-radius: 4px;
	background: #176b63;
	color: #ffffff;
	font-size: 10px;
	font-weight: 700;
}

.guest-home-btn-primary {
	border: 0;
	border-radius: 8px;
	padding: 9px 16px;
	color: #ffffff;
	background: #176b63;
	font-size: 12px;
	font-weight: 600;
	text-decoration: none;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 6px;
	transition: background 0.15s ease;
}

.guest-home-btn-primary:hover {
	background: #125650;
}

.guest-home-btn-secondary {
	border: 1px solid #d5dfdc;
	border-radius: 8px;
	padding: 8px 14px;
	color: #163d4a;
	background: #ffffff;
	font-size: 12px;
	font-weight: 600;
	text-decoration: none;
	cursor: pointer;
	transition: background 0.15s ease;
}

.guest-home-btn-secondary:hover {
	background: #f0f4f3;
}

.guest-home-hero {
	min-height: 135px;
	padding: 28px 36px;
	color: white;
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: linear-gradient(90deg, rgba(14,38,35,.88), rgba(23,107,99,.54)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80') center/cover;
}

.guest-home-hero h1 {
	margin: 0;
	color: #fff;
	font-size: 25px;
	font-weight: 700;
}

.guest-home-hero p {
	margin: 6px 0 0;
	color: #e8f2f0;
	font-size: 13px;
	max-width: 680px;
}

.guest-home-hero-badge {
	display: flex;
	gap: 10px;
	align-items: center;
	padding: 8px 12px;
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: 7px;
	background: rgba(0, 0, 0, 0.3);
	font-size: 12px;
	color: #ffffff;
}

.guest-home-hero-badge span {
	padding: 4px 6px;
	color: #12221f;
	background: #6ee7b7;
	border-radius: 4px;
	font-weight: 700;
	font-size: 11px;
}

.guest-home-content {
	max-width: 1280px;
	margin: auto;
	padding: 28px 36px 48px;
}

.guest-home-breadcrumb {
	color: #687371;
	font-size: 12px;
	margin-bottom: 8px;
}

.guest-home-breadcrumb span {
	color: #176b63;
	font-weight: 600;
}

.guest-home-title-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	gap: 16px;
	margin-bottom: 24px;
}

.guest-home-title-row h2 {
	margin: 0;
	font-size: 27px;
	font-weight: 700;
	color: #17201f;
}

.guest-home-title-row p {
	margin: 6px 0 0;
	color: #687371;
	font-size: 13px;
}

.guest-home-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 18px;
	margin-top: 16px;
}

.guest-property-card {
	background: #ffffff;
	border: 1px solid #d5dfdc;
	border-radius: 8px;
	padding: 18px;
	transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.guest-property-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(23, 32, 31, 0.08);
}

.guest-property-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
}

.guest-property-card h3 {
	margin: 0 0 6px;
	font-size: 15px;
	font-weight: 700;
	color: #163d4a;
}

.guest-property-card p {
	margin: 0;
	color: #687371;
	font-size: 12.5px;
	line-height: 1.5;
}

.guest-item-card {
	background: #ffffff;
	border: 1px solid #d5dfdc;
	border-radius: 8px;
	padding: 16px;
}

.guest-item-card h4 {
	margin: 0 0 6px;
	font-size: 14px;
	font-weight: 700;
	color: #163d4a;
}

.guest-item-card p {
	margin: 0;
	color: #687371;
	font-size: 12px;
	line-height: 1.45;
}

.guest-loyalty-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 16px;
	margin-top: 16px;
}

.guest-loyalty-card {
	background: #ffffff;
	border: 1px solid #d5dfdc;
	border-radius: 8px;
	padding: 18px;
	text-align: center;
}

.guest-loyalty-card strong {
	display: block;
	font-size: 16px;
	margin-top: 8px;
	margin-bottom: 4px;
	color: #163d4a;
}

.guest-loyalty-card span {
	color: #687371;
	font-size: 12px;
	line-height: 1.4;
	display: block;
}

.guest-home-ai-launcher {
	position: fixed;
	right: 24px;
	bottom: 24px;
	z-index: 40;
	height: 46px;
	padding: 0 20px;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	border: none;
	border-radius: 999px;
	color: #ffffff;
	background: #176b63;
	box-shadow: 0 8px 24px rgba(23, 107, 99, 0.35);
	cursor: pointer;
	font-family: inherit;
	font-size: 13px;
	font-weight: 700;
	transition: background 0.15s ease, transform 0.15s ease;
}

.guest-home-ai-launcher:hover {
	background: #125650;
	transform: translateY(-1px);
}

.guest-home-ai-panel {
	position: fixed;
	right: 24px;
	bottom: 80px;
	z-index: 40;
	width: min(380px, calc(100vw - 48px));
	padding: 20px;
	border: 1px solid #d5ddda;
	border-radius: 10px;
	background: #ffffff;
	box-shadow: 0 16px 36px rgba(23, 32, 31, 0.16);
}

.guest-home-ai-panel h3 {
	margin: 0 0 4px;
	font-size: 15px;
	font-weight: 800;
	color: #163d4a;
}

.guest-home-ai-panel p {
	margin: 0 0 6px;
	color: #687371;
	font-size: 12px;
}

.guest-home-ai-close {
	position: absolute;
	top: 16px;
	right: 16px;
	border: none;
	background: none;
	color: #687371;
	cursor: pointer;
	font-size: 12px;
	font-weight: 700;
}

.guest-home-ai-close:hover {
	color: #163d4a;
}

.guest-home-footer {
	margin-top: 32px;
	padding-top: 20px;
	border-top: 1px solid #d5ddda;
	color: #687371;
	font-size: 12px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 16px;
	flex-wrap: wrap;
}

.guest-home-footer a {
	color: #176b63;
	font-weight: 600;
	text-decoration: none;
}

.guest-home-footer a:hover {
	text-decoration: underline;
}

@media (max-width: 900px) {
	.guest-home-nav-links {
		display: none;
	}
	.guest-home-topbar,
	.guest-home-hero,
	.guest-home-content {
		padding-left: 20px;
		padding-right: 20px;
	}
	.guest-home-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
	.guest-loyalty-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 640px) {
	.guest-home-title-row {
		flex-direction: column;
		align-items: flex-start;
	}
	.guest-home-hero-badge {
		display: none;
	}
	.guest-home-grid,
	.guest-loyalty-grid {
		grid-template-columns: 1fr;
	}
}
`

const PROPERTIES = [
	{ tag: 'Beach', name: 'Meridian Azure Coast', location: 'Mombasa', blurb: 'Barefoot-luxury beachfront suites with private cabana access.' },
	{ tag: 'Mountain', name: 'Meridian Highland Retreat', location: 'Nanyuki', blurb: 'Forest-view lodges beneath Mount Kenya, built for slow mornings.' },
	{ tag: 'City', name: 'Meridian City Gardens', location: 'Nairobi', blurb: 'A rooftop pool and skyline dining in the heart of the capital.' },
	{ tag: 'Lakeside', name: 'Meridian Lakeview Lodge', location: 'Naivasha', blurb: 'Wake up to flamingos and still water from every terrace.' },
	{ tag: 'Safari', name: 'Meridian Savannah Reserve', location: 'Maasai Mara', blurb: 'Tented suites on the migration route, with a private plunge pool.' },
	{ tag: 'Beach', name: 'Meridian Coral Bay', location: 'Diani', blurb: 'Reef-side snorkeling and sunset dhow cruises, steps from your room.' },
]

const LOYALTY_TIERS = [
	{ name: 'Standard', level: 'Tier 1', tierClass: 'status', perk: 'Member rates chain-wide across all resorts' },
	{ name: 'Silver', level: 'Tier 2', tierClass: 'tier silver', perk: 'Late checkout & room preference on request' },
	{ name: 'Gold', level: 'Tier 3', tierClass: 'tier gold', perk: 'Complimentary spa upgrade & priority dining' },
	{ name: 'Platinum', level: 'Tier 4', tierClass: 'tier platinum', perk: 'Suite upgrades & complimentary airport transfers' },
]

function initials(name = '') {
	return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'GH'
}

function MeridianGuestHome() {
	const { isAuthenticated, username, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const [isAiOpen, setIsAiOpen] = useState(Boolean(location.state?.expandAiWidget))

	useEffect(() => {
		if (location.state?.expandAiWidget) {
			navigate(location.pathname, { replace: true, state: null })
		}
	}, [location.pathname, location.state, navigate])

	function handleAiLauncherClick() {
		if (!isAuthenticated) {
			navigate('/guest/login', { state: { from: location, expandAiWidget: true } })
			return
		}
		setIsAiOpen((open) => !open)
	}

	return (
		<main className="guest-home">
			<style>{GUEST_HOME_STYLES}</style>

			{/* Top Brand Navigation */}
			<header className="guest-home-topbar">
				<Link to="/" className="guest-home-brand">
					<span className="guest-home-brand-mark">≈</span>
					<div className="guest-home-brand-text">
						<strong>MERIDIAN</strong>
						<small>RESORTS &amp; SPA</small>
					</div>
				</Link>

				<nav className="guest-home-nav-links" aria-label="Guest navigation">
					<a href="#properties">Our Properties</a>
					<a href="#spa-wellness">Spa &amp; Wellness</a>
					<a href="#dining">Dining</a>
					<a href="#loyalty">Loyalty Tiers</a>
				</nav>

				<div className="guest-home-topbar-actions">
					{isAuthenticated ? (
						<>
							<div className="guest-home-user-pill">
								<span className="guest-home-user-badge">{initials(username)}</span>
								<strong>{username}</strong>
							</div>
							<button className="guest-home-btn-secondary" type="button" onClick={logout}>
								Sign out
							</button>
						</>
					) : (
						<>
							<Link className="guest-home-btn-secondary" to="/staff/login">
								Staff Portal
							</Link>
							<Link className="guest-home-btn-primary" to="/guest/login">
								Guest sign in
							</Link>
						</>
					)}
				</div>
			</header>

			{/* Signature Hero Banner */}
			<section className="guest-home-hero">
				<div>
					<h1>Good Morning, Welcome to Meridian</h1>
					<p>Beach, mountain and safari resorts, spa calendars and dining, all in one place.</p>
				</div>
				<div className="guest-home-hero-badge">
					<span>6</span>
					<strong>Resorts Active</strong>
				</div>
			</section>

			{/* Main Content Area */}
			<div className="guest-home-content">
				<div className="guest-home-breadcrumb">
					Meridian Hospitality <span>&gt;</span> Guest Portal &amp; Resort Directory
				</div>

				<div className="guest-home-title-row">
					<div>
						<h2>Explore Meridian Resorts</h2>
						<p>Explore Meridian&rsquo;s properties, spa treatments and dining outlets, then chat with Ask Meridian AI.</p>
					</div>
					<button type="button" className="guest-home-btn-primary" onClick={handleAiLauncherClick}>
						Ask Meridian AI
					</button>
				</div>

				{/* KPI Highlights Bar */}
				<section className="stitch-kpis">
					<div>
						<span>Total Properties</span>
						<strong>6</strong>
						<small>Coast, highlands &amp; savannah</small>
					</div>
					<div>
						<span>Wellness &amp; Spas</span>
						<strong>6</strong>
						<small>Signature spa treatments</small>
					</div>
					<div>
						<span>Loyalty Program</span>
						<strong>4 Tiers</strong>
						<small>Exclusive member privileges</small>
					</div>
				</section>

				{/* Properties Grid */}
				<section className="stitch-panel" id="properties" style={{ marginBottom: '18px' }}>
					<div className="panel-heading">
						<h3>Our Properties</h3>
						<span>6 Destinations in Kenya</span>
					</div>
					<div className="guest-home-grid">
						{PROPERTIES.map((property) => (
							<article className="guest-property-card" key={property.name}>
								<div className="guest-property-header">
									<span className="status">{property.tag}</span>
									<span style={{ fontSize: '11px', color: '#176b63', fontWeight: 600 }}>{property.location}</span>
								</div>
								<h3>{property.name}</h3>
								<p>{property.blurb}</p>
							</article>
						))}
					</div>
				</section>

				{/* Spa & Dining Grid */}
				<section className="stitch-chart-grid" style={{ marginBottom: '18px' }}>
					{/* Spa & Wellness Panel */}
					<div className="stitch-panel" id="spa-wellness">
						<div className="panel-heading">
							<h3>Spa &amp; Wellness</h3>
							<span>Signature Treatments</span>
						</div>
						<div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
							<div className="guest-item-card">
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<h4 style={{ margin: 0 }}>Deep Tissue Massage</h4>
									<span className="status">60/90 MIN</span>
								</div>
								<p>Targeted tension-relief sessions led by our resident certified therapists.</p>
							</div>
							<div className="guest-item-card">
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<h4 style={{ margin: 0 }}>Coastal Glow Facial</h4>
									<span className="status">FACIAL</span>
								</div>
								<p>A hydrating, sun-recovery facial using fresh organic botanicals.</p>
							</div>
							<div className="guest-item-card">
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<h4 style={{ margin: 0 }}>Hot Stone Therapy</h4>
									<span className="status">FULL BODY</span>
								</div>
								<p>Restorative thermal warmth therapy, best booked after safari excursions.</p>
							</div>
						</div>
					</div>

					{/* Dining Outlets Panel */}
					<div className="stitch-panel" id="dining">
						<div className="panel-heading">
							<h3>Resort Dining</h3>
							<span>All-Day &amp; Specialty</span>
						</div>
						<div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
							<div className="guest-item-card">
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<h4 style={{ margin: 0 }}>All-day Dining</h4>
									<span className="status">MAIN DINING</span>
								</div>
								<p>Breakfast, lunch and chef-curated dinner covers at every main resort restaurant.</p>
							</div>
							<div className="guest-item-card">
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<h4 style={{ margin: 0 }}>Sunset Dining</h4>
									<span className="status">RESERVED</span>
								</div>
								<p>Private terrace and beachfront tables reserved for evening sunset seatings.</p>
							</div>
							<div className="guest-item-card">
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
									<h4 style={{ margin: 0 }}>In-room Dining</h4>
									<span className="status">24/7 SERVICE</span>
								</div>
								<p>A full gourmet room service menu available around the clock to your suite.</p>
							</div>
						</div>
					</div>
				</section>

				{/* Loyalty Tiers */}
				<section className="stitch-panel" id="loyalty" style={{ marginBottom: '18px' }}>
					<div className="panel-heading">
						<h3>Loyalty Program Tiers</h3>
						<span>Exclusive Member Privileges</span>
					</div>
					<div className="guest-loyalty-grid">
						{LOYALTY_TIERS.map((tier) => (
							<div className="guest-loyalty-card" key={tier.name}>
								<span className={tier.tierClass}>{tier.name.toUpperCase()}</span>
								<strong>{tier.level}</strong>
								<span>{tier.perk}</span>
							</div>
						))}
					</div>
				</section>

				{/* Footer */}
				<footer className="guest-home-footer">
					<span>&copy; 2026 Meridian Resorts &amp; Spa. All rights reserved.</span>
					<div style={{ display: 'flex', gap: '16px' }}>
						<Link to="/guest/login">Guest Portal</Link>
						<Link to="/staff/login">Staff Portal Sign In</Link>
					</div>
				</footer>
			</div>

			<AiLauncher isOpen={isAiOpen} onClick={handleAiLauncherClick} />
			<AiChatWidget isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} username={username} />
		</main>
	)
}

export default MeridianGuestHome
