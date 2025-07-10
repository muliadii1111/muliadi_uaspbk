<template>
  <div class="leaderboard-page">
    <div class="leaderboard-header">
      <h1>🏆 Papan Peringkat</h1>
      <p>Top member FolkMuse+ bulan ini</p>
    </div>
    
    <div class="time-filters">
      <button 
        v-for="filter in timeFilters" 
        :key="filter.value"
        :class="['time-filter', { 'active': activeFilter === filter.value }]"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>
    
    <div class="leaderboard-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat data...</p>
      </div>
      
      <div v-else class="leaderboard-list">
        <div 
          v-for="(user, index) in sortedUsers" 
          :key="user.id" 
          :class="['user-card', getRankClass(index)]"
        >
          <div class="user-rank">
            <span v-if="index === 0">🥇</span>
            <span v-else-if="index === 1">🥈</span>
            <span v-else-if="index === 2">🥉</span>
            <span v-else>#{{ index + 1 }}</span>
          </div>
          
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name" />
          </div>
          
          <div class="user-info">
            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-title">{{ user.title }}</p>
          </div>
          
          <div class="user-points">
            <span class="points-value">{{ user.points }}</span>
            <span class="points-label">poin</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const activeFilter = ref('monthly')
const loading = ref(true)
const users = ref([])

const timeFilters = [
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'alltime', label: 'Sepanjang Masa' }
]

const sortedUsers = computed(() => {
  return [...users.value].sort((a, b) => b.points - a.points)
})

function getRankClass(index) {
  if (index === 0) return 'rank-first'
  if (index === 1) return 'rank-second'
  if (index === 2) return 'rank-third'
  return ''
}

onMounted(async () => {
  try {
    // Simulate API call
    setTimeout(() => {
      users.value = [
        {
          id: 1,
          name: "Arum Wicaksono",
          title: "Penggemar Folk Senior",
          points: 2450,
          avatar: "https://i.pinimg.com/originals/9b/19/da/9b19dab3e5063e446c7801d3d7d965be.jpg"
        },
        {
          id: 2,
          name: "Fajar Setiawan",
          title: "Kolektor Album",
          points: 1980,
          avatar: "https://i.pinimg.com/originals/1c/d1/25/1cd125af6673d3d1184bfca914aad5f0.jpg"
        },
        {
          id: 3,
          name: "Nadya Putri",
          title: "Reviewer Aktif",
          points: 1750,
          avatar: "https://i.pinimg.com/originals/6b/31/d4/6b31d494a05f9b79cf0b8a2322928d89.jpg"
        },
        {
          id: 4,
          name: "Rafi Birch",
          title: "Pendengar Setia",
          points: 1620,
          avatar: "https://i.pinimg.com/originals/7c/6a/f3/7c6af374c503fcc762ce763626ee95fe.jpg"
        },
        {
          id: 5,
          name: "Dewi Melody",
          title: "Anggota Baru",
          points: 1280,
          avatar: "https://i.pinimg.com/236x/02/61/c3/0261c3c4358b0f901118b564fe0aa3c8.jpg"
        }
      ]
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error("Error fetching leaderboard data:", error)
    loading.value = false
  }
})
</script>

<style scoped>
.leaderboard-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.leaderboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.leaderboard-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.leaderboard-header p {
  color: #666;
  margin: 0;
  font-size: 1.1rem;
}

.time-filters {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.time-filter {
  padding: 0.5rem 1.5rem;
  background: #f5f0e6;
  border: none;
  border-radius: 20px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-filter:hover {
  background: #ede6d6;
  color: #333;
}

.time-filter.active {
  background: #b99b68;
  color: white;
}

.leaderboard-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  gap: 1rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #b99b68;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  display: grid;
  grid-template-columns: auto 60px 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-rank {
  font-size: 1.2rem;
  font-weight: bold;
  color: #b99b68;
  width: 30px;
  text-align: center;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.user-title {
  margin: 0;
  font-size: 0.85rem;
  color: #888;
}

.user-points {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.points-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
}

.points-label {
  font-size: 0.75rem;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.rank-first {
  background: linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,255,255,1) 70%);
  border-left: 4px solid gold;
}

.rank-second {
  background: linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(255,255,255,1) 70%);
  border-left: 4px solid silver;
}

.rank-third {
  background: linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(255,255,255,1) 70%);
  border-left: 4px solid #cd7f32;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .user-card {
    grid-template-columns: auto 50px 1fr auto;
    gap: 1rem;
    padding: 1rem;
  }
  
  .user-rank {
    font-size: 1rem;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
  }
  
  .user-name {
    font-size: 1rem;
  white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  
  .points-value {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .user-card {
    grid-template-columns: auto 1fr;
    grid-template-areas: 
      "rank avatar"
      "info points";
  }
  
  .user-rank {
    grid-area: rank;
    text-align: left;
  }
  
  .user-avatar {
    grid-area: avatar;
    justify-self: end;
  }
  
  .user-info {
    grid-area: info;
  }
  
  .user-points {
    grid-area: points;
    flex-direction: row;
    gap: 0.5rem;
    justify-self: end;
    align-items: center;
  }
}
</style>