// Meridian Guest Home (Section 4.1/4.2): public, static resort information plus
// the "Ask Meridian AI" entry point. An unauthenticated click redirects to
// Guest Login rather than calling the AI API (Section 4.3/9.1).
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

const GUEST_HOME_STYLES = `
@import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap");

.guest-home,
.guest-home * {
	box-sizing: border-box;
	letter-spacing: 0;
}

.guest-home {
	--gh-ink: #2c2015;
	--gh-muted: #7a6b58;
	--gh-line: #e6d9c4;
	--gh-paper: #fffaf1;
	--gh-canvas: #f6ecd8;
	--gh-teal: #2f5d55;
	--gh-gold: #b9772e;
	--gh-coral: #bd583f;
	min-height: 100vh;
	color: var(--gh-ink);
	background: var(--gh-canvas);
	font-family: Manrope, "Avenir Next", sans-serif;
	line-height: 1.5;
}

.guest-home-shell {
	max-width: 1180px;
	margin: 0 auto;
	padding: 0 28px 90px;
}

.guest-home-topbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 22px 0;
	border-bottom: 1px solid var(--gh-line);
}

.guest-home-brand {
	margin: 0;
	font-size: 15px;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.06em;
}

.guest-home-topbar-actions {
	display: flex;
	align-items: center;
	gap: 12px;
}

.guest-home-identity {
	color: var(--gh-muted);
	font-family: "DM Mono", monospace;
	font-size: 12px;
	text-transform: uppercase;
}

.guest-home-link,
.guest-home-button {
	height: 38px;
	padding: 0 16px;
	display: inline-flex;
	align-items: center;
	border: 1px solid var(--gh-ink);
	border-radius: 999px;
	color: var(--gh-ink);
	background: transparent;
	cursor: pointer;
	font: inherit;
	font-size: 13px;
	font-weight: 700;
	text-decoration: none;
}

.guest-home-link:hover,
.guest-home-button:hover {
	color: var(--gh-paper);
	background: var(--gh-ink);
}

.guest-home-hero {
	padding: 56px 0 40px;
	text-align: left;
}

.guest-home-kicker {
	margin: 0 0 12px;
	color: var(--gh-gold);
	font-family: "DM Mono", monospace;
	font-size: 12px;
	font-weight: 500;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.guest-home-title {
	max-width: 720px;
	margin: 0 0 16px;
	font-size: 42px;
	font-weight: 800;
	line-height: 1.1;
}

.guest-home-lede {
	max-width: 560px;
	margin: 0;
	color: var(--gh-muted);
	font-size: 16px;
}

.guest-home-section {
	padding: 34px 0;
	border-top: 1px solid var(--gh-line);
}

.guest-home-section-heading h2 {
	margin: 0 0 6px;
	font-size: 21px;
	font-weight: 800;
}

.guest-home-section-heading p {
	margin: 0 0 22px;
	color: var(--gh-muted);
	font-size: 14px;
	max-width: 560px;
}

.guest-home-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 16px;
}

.guest-home-card {
	padding: 20px;
	border: 1px solid var(--gh-line);
	border-radius: 10px;
	background: var(--gh-paper);
}

.guest-home-card h3 {
	margin: 0 0 6px;
	font-size: 15px;
	font-weight: 700;
}

.guest-home-card p {
	margin: 0;
	color: var(--gh-muted);
	font-size: 13px;
}

.guest-home-card-tag {
	display: inline-block;
	margin-bottom: 10px;
	padding: 3px 9px;
	border-radius: 999px;
	color: var(--gh-teal);
	background: rgba(47, 93, 85, 0.1);
	font-family: "DM Mono", monospace;
	font-size: 10px;
	font-weight: 600;
	text-transform: uppercase;
}

.guest-home-loyalty {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 14px;
}

.guest-home-loyalty-tier {
	padding: 16px;
	border: 1px solid var(--gh-line);
	border-radius: 10px;
	background: var(--gh-paper);
	text-align: center;
}

.guest-home-loyalty-tier strong {
	display: block;
	margin-bottom: 4px;
	font-size: 14px;
}

.guest-home-loyalty-tier span {
	color: var(--gh-muted);
	font-size: 12px;
}

.guest-home-ai-launcher {
	position: fixed;
	right: 26px;
	bottom: 26px;
	z-index: 20;
	height: 52px;
	padding: 0 22px;
	display: inline-flex;
	align-items: center;
	gap: 10px;
	border: none;
	border-radius: 999px;
	color: var(--gh-paper);
	background: var(--gh-teal);
	box-shadow: 0 16px 30px rgba(47, 93, 85, 0.35);
	cursor: pointer;
	font: inherit;
	font-size: 14px;
	font-weight: 700;
}

.guest-home-ai-launcher:hover {
	background: var(--gh-gold);
}

.guest-home-ai-panel {
	position: fixed;
	right: 26px;
	bottom: 90px;
	z-index: 20;
	width: min(340px, calc(100vw - 52px));
	padding: 20px;
	border: 1px solid var(--gh-line);
	border-radius: 14px;
	background: var(--gh-paper);
	box-shadow: 0 24px 50px rgba(44, 32, 21, 0.2);
}

.guest-home-ai-panel h3 {
	margin: 0 0 8px;
	font-size: 15px;
	font-weight: 800;
}

.guest-home-ai-panel p {
	margin: 0 0 4px;
	color: var(--gh-muted);
	font-size: 13px;
}

.guest-home-ai-close {
	position: absolute;
	top: 14px;
	right: 16px;
	border: none;
	background: none;
	color: var(--gh-muted);
	cursor: pointer;
	font-size: 13px;
	font-weight: 700;
}

.guest-home-footer {
	margin-top: 20px;
	padding-top: 24px;
	border-top: 1px solid var(--gh-line);
	color: var(--gh-muted);
	font-size: 12px;
	display: flex;
	justify-content: space-between;
	gap: 12px;
	flex-wrap: wrap;
}

.guest-home-footer a {
	color: inherit;
}

@media (max-width: 860px) {
	.guest-home-grid,
	.guest-home-loyalty {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.guest-home-title {
		font-size: 32px;
	}
}

@media (max-width: 560px) {
	.guest-home-grid,
	.guest-home-loyalty {
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
	{ name: 'Standard', perk: 'Member rates chain-wide' },
	{ name: 'Silver', perk: 'Late checkout on request' },
	{ name: 'Gold', perk: 'Complimentary spa upgrade' },
	{ name: 'Platinum', perk: 'Suite upgrades + airport transfer' },
]

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
			navigate('/guest/login', { state: { from: location } })
			return
		}
		setIsAiOpen((open) => !open)
	}

	return (
		<main className="guest-home">
			<style>{GUEST_HOME_STYLES}</style>
			<div className="guest-home-shell">
				<header className="guest-home-topbar">
					<p className="guest-home-brand">Meridian Resorts &amp; Spa</p>
					<div className="guest-home-topbar-actions">
						{isAuthenticated ? (
							<>
								<span className="guest-home-identity">{username}</span>
								<button className="guest-home-button" type="button" onClick={logout}>
									Sign out
								</button>
							</>
						) : (
							<Link className="guest-home-link" to="/guest/login">
								Guest sign in
							</Link>
						)}
					</div>
				</header>

				<section className="guest-home-hero">
					<p className="guest-home-kicker">Six properties, one Meridian experience</p>
					<h1 className="guest-home-title">
						Beach, mountain and safari resorts, spa calendars and dining, all in one place.
					</h1>
					<p className="guest-home-lede">
						Explore Meridian&rsquo;s properties, spa treatments and dining outlets, then sign in as
						a guest to chat with Ask Meridian AI for personalized recommendations and spa
						bookings.
					</p>
				</section>

				<section className="guest-home-section" aria-labelledby="guest-home-properties">
					<div className="guest-home-section-heading">
						<h2 id="guest-home-properties">Our properties</h2>
						<p>Six resorts across Kenya&rsquo;s coast, highlands and savannah.</p>
					</div>
					<div className="guest-home-grid">
						{PROPERTIES.map((property) => (
							<article className="guest-home-card" key={property.name}>
								<span className="guest-home-card-tag">{property.tag}</span>
								<h3>{property.name}</h3>
								<p>
									{property.location} &mdash; {property.blurb}
								</p>
							</article>
						))}
					</div>
				</section>

				<section className="guest-home-section" aria-labelledby="guest-home-spa">
					<div className="guest-home-section-heading">
						<h2 id="guest-home-spa">Spa &amp; wellness</h2>
						<p>Signature massages, facials and thermal circuits at every property.</p>
					</div>
					<div className="guest-home-grid">
						<article className="guest-home-card">
							<h3>Deep Tissue Massage</h3>
							<p>60/90 minute sessions with our resident therapists.</p>
						</article>
						<article className="guest-home-card">
							<h3>Coastal Glow Facial</h3>
							<p>A hydrating, sun-recovery facial using local botanicals.</p>
						</article>
						<article className="guest-home-card">
							<h3>Hot Stone Therapy</h3>
							<p>Full-body warmth therapy, best booked after a long travel day.</p>
						</article>
					</div>
				</section>

				<section className="guest-home-section" aria-labelledby="guest-home-dining">
					<div className="guest-home-section-heading">
						<h2 id="guest-home-dining">Dining</h2>
						<p>From beachfront grills to highland tasting menus.</p>
					</div>
					<div className="guest-home-grid">
						<article className="guest-home-card">
							<h3>All-day dining</h3>
							<p>Breakfast, lunch and dinner covers at every property&rsquo;s main restaurant.</p>
						</article>
						<article className="guest-home-card">
							<h3>Sunset dining</h3>
							<p>Reserved terrace and beach tables for sunset seatings.</p>
						</article>
						<article className="guest-home-card">
							<h3>In-room dining</h3>
							<p>A full menu available around the clock.</p>
						</article>
					</div>
				</section>

				<section className="guest-home-section" aria-labelledby="guest-home-loyalty">
					<div className="guest-home-section-heading">
						<h2 id="guest-home-loyalty">Loyalty tiers</h2>
						<p>Benefits grow the more you stay with Meridian.</p>
					</div>
					<div className="guest-home-loyalty">
						{LOYALTY_TIERS.map((tier) => (
							<div className="guest-home-loyalty-tier" key={tier.name}>
								<strong>{tier.name}</strong>
								<span>{tier.perk}</span>
							</div>
						))}
					</div>
				</section>

				<footer className="guest-home-footer">
					<span>&copy; Meridian Resorts &amp; Spa</span>
					<Link to="/staff/login">Staff sign in</Link>
				</footer>
			</div>

			<button
				className="guest-home-ai-launcher"
				type="button"
				onClick={handleAiLauncherClick}
				aria-expanded={isAiOpen}
			>
				Ask Meridian AI
			</button>

			{isAiOpen ? (
				<div className="guest-home-ai-panel" role="dialog" aria-label="Ask Meridian AI">
					<button
						className="guest-home-ai-close"
						type="button"
						onClick={() => setIsAiOpen(false)}
						aria-label="Close Ask Meridian AI"
					>
						Close
					</button>
					<h3>Ask Meridian AI</h3>
					<p>Signed in as {username}.</p>
					<p>Spa and dining chat, plus guided booking, arrives with the Sprint 3 assistant.</p>
				</div>
			) : null}
		</main>
	)
}

export default MeridianGuestHome
