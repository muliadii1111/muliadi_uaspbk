<template>
  <div class="album-list-page">
    <div class="page-header">
      <h2 class="page-title">Daftar Album Folk</h2>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari album..."
          class="search-input"
        />
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat album...</p>
    </div>

    <div v-if="error" class="error-message">
      <p>Error: {{ error }}</p>
      <button @click="fetchAlbums" class="btn-retry">Coba Lagi</button>
    </div>

    <div v-if="!loading && filteredAlbums.length === 0" class="empty-state">
      <p>Tidak ditemukan album dengan kata kunci "{{ searchQuery }}"</p>
    </div>

    <div v-if="!loading && filteredAlbums.length > 0" class="album-grid">
      <AlbumCard
        v-for="album in filteredAlbums"
        :key="album.id"
        :album="album"
        @add-to-cart="addToCart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AlbumCard from '@/components/AlbumCard.vue'
import { useCartStore } from '@/stores/cart'

const albums = ref([])
const loading = ref(true)
const error = ref(null)
const cart = useCartStore()
const searchQuery = ref('')

const filteredAlbums = computed(() => {
  return albums.value.filter(album =>
    album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function fetchAlbums() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('http://localhost:3000/albums')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    albums.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchAlbums)

function addToCart(album) {
  cart.addToCart(album)
  alert(`"${album.title}" ditambahkan ke keranjang!`)
}
</script>

<style scoped>
.album-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.search-container {
  position: relative;
  max-width: 300px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #b99b68;
  box-shadow: 0 0 0 2px rgba(185, 155, 104, 0.2);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #b99b68;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffebee;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  color: #c62828;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #b99b68;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-retry:hover {
  background: #a58a5d;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .album-grid {
    grid-template-columns: 1fr;
  }
}
</style>