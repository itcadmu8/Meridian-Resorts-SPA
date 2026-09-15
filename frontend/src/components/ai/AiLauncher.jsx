function AiLauncher({ isOpen, onClick }) {
	return (
		<button
			className="guest-home-ai-launcher"
			type="button"
			onClick={onClick}
			aria-expanded={isOpen}
		>
			Ask Meridian AI
		</button>
	)
}

export default AiLauncher