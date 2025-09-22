import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // { username: '...' }
  }),
  actions: {
    async login(username) {
      this.user = { username }
      localStorage.setItem('user', JSON.stringify(this.user))

      // 🔥 Fetch alarm settings from API
      try {
        const res = await fetch('http://rumot-vps.com:1880/alarm-settings', {
          method: 'GET',
          headers: {
            Authorization: 'test',
          },
        })

        if (!res.ok) throw new Error(`Failed to fetch alarm settings: ${res.statusText}`)
        const result = await res.json()

        // 🔁 Store each device's settings in localStorage
        for (const device_id in result) {
          localStorage.setItem(`alarmSettings:${device_id}`, JSON.stringify(result[device_id]))
        }

        console.log('✅ Alarm settings loaded:', result)
      } catch (err) {
        console.error('❌ Error loading alarm settings:', err)
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('user')
      localStorage.removeItem('lastSensorData')
      localStorage.removeItem('dataHistory:selectedDate')
      localStorage.removeItem('dataHistory:cachedData')
      localStorage.removeItem('dataHistory:selectedDevice')

      // 🔥 Remove all alarmSettings keys
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('alarmSettings:')) {
          localStorage.removeItem(key)
        }
      })

      console.log('🚪 Logged out and cleared alarm settings')
    },

    loadUserFromStorage() {
      const stored = localStorage.getItem('user')
      if (stored) {
        this.user = JSON.parse(stored)
      }
    },
  },
})
