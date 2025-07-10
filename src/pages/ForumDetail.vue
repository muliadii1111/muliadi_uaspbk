<template>
  <div class="forum-detail-page">
    <router-link to="/forum" class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      Kembali ke Forum
    </router-link>
    
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p>Memuat diskusi...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p>{{ error }}</p>
      <button @click="fetchPost" class="retry-btn">Coba Lagi</button>
    </div>
    
    <div v-else-if="post" class="post-container">
      <div class="post-header">
        <div class="post-category" :style="{ backgroundColor: getCategoryColor(post.category) }">
          {{ getCategoryName(post.category) }}
        </div>
        <h1 class="post-title">{{ post.title }}</h1>
        
        <div class="post-meta">
          <div class="author-info">
            <img :src="post.authorAvatar" alt="Author" class="author-avatar">
            <div>
              <span class="author-name">{{ post.author }}</span>
              <span class="post-date">{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <button @click="toggleLike" class="like-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              {{ post.likes }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="post-content">
        <p>{{ post.content }}</p>
      </div>
      
      <div class="comments-section">
        <h3 class="comments-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          Komentar ({{ post.comments.length }})
        </h3>
        
        <div v-if="post.comments.length === 0" class="no-comments">
          <p>Belum ada komentar</p>
        </div>
        
        <div v-else class="comments-list">
          <div v-for="comment in post.comments" :key="comment.id" class="comment">
            <img :src="comment.authorAvatar" alt="Commenter" class="comment-avatar">
            
            <div class="comment-content">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              </div>
              
              <p class="comment-text">{{ comment.text }}</p>
              
              <div class="comment-actions">
                <button @click="toggleCommentLike(comment.id)" class="like-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  {{ comment.likes }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="new-comment">
          <textarea v-model="newComment" placeholder="Tulis komentar..." rows="3"></textarea>
          <button @click="addComment" class="submit-button">Kirim</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)
const error = ref(null)
const newComment = ref('')

const categories = [
  { id: 'general', name: 'Umum' },
  { id: 'album', name: 'Album' },
  { id: 'artist', name: 'Artis' },
  { id: 'event', name: 'Event' }
]

function fetchPost() {
  loading.value = true
  error.value = null
  
  // Simulate API call
  setTimeout(() => {
    try {
      // Sample data
      post.value = {
        id: route.params.id,
        title: 'Rekomendasi album folk Indonesia terbaik',
        content: 'Saya sedang mencari rekomendasi album folk Indonesia yang bagus untuk koleksi saya. Ada yang bisa merekomendasikan album-album folk Indonesia yang menurut Anda wajib didengarkan? Saya sudah mendengarkan beberapa karya Payung Teduh dan Banda Neira, tapi ingin tahu lebih banyak lagi.',
        category: 'album',
        author: 'FolkLover',
        authorAvatar: 'https://i.pravatar.cc/80?u=FolkLover',
        likes: 24,
        createdAt: '2023-05-15T10:30:00Z',
        comments: [
          {
            id: 1,
            author: 'MusicExplorer',
            authorAvatar: 'https://i.pravatar.cc/80?u=MusicExplorer',
            text: 'Saya sangat merekomendasikan album "Dua Garis Biru" dari Dialog Senja. Liriknya sangat dalam dan aransemen musiknya indah!',
            likes: 5,
            createdAt: '2023-05-15T12:45:00Z'
          },
          {
            id: 2,
            author: 'FolkEnthusiast',
            authorAvatar: 'https://i.pravatar.cc/80?u=FolkEnthusiast',
            text: 'Coba dengarkan karya-karya Mocca, terutama album "My Diary". Meskipun lebih ke pop-jazz, tapi ada sentuhan folk yang kental.',
            likes: 3,
            createdAt: '2023-05-16T09:20:00Z'
          }
        ]
      }
    } catch (err) {
      error.value = 'Gagal memuat diskusi'
    } finally {
      loading.value = false
    }
  }, 800)
}

function getCategoryName(categoryId) {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : 'Umum'
}

function getCategoryColor(categoryId) {
  const colors = {
    general: '#D7CCC8',
    album: '#BCAAA4',
    artist: '#A1887F',
    event: '#8D6E63'
  }
  return colors[categoryId] || '#D7CCC8'
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

function toggleLike() {
  if (post.value) {
    post.value.likes += post.value.isLiked ? -1 : 1
    post.value.isLiked = !post.value.isLiked
  }
}

function toggleCommentLike(commentId) {
  if (post.value) {
    const comment = post.value.comments.find(c => c.id === commentId)
    if (comment) {
      comment.likes += comment.isLiked ? -1 : 1
      comment.isLiked = !comment.isLiked
    }
  }
}

function addComment() {
  if (newComment.value.trim() && post.value) {
    const newCommentObj = {
      id: Date.now(),
      author: 'Anda',
      authorAvatar: 'https://i.pravatar.cc/80?u=You',
      text: newComment.value,
      likes: 0,
      createdAt: new Date().toISOString()
    }
    
    post.value.comments.unshift(newCommentObj)
    newComment.value = ''
  }
}

onMounted(fetchPost)
</script>

<style scoped>
.forum-detail-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #8D6E63;
  text-decoration: none;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.back-link svg {
  stroke: currentColor;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
}

.loader {
  border: 4px solid #F5F5F5;
  border-top: 4px solid #8D6E63;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.7rem 1.5rem;
  background-color: #8D6E63;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
}

.post-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(141, 110, 99, 0.1);
  border: 1px solid #EEEEEE;
}

.post-header {
  margin-bottom: 2rem;
}

.post-category {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: white;
  margin-bottom: 1rem;
}

.post-title {
  font-size: 1.8rem;
  color: #5D4037;
  margin: 0.5rem 0 1.5rem;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-weight: 600;
  color: #5D4037;
  display: block;
}

.post-date {
  font-size: 0.9rem;
  color: #8D6E63;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #F5F5F5;
  border: none;
  border-radius: 20px;
  color: #5D4037;
  cursor: pointer;
  transition: all 0.3s;
}

.like-button:hover {
  background-color: #D7CCC8;
}

.like-button svg {
  stroke: currentColor;
}

.post-content {
  margin-bottom: 3rem;
  line-height: 1.7;
  color: #424242;
  white-space: pre-line;
}

.comments-section {
  border-top: 1px solid #EEEEEE;
  padding-top: 2rem;
}

.comments-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #5D4037;
  margin-bottom: 1.5rem;
}

.comments-title svg {
  stroke: currentColor;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: #8D6E63;
  font-style: italic;
}

.comments-list {
  margin-bottom: 2rem;
}

.comment {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #F5F5F5;
}

.comment:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.comment-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: #5D4037;
}

.comment-date {
  font-size: 0.8rem;
  color: #8D6E63;
}

.comment-text {
  color: #424242;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.new-comment {
  margin-top: 2rem;
}

.new-comment textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #D7CCC8;
  border-radius: 8px;
  font-family: inherit;
  resize: none;
  margin-bottom: 1rem;
  min-height: 100px;
}

.new-comment textarea:focus {
  outline: none;
  border-color: #8D6E63;
}

.submit-button {
  padding: 0.8rem 1.5rem;
  background-color: #8D6E63;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #6D4C41;
}

@media (max-width: 768px) {
  .post-title {
    font-size: 1.5rem;
  }
  
  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>