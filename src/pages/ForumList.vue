<template>
  <div class="forum-page">
    <div class="forum-header">
      <h1>Forum Komunitas</h1>
      <div class="forum-actions">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari diskusi..."
            class="search-input"
          />
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <router-link to="/community/new" class="btn-new-post">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Posting Baru
        </router-link>
      </div>
    </div>
    
    <div class="forum-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="['tab-button', { 'active': activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="forum-list">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Memuat diskusi...</p>
      </div>
      
      <div v-else-if="filteredPosts.length === 0" class="empty-state">
        <p>Tidak ada diskusi yang ditemukan</p>
      </div>
      
      <ForumPost
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        class="forum-post-item"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ForumPost from '@/components/ForumPost.vue'

const searchQuery = ref('')
const activeTab = ref('all')
const loading = ref(true)
const posts = ref([])

const tabs = [
  { id: 'all', label: 'Semua' },
  { id: 'popular', label: 'Populer' },
  { id: 'recent', label: 'Terbaru' },
  { id: 'questions', label: 'Pertanyaan' }
]

const filteredPosts = computed(() => {
  let result = posts.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    )
  }
  
  if (activeTab.value === 'popular') {
    result = [...result].sort((a, b) => b.likes - a.likes)
  } else if (activeTab.value === 'recent') {
    result = [...result].sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (activeTab.value === 'questions') {
    result = result.filter(post => post.title.includes('?') || post.content.includes('?'))
  }
  
  return result
})

onMounted(async () => {
  try {
    // Simulate API call
    setTimeout(() => {
      posts.value = [
        {
          id: 1,
          title: "Rekomendasi album folk dengan lirik puitis?",
          content: "Saya sedang mencari album folk dengan lirik yang indah dan puitis. Ada rekomendasi?",
          author: "Dewi_Melody",
          likes: 24,
          date: "2023-05-15",
          comments: 8
        },
        {
          id: 2,
          title: "Pendapat tentang konser Nadin Amizah kemarin?",
          content: "Bagaimana pendapat kalian tentang konser Nadin Amizah di Jakarta kemarin? Saya sangat menikmati penampilannya!",
          author: "Rafi_Birch",
          likes: 18,
          date: "2023-05-12",
          comments: 12
        },
        {
          id: 3,
          title: "Diskusi album terbaru Hindia",
          content: "Apa pendapat kalian tentang album terbaru Hindia? Saya pribadi suka dengan arah musik barunya.",
          author: "Arum_W",
          likes: 15,
          date: "2023-05-10",
          comments: 5
        }
      ]
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    loading.value = false
  }
})
</script>

<style scoped>
.forum-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.forum-header {
  margin-bottom: 2rem;
}

.forum-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.forum-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-container {
  position: relative;
  flex-grow: 1;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #b99b68;
  box-shadow: 0 0 0 3px rgba(185, 155, 104, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.btn-new-post {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #b99b68;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-new-post:hover {
  background: #a58a5d;
  transform: translateY(-2px);
}

.forum-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: #333;
}

.tab-button.active {
  color: #b99b68;
  border-bottom-color: #b99b68;
}

.forum-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.forum-post-item {
  transition: transform 0.3s ease;
}

.forum-post-item:hover {
  transform: translateY(-3px);
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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .forum-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-container {
    width: 100%;
  }
  
  .btn-new-post {
    width: 100%;
    justify-content: center;
  }
  
  .forum-header h1 {
    font-size: 1.5rem;
  }
}
</style>