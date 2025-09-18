import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import dayjsplugin from './utils/dayjs'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)
const pinia = createPinia()

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
})

app.use(vuetify)
app.use(dayjsplugin)
app.use(router)
app.use(pinia)

app.mount('#app')
