import { useState } from 'react'

import { useAuth } from '../../hooks/useAuth'

export function LoginForm({ role = 'STAFF', onSuccess }) {
	const { signIn } = useAuth()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		setError('')
		setIsSubmitting(true)
		try {
			const user = await signIn({ username, password, role })
			onSuccess(user)
		} catch (requestError) {
			setError(requestError.message || 'Unable to sign in. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<label htmlFor="username">Username or email</label>
			<input id="username" value={username} onChange={(event) => setUsername(event.target.value)} required autoComplete="username" />
			<label htmlFor="password">Password</label>
			<input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
			{error && <p className="form-error" role="alert">{error}</p>}
			<button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Sign in'}</button>
		</form>
	)
}