<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Selamat Datang di FolkMuse+</h1>
        <p class="subtitle">Temukan keindahan musik folk dan bergabunglah dengan komunitas kami</p>
        <div class="hero-actions">
          <router-link to="/albums" class="btn-primary">Jelajahi Album</router-link>
          <router-link to="/community" class="btn-secondary">Lihat Forum</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="@/assets/2.jpg" alt="Musik Folk" />
      </div>
    </section>

    <!-- Featured Albums -->
    <section class="featured-section">
      <h2 class="section-title">Album Pilihan</h2>
      <p class="section-subtitle">Rekomendasi album terbaik untuk Anda</p>
      
      <div v-if="loadingAlbums" class="loading-container">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else class="albums-grid">
        <AlbumCard 
          v-for="album in featuredAlbums" 
          :key="album.id" 
          :album="album" 
          class="featured-album"
        />
      </div>
      
      <router-link to="/albums" class="btn-view-all">Lihat Semua Album</router-link>
    </section>

    <!-- Popular Discussions -->
    <section class="discussions-section">
      <h2 class="section-title">Diskusi Populer</h2>
      <p class="section-subtitle">Bergabunglah dalam percakapan komunitas</p>
      
      <div v-if="loadingDiscussions" class="loading-container">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else class="discussions-list">
        <ForumPost 
          v-for="post in popularPosts" 
          :key="post.id" 
          :post="post" 
          class="forum-post"
        />
      </div>
      
      <router-link to="/community" class="btn-view-all">Lihat Semua Diskusi</router-link>
    </section>

    <!-- Community Stats -->
    <section class="stats-section">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-value">{{ stats.albums }}+</div>
          <div class="stat-label">Album</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.members }}+</div>
          <div class="stat-label">Member</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ stats.discussions }}+</div>
          <div class="stat-label">Diskusi</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AlbumCard from '@/components/AlbumCard.vue'
import ForumPost from '@/components/ForumPost.vue'

const loadingAlbums = ref(true)
const loadingDiscussions = ref(true)
const featuredAlbums = ref([])
const popularPosts = ref([])

const stats = ref({
  albums: 250,
  members: 1500,
  discussions: 580
})

// Sample data
const sampleAlbums = [
  {
    id: 1,
    title: 'Selamat Ulang Tahun',
    artist: 'Nadin Amizah',
    price: 50000,
    cover: 'https://t2.genius.com/unsafe/600x600/https%3A%2F%2Fimages.genius.com%2F9b2e7b465162c2aa5c670844c040f15c.1000x1000x1.png'
  },
  {
    id: 2,
    title: 'Ruang Tunggu',
    artist: 'Fiersa Besari',
    price: 45000,
    cover: 'https://cdn-images.dzcdn.net/images/cover/bf4dff5fea8bff09115fffce7c332074/500x500-000000-80-0-0.jpg'
  },
  {
    id: 3,
    title: 'Menari Dengan Bayangan',
    artist: 'Hindia',
    price: 60000,
    cover: 'https://upload.wikimedia.org/wikipedia/id/8/89/Menari_dengan_bayangan.jpg'
  }
]

const samplePosts = [
  {
    id: 1,
    title: "Rekomendasi album folk dengan lirik puitis?",
    content: "Saya sedang mencari album folk dengan lirik yang indah dan puitis. Ada rekomendasi?",
    author: "Dewi_Melody",
    likes: 24,
    date: "2023-05-15"
  },
  {
    id: 2,
    title: "Pendapat tentang konser Nadin Amizah kemarin?",
    content: "Bagaimana pendapat kalian tentang konser Nadin Amizah di Jakarta kemarin?",
    author: "Rafi_Birch",
    likes: 18,
    date: "2023-05-12"
  },
  {
    id: 3,
    title: "Diskusi album terbaru Hindia",
    content: "Apa pendapat kalian tentang album terbaru Hindia?",
    author: "Arum_W",
    likes: 15,
    date: "2023-05-10"
  }
]

onMounted(() => {
  // Simulate API calls
  setTimeout(() => {
    featuredAlbums.value = sampleAlbums
    loadingAlbums.value = false
  }, 800)

  setTimeout(() => {
    popularPosts.value = samplePosts
    loadingDiscussions.value = false
  }, 1000)
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-bottom: 4rem;
}

/* Hero Section */
.hero-section {
  display: flex;
  align-items: center;
  gap: 3rem;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #f9f5f0, #f0e6d6);
  border-radius: 0 0 20px 20px;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero-content h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-content .subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #b99b68;
  color: white;
}

.btn-primary:hover {
  background: #a58a5d;
  transform: translateY(-2px);
}

.btn-secondary {
  background: white;
  color: #b99b68;
  border: 1px solid #b99b68;
}

.btn-secondary:hover {
  background: #f9f5f0;
  transform: translateY(-2px);
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hero-image img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* Featured Sections */
.featured-section, .discussions-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 1.8rem;
  color: #333;
  text-align: center;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #b99b68;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.featured-album {
  transition: transform 0.3s ease;
}

.featured-album:hover {
  transform: translateY(-5px);
}

.discussions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.forum-post {
  transition: transform 0.3s ease;
}

.forum-post:hover {
  transform: translateY(-3px);
}

.btn-view-all {
  display: block;
  text-align: center;
  padding: 0.75rem;
  background: #f5f0e6;
  color: #5e4b3c;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  max-width: 200px;
  margin: 0 auto;
}

.btn-view-all:hover {
  background: #e8d8b5;
  transform: translateY(-2px);
}

/* Stats Section */
.stats-section {
  background: linear-gradient(135deg, #5e4b3c, #8c7263);
  color: white;
  padding: 4rem 1rem;
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    padding: 3rem 1rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .hero-image {
    margin-top: 2rem;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .albums-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
  }
  
  .albums-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-value {
    font-size: 2rem;
  }
}
</style>