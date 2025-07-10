<template>
  <div class="album-card">
    <div class="album-cover-container">
      <img :src="album.cover" :alt="album.title" class="album-cover" />
      <div class="overlay">
        <router-link :to="`/albums/${album.id}`" class="btn-detail">View Details</router-link>
      </div>
    </div>
    <div class="album-info">
      <h3 class="album-title">{{ album.title }}</h3>
      <p class="album-artist">{{ album.artist }}</p>
      <p class="album-price">Rp {{ album.price.toLocaleString('id-ID') }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  album: Object
})
</script>

<style scoped>
.album-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.album-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.album-cover-container {
  position: relative;
  padding-top: 100%; /* 1:1 aspect ratio */
  overflow: hidden;
}

.album-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.album-card:hover .album-cover {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover .overlay {
  opacity: 1;
}

.btn-detail {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-detail:hover {
  background: white;
  transform: scale(1.05);
}

.album-info {
  padding: 16px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.album-title {
  font-size: 1.1rem;
  margin: 0 0 4px;
  color: #333;
  font-weight: 600;
}

.album-artist {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 8px;
}

.album-price {
  font-size: 1rem;
  color: #b99b68;
  font-weight: 600;
  margin-top: auto;
}

@media (max-width: 768px) {
  .album-title {
    font-size: 1rem;
  }
  
  .album-artist {
    font-size: 0.85rem;
  }
  
  .album-price {
    font-size: 0.9rem;
  }
}
</style>