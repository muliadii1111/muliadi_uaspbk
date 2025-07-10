<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>Selamat Datang</h1>
        <p>Masuk ke akun FolkMuse+ Anda</p>
      </div>
      
      <form @submit.prevent="login" class="auth-form">
        <div class="form-group">
          <label for="email">Alamat Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="contoh@email.com"
            required
          />
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Masukkan password"
            required
          />
          <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Ingat saya</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">Lupa password?</router-link>
        </div>
        
        <button type="submit" class="btn-submit">
          <span v-if="!isLoading">Masuk</span>
          <span v-else class="loading-text">Memproses...</span>
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Belum punya akun? <router-link to="/register">Daftar sekarang</router-link></p>
        
        <div class="social-login">
          <p>Atau masuk dengan:</p>
          <div class="social-buttons">
            <button class="social-btn google">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21.8 12.18c0-.57-.05-1.14-.15-1.7H12v3.24h5.5c-.21 1.1-.84 2.05-1.8 2.68v2.26h2.92c1.71-1.57 2.7-3.89 2.7-6.48z"></path>
                <path d="M12 22c2.43 0 4.47-.8 5.96-2.18h-2.92c-.8.54-1.82.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H3.96v2.33C5.45 20.2 8.48 22 12 22z"></path>
                <path d="M6.98 13.9c-.17-.54-.27-1.11-.27-1.7s.1-1.16.27-1.7V8.17H3.96C3.34 9.45 3 10.92 3 12.5s.34 3.05.96 4.33l3.02-2.33z"></path>
                <path d="M12 6.38c1.32 0 2.5.45 3.42 1.26l2.56-2.56C16.47 3.8 14.43 3 12 3 8.48 3 5.45 4.8 3.96 7.17l3.02 2.33c.7-2.12 2.68-3.7 5.02-3.7z"></path>
              </svg>
              Google
            </button>
            <button class="social-btn facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="auth-decoration">
      <div class="decoration-circle">
        <img src="@/assets/1.jpg" alt="Music decoration" class="music-image" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)
const router = useRouter()
const userStore = useUserStore()

function login() {
  if (email.value && password.value) {
    isLoading.value = true
    // Simulate API call
    setTimeout(() => {
      userStore.login({ name: 'Demo User', email: email.value })
      router.push('/')
      isLoading.value = false
    }, 1500)
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
  background: #f9f5f0;
}

.auth-container {
  flex: 1;
  max-width: 500px;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.auth-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #666;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #444;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #b99b68;
  box-shadow: 0 0 0 3px rgba(185, 155, 104, 0.2);
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  cursor: pointer;
}

.remember-me input {
  width: auto;
}

.forgot-password {
  color: #b99b68;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-submit {
  padding: 1rem;
  background: #b99b68;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  background: #a58a5d;
  transform: translateY(-2px);
}

.loading-text {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-text::after {
  content: "";
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: #b99b68;
  font-weight: 500;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

.social-login {
  margin-top: 2rem;
}

.social-login p {
  position: relative;
  margin: 1.5rem 0;
  color: #888;
}

.social-login p::before,
.social-login p::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #ddd;
}

.social-login p::before {
  left: 0;
}

.social-login p::after {
  right: 0;
}

.social-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.social-btn.google:hover {
  border-color: #db4437;
  color: #db4437;
}

.social-btn.facebook:hover {
  border-color: #4267B2;
  color: #4267B2;
}

.auth-decoration {
  flex: 1;
  background: linear-gradient(135deg, #f0e6d6, #e8d8b5);
  position: relative;
  display: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 10px solid rgba(255, 255, 255, 0.3);
}

.music-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@media (min-width: 992px) {
  .auth-decoration {
    display: block;
  }
}

@media (max-width: 768px) {
  .auth-container {
    padding: 2rem 1.5rem;
    margin: 0 auto;
    max-width: 100%;
    width: 100%;
  }
  
  .social-buttons {
    flex-direction: column;
  }
  
  .social-btn {
    justify-content: center;
  }
}
</style>