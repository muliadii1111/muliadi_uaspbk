<template>
  <div class="favorites-page">
    <div class="page-header">
      <h1>Album Favorit Kamu</h1>
      <p v-if="favoriteAlbums.length > 0">Kamu memiliki {{ favoriteAlbums.length }} album favorit</p>
      <p v-else>Kamu belum memiliki album favorit</p>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat album favorit...</p>
    </div>

    <div v-else-if="favoriteAlbums.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <h3>Belum ada album favorit</h3>
      <p>Tambahkan album ke favorit dengan menekan ikon hati di halaman album</p>
      <router-link to="/albums" class="btn-explore">Jelajahi Album</router-link>
    </div>

    <div v-else class="favorites-grid">
      <div v-for="album in favoriteAlbums" :key="album.id" class="favorite-item">
        <div class="album-cover-container">
          <img :src="album.cover" :alt="album.title" class="album-cover" />
          <button class="remove-favorite" @click="removeFavorite(album.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="album-info">
          <h3>{{ album.title }}</h3>
          <p>{{ album.artist }}</p>
          <div class="album-meta">
            <span class="price">Rp {{ album.price.toLocaleString('id-ID') }}</span>
            <router-link :to="`/albums/${album.id}`" class="btn-detail">Lihat Detail</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const favoriteAlbums = ref([])
const loading = ref(true)

// Simulate loading favorite albums
onMounted(() => {
  setTimeout(() => {
    favoriteAlbums.value = [
      {
        id: 1,
        title: 'Selamat Ulang Tahun',
        artist: 'Nadin Amizah',
        price: 50000,
        cover: 'https://images.genius.com/9b2e7b465162c2aa5c670844c040f15c.1000x1000x1.png'
      },
      {
        id: 2,
        title: 'Ruang Tunggu',
        artist: 'Fiersa Besari',
        price: 45000,
        cover: 'https://img.jakpost.net/c/2018/01/19/2018_01_19_39102_1516325111._large.jpg'
      }
    ]
    loading.value = false
  }, 800)
})

function removeFavorite(albumId) {
  favoriteAlbums.value = favoriteAlbums.value.filter(album => album.id !== albumId)
}
</script>

<style scoped>
.favorites-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  margin: 0;
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
  max-width: 500px;
  margin: 0 auto;
}

.empty-state svg {
  color: #f0e6d6;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn-explore {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #b99b68;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-explore:hover {
  background: #a58a5d;
  transform: translateY(-2px);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.favorite-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.album-cover-container {
  position: relative;
  padding-top: 100%; /* 1:1 aspect ratio */
}

.album-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-favorite {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ff6b6b;
  transition: all 0.3s ease;
}

.remove-favorite:hover {
  transform: scale(1.1);
  color: #ff5252;
}

.remove-favorite svg {
  width: 20px;
  height: 20px;
}

.album-info {
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.album-info h3 {
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  color: #333;
}

.album-info p {
  margin: 0 0 1rem;
  color: #666;
}

.album-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  color: #b99b68;
  font-size: 1.1rem;
}

.btn-detail {
  padding: 0.5rem 1rem;
  background: #f5f0e6;
  color: #5e4b3c;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-detail:hover {
  background: #e8d8b5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .favorite-item {
    flex-direction: row;
    align-items: center;
  }
  
  .album-cover-container {
    padding-top: 0;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }
  
  .album-info {
    padding: 1rem;
  }
  
  .remove-favorite {
    width: 30px;
    height: 30px;
  }
  
  .remove-favorite svg {
    width: 16px;
    height: 16px;
  }
}
</style>