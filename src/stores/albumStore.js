// stores/albumStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlbumStore = defineStore('album', () => {
  // State
  const albums = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const fetchAlbums = async () => {
    loading.value = true
    error.value = null
    
    try {
      // Simulasi API call
      // Ganti dengan API call yang sebenarnya
      const response = await fetch('/api/albums')
      const data = await response.json()
      albums.value = data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching albums:', err)
    } finally {
      loading.value = false
    }
  }

  const addAlbum = (album) => {
    albums.value.push(album)
  }

  const removeAlbum = (albumId) => {
    const index = albums.value.findIndex(album => album.id === albumId)
    if (index > -1) {
      albums.value.splice(index, 1)
    }
  }

  // Getters
  const getAlbumById = (id) => {
    return albums.value.find(album => album.id === id)
  }

  return {
    // State
    albums,
    loading,
    error,
    // Actions
    fetchAlbums,
    addAlbum,
    removeAlbum,
    // Getters
    getAlbumById
  }
})