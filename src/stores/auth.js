import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { username: '...' }
  }),
  actions: {
    login(username) {
      this.user = { username }
      localStorage.setItem('user', JSON.stringify(this.user))
    },
    logout() {
      this.user = null
      localStorage.removeItem('user')
    },
    loadUserFromStorage() {
      const stored = localStorage.getItem('user')
      if (stored) {
        this.user = JSON.parse(stored)
      }
    },
  },
})
