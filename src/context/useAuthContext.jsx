import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next'
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_URL_SELLER } from './constants'

const AuthContext = createContext(undefined)
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
const authSessionKey = '_Rasket_AUTH_KEY_'
export function AuthProvider({ children }) {
  const navigate = useNavigate()
  const getSession = () => {
    const fetchedCookie = getCookie(authSessionKey)?.toString()
    if (!fetchedCookie) return
    else return JSON.parse(fetchedCookie)
  }
  const [user, setUser] = useState(getSession())
  const saveSession = (user) => {
    setCookie(authSessionKey, JSON.stringify(user))
    setUser(user)
  }
  const removeSession2 = async () => {
    const res = await axios.post(`${API_URL_SELLER}products/add-product`, {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })

    deleteCookie(authSessionKey)
    setUser(undefined)
    navigate('/auth/sign-in')
  }
  const removeSession = async () => {
    try {
      const res = await axios.get(`${API_URL_SELLER}user/logout`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })

      deleteCookie(authSessionKey);
      setUser(undefined);
      navigate('/auth/sign-in');
    } catch (error) {
      console.error('Error removing session:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: hasCookie(authSessionKey),
        saveSession,
        removeSession,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
