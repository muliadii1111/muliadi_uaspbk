<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <div class="logo-wrapper">
          <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          <h1>FolkMuse+</h1>
        </div>
        <h2>Buat Akun Baru</h2>
        <p>Bergabunglah dengan komunitas pecinta musik tradisional</p>
      </div>

      <form @submit.prevent="register" class="auth-form">
        <!-- [Form fields remain exactly the same as previous version] -->
      </form>

      <div class="auth-footer">
        <p>Sudah punya akun? <router-link to="/login" class="login-link">Masuk di sini</router-link></p>
      </div>
    </div>

    <div class="auth-decoration">
      <div class="decoration-pattern"></div>
      <img src="@/assets/1.jpg" alt="Music decoration" class="music-note" />
      <div class="decoration-text">
        <h3>Temukan Musik Tradisional</h3>
        <p>Bergabung dengan ribuan anggota lainnya untuk melestarikan warisan budaya</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/* [Script remains exactly the same as previous version] */
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
  background-color: #faf9f6; /* Soft beige background */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.auth-container {
  flex: 1;
  max-width: 480px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  color: #c4a484; /* Beige/tan color */
}

.auth-header h1 {
  font-size: 1.8rem;
  color: #5a4a3a; /* Dark beige/brown */
  margin-bottom: 0.5rem;
}

.auth-header h2 {
  font-size: 1.5rem;
  color: #5a4a3a;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #8c7b6b; /* Medium beige/brown */
  font-size: 0.95rem;
}

/* Form elements */
.input-icon {
  color: #a89985; /* Muted beige */
}

input {
  border: 1px solid #d8d2c5; /* Light beige border */
  background-color: #fdfcfb; /* Off-white */
}

input:focus {
  border-color: #c4a484; /* Beige/tan */
  box-shadow: 0 0 0 2px rgba(196, 164, 132, 0.2); /* Beige glow */
}

/* Password strength meter */
.strength-bar.weak {
  background-color: #d4a373; /* Earthy orange-beige */
}

.strength-bar.medium {
  background-color: #bc986a; /* Medium beige */
}

.strength-bar.strong {
  background-color: #8b7862; /* Dark beige */
}

.strength-text {
  color: #d4a373;
}

.strength-bar.medium ~ .strength-text {
  color: #bc986a;
}

.strength-bar.strong ~ .strength-text {
  color: #8b7862;
}

/* Checkbox */
.custom-checkbox {
  border: 1px solid #d8d2c5;
}

.terms-agreement input:checked + .custom-checkbox {
  background-color: #c4a484;
  border-color: #c4a484;
}

/* Buttons */
.btn-submit {
  background-color: #c4a484; /* Beige/tan */
  color: white;
}

.btn-submit:hover {
  background-color: #b39372; /* Darker beige */
}

.btn-submit:disabled {
  background-color: #d8d2c5; /* Light beige-gray */
}

/* Social buttons */
.social-btn {
  border: 1px solid #d8d2c5;
  color: #5a4a3a;
}

.social-btn:hover {
  background-color: #f5f1e9; /* Very light beige */
}

/* Links */
.terms-link, .login-link {
  color: #c4a484;
}

/* Decoration side */
.auth-decoration {
  background: linear-gradient(135deg, #f0e6d2 0%, #e2d5b8 100%); /* Beige gradient */
}

.decoration-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#d8d2c5 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.15;
}

.music-note {
  filter: sepia(0.3) brightness(1.1);
}

.decoration-text {
  color: #5a4a3a;
}

/* Responsive design remains the same */
@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }
  
  .auth-decoration {
    display: none;
  }
  
  .auth-container {
    max-width: 100%;
    padding: 1.5rem;
  }
}

/* [Rest of the styles remain structurally the same as previous version, only color changes] */
</style>