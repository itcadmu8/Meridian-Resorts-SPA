import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'

import { getCurrentUser, login, logout as requestLogout } from '../api/authApi'

const AuthContext = createContext(null)

function readStoredUser() {
	try {
		return JSON.parse(window.localStorage.getItem('meridian_user') || 'null')
	} catch {
		return null
	}
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(readStoredUser)
	const [isLoading, setIsLoading] = useState(Boolean(window.localStorage.getItem('meridian_access_token')))

	useEffect(() => {
		const token = window.localStorage.getItem('meridian_access_token')
		if (!token) return undefined
		if (token.startsWith('local-guest-')) {
			setIsLoading(false)
			return undefined
		}

		getCurrentUser()
			.then((currentUser) => {
				setUser(currentUser)
				window.localStorage.setItem('meridian_user', JSON.stringify(currentUser))
			})
			.catch(() => {
				window.localStorage.removeItem('meridian_access_token')
				window.localStorage.removeItem('meridian_user')
				setUser(null)
			})
			.finally(() => setIsLoading(false))

		return undefined
	}, [])

	async function signIn(credentials) {
		let session
		try {
			session = await login(credentials)
		} catch (error) {
			if (credentials.role !== 'GUEST') throw error
			const accounts = JSON.parse(window.localStorage.getItem('meridian_guest_accounts') || '{}')
			const account = accounts[credentials.username]
			if (!account || account.password !== credentials.password) throw error
			session = { user: { id: `GUEST-${credentials.username}`, username: credentials.username, role: 'GUEST', is_active: true }, access_token: `local-guest-${credentials.username}` }
		}
		const accessToken = session.access_token || session.token
		const nextUser = session.user || session

		if (accessToken) window.localStorage.setItem('meridian_access_token', accessToken)
		window.localStorage.setItem('meridian_user', JSON.stringify(nextUser))
		setUser(nextUser)
		return nextUser
	}

	async function signOut() {
		await requestLogout()
		setUser(null)
	}

	const value = useMemo(() => ({
		user,
		isLoading,
		isAuthenticated: Boolean(user),
		username: user?.username || user?.email || '',
		signIn,
		logout: signOut,
	}), [isLoading, user])

	return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within an AuthProvider')
	return context
}