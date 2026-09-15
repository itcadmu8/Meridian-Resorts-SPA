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
		if (!window.localStorage.getItem('meridian_access_token')) return undefined

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
		const session = await login(credentials)
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