import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Buat instance Pinia
const pinia = createPinia()

// Buat aplikasi Vue
const app = createApp(App)

// Gunakan Pinia dan router
app.use(pinia)
app.use(router)

// Mount aplikasi
app.mount('#app')

