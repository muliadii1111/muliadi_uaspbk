<template>
  <div class="my-posts-page">
    <div class="page-header">
      <h1>Postinganku</h1>
      <router-link to="/community/new" class="btn-new-post">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Buat Postingan Baru
      </router-link>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat postingan...</p>
    </div>

    <div v-else-if="posts.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <h3>Belum ada postingan</h3>
      <p>Mulai diskusi dengan membuat postingan pertama Anda</p>
      <router-link to="/community/new" class="btn-create">Buat Postingan Pertama</router-link>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-item">
        <div class="post-header">
          <h3 class="post-title">{{ post.title }}</h3>
          <div class="post-actions">
            <button class="btn-action edit-btn" @click="editPost(post.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-action delete-btn" @click="confirmDelete(post.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        <p class="post-content">{{ truncateContent(post.content) }}</p>
        <div class="post-footer">
          <span class="post-date">{{ formatDate(post.date) }}</span>
          <div class="post-stats">
            <span class="likes">{{ post.likes }} ❤️</span>
            <span class="comments">{{ post.comments }} 💬</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3>Hapus Postingan?</h3>
        <p>Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">Batal</button>
          <button class="btn-confirm" @click="deletePost">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const posts = ref([])
const showDeleteModal = ref(false)
const postToDelete = ref(null)

// Sample data
const samplePosts = [
  {
    id: 1,
    title: "Rekomendasi album folk dengan lirik puitis?",
    content: "Saya sedang mencari album folk dengan lirik yang indah dan puitis. Baru-baru ini saya mendengarkan album 'Selamat Ulang Tahun' dari Nadin Amizah dan sangat menyukai lirik-liriknya yang dalam. Ada rekomendasi album serupa dari artis lain?",
    date: "2023-05-15T14:30:00",
    likes: 24,
    comments: 8
  },
  {
    id: 2,
    title: "Pendapat tentang konser Nadin Amizah kemarin?",
    content: "Bagaimana pendapat kalian tentang konser Nadin Amizah di Jakarta kemarin? Saya sangat menikmati penampilannya!",
    date: "2023-05-12T10:15:00",
    likes: 18,
    comments: 12
  }
]

onMounted(() => {
  setTimeout(() => {
    posts.value = samplePosts
    loading.value = false
  }, 800)
})

function truncateContent(content) {
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

function editPost(postId) {
  // Navigate to edit page
  console.log('Editing post:', postId)
}

function confirmDelete(postId) {
  postToDelete.value = postId
  showDeleteModal.value = true
}

function deletePost() {
  posts.value = posts.value.filter(post => post.id !== postToDelete.value)
  showDeleteModal.value = false
  postToDelete.value = null
}
</script>

<style scoped>
.my-posts-page {
  max-width: 800px;
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

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
}

.btn-new-post {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #8c7263;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-new-post:hover {
  background: #6d5b4f;
  transform: translateY(-2px);
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
  border-top: 5px solid #8c7263;
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
  color: #e0d7d1;
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

.btn-create {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #8c7263;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-create:hover {
  background: #6d5b4f;
  transform: translateY(-2px);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.post-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  flex-grow: 1;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: #f0e6d6;
  color: #5e4b3c;
}

.edit-btn:hover {
  background: #e8d8b5;
}

.delete-btn {
  background: #ffebee;
  color: #c62828;
}

.delete-btn:hover {
  background: #ffcdd2;
}

.post-content {
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
}

.post-stats {
  display: flex;
  gap: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-content h3 {
  font-size: 1.3rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #666;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel, .btn-confirm {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #f5f5f5;
  color: #333;
  border: none;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-confirm {
  background: #c62828;
  color: white;
  border: none;
}

.btn-confirm:hover {
  background: #b71c1c;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btn-new-post {
    width: 100%;
    justify-content: center;
  }
  
  .post-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .post-actions {
    align-self: flex-end;
  }
}
</style>