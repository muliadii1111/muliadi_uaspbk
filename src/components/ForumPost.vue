<template>
  <div class="forum-post">
    <div class="post-header">
      <h3 class="post-title">{{ post.title }}</h3>
      <div class="post-meta">
        <span class="post-author">by {{ post.author }}</span>
        <span class="post-likes">{{ post.likes }} ❤️</span>
      </div>
    </div>
    <p class="post-content">{{ post.content }}</p>
    <div class="post-actions">
      <button class="btn-reply">Reply</button>
      <button class="btn-like">Like</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: Object
})
</script>

<style scoped>
.forum-post {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
  transition: box-shadow 0.3s ease;
}

.forum-post:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.post-header {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.post-title {
  font-size: 1.1rem;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #888;
}

.post-content {
  margin: 0 0 16px;
  color: #444;
  line-height: 1.5;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.btn-reply, .btn-like {
  padding: 6px 12px;
  border: none;
  border-radius: 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reply {
  background: #f0f0f0;
  color: #333;
}

.btn-like {
  background: #ffebee;
  color: #c62828;
}

.btn-reply:hover {
  background: #e0e0e0;
}

.btn-like:hover {
  background: #ffcdd2;
}

@media (max-width: 768px) {
  .forum-post {
    padding: 16px;
  }
  
  .post-title {
    font-size: 1rem;
  }
  
  .post-content {
    font-size: 0.9rem;
  }
}
</style>