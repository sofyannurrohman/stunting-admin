import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    isAuthenticated: !!localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  actions: {
    async loginUser(payload: { email: string; password: string }) {
      const res = await login(payload)
      const { access_token, user } = res.data
      this.token = access_token
      this.user = user
      this.isAuthenticated = true

      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(user))

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    },
    logout() {
      this.token = ''
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
