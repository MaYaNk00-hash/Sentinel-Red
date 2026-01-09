import type { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth'

const MOCK_USER: User = {
  id: 'user-1',
  name: 'Security Admin',
  email: 'admin@sentinel.ai',
  role: 'admin',
  created_at: new Date().toISOString()
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: MOCK_USER,
      token: 'mock-jwt-token',
      refresh_token: 'mock-refresh-token'
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      user: { ...MOCK_USER, name: data.name, email: data.email },
      token: 'mock-jwt-token',
      refresh_token: 'mock-refresh-token'
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))
  },

  async getCurrentUser(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return MOCK_USER
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  },
}
