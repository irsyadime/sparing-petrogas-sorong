<template>
  <v-container class="login-wrapper">
    <v-card elevation="2" class="d-flex flex-column pa-8 rounded-lg" style="width: 400px">
      <div class="d-flex align-center justify-center">
        <v-card-title class="text-h5">Login</v-card-title>
      </div>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="username"
            label="Username"
            prepend-icon="mdi-account"
            :rules="[(v) => !!v || 'Username wajib diisi']"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            prepend-icon="mdi-lock"
            :rules="[(v) => !!v || 'Password wajib diisi']"
            required
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn
          :disabled="!valid"
          :style="{ backgroundColor: '#61c134', color: 'white' }"
          size="large"
          @click="login"
          >Login</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const form = ref(null)
const valid = ref(false)
const username = ref('')
const password = ref('')
const router = useRouter()
const auth = useAuthStore()

const login = () => {
  if (form.value?.validate()) {
    console.log('Login dengan', username.value, password.value)
    auth.login(username.value)
    // lanjutkan proses login
    router.push('/')
  }
}
</script>

<style scoped>
.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  min-height: 100vh;
  padding: 1rem;
  overflow: hidden;
}
</style>
