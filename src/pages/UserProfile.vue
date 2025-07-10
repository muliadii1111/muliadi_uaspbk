<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-avatar-container">
        <img :src="user.avatar" :alt="user.name" class="profile-avatar" />
        <button class="avatar-edit-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
      </div>
      <h1 class="profile-name">{{ user.name }}</h1>
      <p class="profile-email">{{ user.email }}</p>
    </div>
    
    <div class="profile-content">
      <div class="profile-section">
        <h2 class="section-title">Tentang Saya</h2>
        <p class="profile-bio">{{ user.bio }}</p>
        
        <div class="profile-stats">
          <div class="stat-item">
            <div class="stat-value">24</div>
            <div class="stat-label">Album Dimiliki</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">156</div>
            <div class="stat-label">Poin</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">12</div>
            <div class="stat-label">Postingan</div>
          </div>
        </div>
      </div>
      
      <div class="profile-section">
        <h2 class="section-title">Aktivitas Terakhir</h2>
        <div class="activity-list">
          <div class="activity-item" v-for="(activity, index) in activities" :key="index">
            <div class="activity-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="activity.icon"></path>
              </svg>
            </div>
            <div class="activity-details">
              <p class="activity-title">{{ activity.title }}</p>
              <p class="activity-time">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <button class="btn-logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Keluar
      </button>
    </div>
  </div>
</template>

<script setup>
const user = {
  name: 'Nadia Putri',
  email: 'nadia.folk@example.com',
  avatar: 'https://i.pinimg.com/originals/1c/a0/cf/1ca0cf237c34c29c054c2525ca0f84c3.jpg',
  bio: 'Pendengar setia musik folk, penikmat hujan dan aroma kopi pagi. Suka mengeksplorasi album-album indie dan berbagi rekomendasi di komunitas.'
}

const activities = [
  {
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    title: "Membeli album 'Selamat Ulang Tahun'",
    time: "2 jam yang lalu"
  },
  {
    icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    title: "Membuat postingan di forum",
    time: "Kemarin"
  },
  {
    icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    title: "Menambahkan album ke favorit",
    time: "3 hari yang lalu"
  }
]
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.profile-avatar-container {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0e6d6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #b99b68;
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #a58a5d;
  transform: scale(1.1);
}

.profile-name {
  font-size: 1.8rem;
  margin: 0.5rem 0 0.25rem;
  color: #333;
}

.profile-email {
  color: #666;
  margin: 0;
}

.profile-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.profile-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.3rem;
  color: #444;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.profile-bio {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

.stat-item {
  background: #f9f5f0;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #b99b68;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.activity-item:hover {
  background: #f9f5f0;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #f0e6d6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b99b68;
  flex-shrink: 0;
}

.activity-details {
  flex-grow: 1;
}

.activity-title {
  margin: 0 0 0.25rem;
  color: #333;
  font-weight: 500;
}

.activity-time {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}

.btn-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #f9f5f0;
  border: none;
  border-radius: 8px;
  color: #b99b68;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-logout:hover {
  background: #f0e6d6;
  color: #a58a5d;
}

@media (max-width: 768px) {
  .profile-stats {
    grid-template-columns: 1fr;
  }
  
  .profile-content {
    padding: 1.5rem;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
}
</style>