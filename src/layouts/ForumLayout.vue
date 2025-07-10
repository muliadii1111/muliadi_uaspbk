<template>
  <div class="forum-layout">
    <div class="forum-nav-container">
      <nav class="forum-nav">
        <router-link 
          v-for="tab in tabs" 
          :key="tab.to"
          :to="tab.to"
          class="nav-tab"
        >
          <span class="tab-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path :d="tab.icon" />
            </svg>
          </span>
          <span class="tab-label">{{ tab.label }}</span>
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </router-link>
      </nav>
    </div>

    <div class="forum-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
const tabs = [
  {
    to: '/community',
    label: 'Forum Umum',
    icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    count: 24
  },
  {
    to: '/community/me',
    label: 'Postinganku',
    icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
    count: 3
  },
  {
    to: '/community/saved',
    label: 'Disimpan',
    icon: 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z'
  }
]
</script>

<style scoped>
.forum-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.forum-nav-container {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.forum-nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 0 1rem;
  overflow-x: auto;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  white-space: nowrap;
  position: relative;
}

.nav-tab:hover {
  color: #8c7263;
}

.tab-icon svg {
  width: 18px;
  height: 18px;
}

.tab-count {
  background: #f0e6d6;
  color: #5e4b3c;
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  margin-left: 0.25rem;
}

.nav-tab.router-link-active {
  color: #8c7263;
  border-bottom-color: #8c7263;
}

.nav-tab.router-link-active .tab-count {
  background: #8c7263;
  color: white;
}

.forum-content {
  flex-grow: 1;
  padding: 2rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .forum-nav {
    padding: 0;
  }
  
  .nav-tab {
    padding: 1rem;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .tab-label {
    font-size: 0.85rem;
  }
  
  .tab-count {
    position: absolute;
    top: 0.25rem;
    right: 0.25rem;
  }
  
  .forum-content {
    padding: 1.5rem 1rem;
  }
}
</style>