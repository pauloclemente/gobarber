import AsyncStorare from '@react-native-community/async-storage'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import api from '../services/api'
interface IUser {
  id: string
  name: string
  email: string
  avatar_url: string
}
interface ISignInCredendials {
  email: string
  password: string
}
interface IAuthState {
  token: string
  user: IUser
}
interface IAuthContextDTO {
  loading: boolean
  user: IUser
  signIn(credencials: ISignInCredendials): Promise<void>
  signOut(): void
}
const AuthContext = createContext<IAuthContextDTO>({} as IAuthContextDTO)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IAuthState>({} as IAuthState)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorare.multiGet([
        '@GoBarber:token',
        '@GoBarber:user'
      ])

      if (token[1] && user[1]) {
        api.defaults.headers.authorization = `Bearer ${token[1]}`

        setData({ token: token[1], user: JSON.parse(user[1]) })
      }
      setLoading(false)
    }
    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password })
    const { token, user } = response.data
    await AsyncStorare.multiSet([
      ['@GoBarber:token', token],
      ['@GoBarber:user', JSON.stringify(user)]
    ])
    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token, user })
  }, [])
  const signOut = useCallback(async () => {
    await AsyncStorare.multiRemove(['@GoBarber:token', '@GoBarber:user'])
    setData({} as IAuthState)
  }, [])
  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
function useAuth(): IAuthContextDTO {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
