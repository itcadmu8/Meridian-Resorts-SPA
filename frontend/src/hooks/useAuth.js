import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'meridian-auth'
const AUTH_EVENT = 'meridian-auth-updated'

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { token: null, user: null }
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      return { token: null, user: null }
    }
    return {
      token: parsed.token ?? null,
      user: parsed.user ?? null,
    }
  } catch {
    return { token: null, user: null }
  }
}

function writeSession(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(AUTH_EVENT))
}

export function useAuth() {
  const [session, setSession] = useState(readSession)

  useEffect(() => {
    const update = () => setSession(readSession())
    window.addEventListener('storage', update)
    window.addEventListener(AUTH_EVENT, update)
    return () => {
      window.removeEventListener('storage', update)
      window.removeEventListener(AUTH_EVENT, update)
    }
  }, [])

  const loginGuest = useCallback(async ({ email, password }) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required.')
    }
    const next = {
      token: `guest-demo-${Date.now()}`,
      user: {
        id: email.trim().toLowerCase(),
        role: 'guest',
        name: email.trim().split('@')[0],
        email: email.trim().toLowerCase(),
      },
    }
    writeSession(next)
    setSession(next)
    return next
  }, [])

  const loginStaff = useCallback(async ({ email, password }) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required.')
    }
    const next = {
      token: `staff-demo-${Date.now()}`,
      user: {
        id: email.trim().toLowerCase(),
        role: 'staff',
        name: 'Operations Manager',
        email: email.trim().toLowerCase(),
      },
    }
    writeSession(next)
    setSession(next)
    return next
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(AUTH_EVENT))
    setSession({ token: null, user: null })
  }, [])

  return useMemo(() => {
    const isAuthenticated = Boolean(session.token && session.user)
    return {
      token: session.token,
      user: session.user,
      username: session.user?.name ?? '',
      isAuthenticated,
      isGuest: isAuthenticated && session.user?.role === 'guest',
      isStaff: isAuthenticated && session.user?.role === 'staff',
      loginGuest,
      loginStaff,
      logout,
    }
  }, [session, loginGuest, loginStaff, logout])
}

export default useAuth
