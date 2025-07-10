<template>
  <div class="album-detail-container">
    <div v-if="album" class="album-detail">
      <div class="album-media">
        <img :src="album.cover" :alt="album.title" class="album-cover" />
        <div class="album-actions">
          <button class="btn-action" @click="addToCart">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Tambah ke Keranjang
          </button>
          <button class="btn-action btn-favorite">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Favorit
          </button>
        </div>
      </div>
      
      <div class="album-info">
        <h1 class="album-title">{{ album.title }}</h1>
        <p class="album-artist">{{ album.artist }}</p>
        
        <div class="price-section">
          <span class="price-label">Harga:</span>
          <span class="album-price">Rp {{ album.price.toLocaleString('id-ID') }}</span>
        </div>
        
        <div class="album-description">
          <h3>Deskripsi Album</h3>
          <p>Album folk indie dengan lirik puitis dan melodi yang menenangkan. Dirilis tahun 2022 dengan 10 track.</p>
        </div>
        
        <div class="track-list">
          <h3>Daftar Lagu</h3>
          <ol>
            <li v-for="(track, index) in tracks" :key="index">{{ track }}</li>
          </ol>
        </div>
      </div>
    </div>
    
    <div v-else class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat detail album...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const route = useRoute()
const cart = useCartStore()
const album = ref(null)

// Dummy track list
const tracks = ref([
  "Lagu Pertama - 3:45",
  "Lagu Kedua - 4:12",
  "Lagu Ketiga - 3:28",
  "Lagu Keempat - 5:02",
  "Lagu Kelima - 4:31"
])

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/albums/${route.params.id}`)
    album.value = await res.json()
  } catch (error) {
    console.error("Error fetching album:", error)
  }
})

function addToCart() {
  cart.addToCart(album.value)
  alert('Album ditambahkan ke keranjang!')
}
</script>

<style scoped>
.album-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.album-detail {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.album-media {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.album-cover {
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 1/1;
  object-fit: cover;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.album-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action svg {
  flex-shrink: 0;
}

.btn-action:first-child {
  background: #b99b68;
  color: white;
}

.btn-action:first-child:hover {
  background: #a58a5d;
  transform: translateY(-2px);
}

.btn-favorite {
  background: white;
  border: 1px solid #ddd;
  color: #333;
}

.btn-favorite:hover {
  background: #f9f9f9;
  border-color: #b99b68;
  color: #b99b68;
}

.album-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.album-title {
  font-size: 2rem;
  margin: 0;
  color: #333;
}

.album-artist {
  font-size: 1.2rem;
  color: #666;
  margin: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f4ed;
  padding: 1rem;
  border-radius: 8px;
}

.price-label {
  font-weight: 500;
  color: #666;
}

.album-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #b99b68;
}

.album-description, .track-list {
  padding: 1rem 0;
  border-top: 1px solid #eee;
}

.album-description h3, .track-list h3 {
  margin-top: 0;
  color: #444;
  font-size: 1.2rem;
}

.track-list ol {
  padding-left: 1.5rem;
  margin-bottom: 0;
}

.track-list li {
  padding: 0.5rem 0;
  color: #555;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .album-detail {
    grid-template-columns: 1fr;
  }
  
  .album-media {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .album-detail {
    padding: 1.5rem;
  }
  
  .album-title {
    font-size: 1.5rem;
  }
  
  .album-artist {
    font-size: 1rem;
  }
  
  .album-price {
    font-size: 1.2rem;
  }
}
</style>