<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="brand">FolkMuse+</router-link>
      <div class="nav-links">
        <router-link v-for="link in links" :key="link.path" :to="link.path" class="nav-link">
          {{ link.name }}
        </router-link>
      </div>
      <button class="mobile-menu-button" @click="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="mobile-menu" :class="{ 'open': isMenuOpen }">
      <router-link v-for="link in links" :key="link.path" :to="link.path" class="mobile-nav-link" @click="toggleMenu">
        {{ link.name }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const links = [
  { path: '/albums', name: 'Albums' },
  { path: '/albums/favorites', name: 'Favorites' },
  { path: '/community', name: 'Forum' },
  { path: '/leaderboard', name: 'Leaderboard' },
  { path: '/profile', name: 'Profile' },
  { path: '/history', name: 'History' },
  { path: '/register', name: 'Register' },
  { path: '/login', name: 'Login' }
];

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: #b99b68;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #b99b68;
}

.nav-link.router-link-active {
  color: #b99b68;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #b99b68;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  background: white;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.mobile-menu.open {
  display: flex;
}

.mobile-nav-link {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #555;
  border-bottom: 1px solid #eee;
}

.mobile-nav-link:last-child {
  border-bottom: none;
}

.mobile-nav-link.router-link-active {
  color: #b99b68;
  font-weight: 500;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-button {
    display: block;
  }
  
  .navbar-container {
    padding: 1rem;
  }
}
</style>