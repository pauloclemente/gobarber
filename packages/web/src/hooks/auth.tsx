import React, { createContext, useCallback, useState, useContext } from 'react'
import api from '../services/api'

interface ISignInCredendials {
  email: string
  password: string
}
interface IUser {
  id: string
  name: string
  email: string
  avatar_url: string
}
interface IAuthState {
  token: string
  user: IUser
}
interface IAuthContextDTO {
  user: IUser
  signIn(credencials: ISignInCredendials): Promise<void>
  signOut(): void
  updateUser(user: IUser): void
}
const AuthContext = createContext<IAuthContextDTO>({} as IAuthContextDTO)
const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token')
    const user = localStorage.getItem('@GoBarber:user')
    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`

      return { token, user: JSON.parse(user) }
    }

    return {} as IAuthState
  })

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password })
    const { token, user } = response.data
    localStorage.setItem('@GoBarber:token', token)
    localStorage.setItem('@GoBarber:user', JSON.stringify(user))

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user })
  }, [])
  const updateUser = useCallback(
    (user: IUser) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user))
      setData({
        token: data.token,
        user
      })
    },
    [setData, data.token]
  )
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')
    setData({} as IAuthState)
  }, [])
  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
function useAuth(): IAuthContextDTO {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }
