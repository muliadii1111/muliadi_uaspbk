<template>
  <div class="history-page">
    <div class="page-header">
      <h1>Riwayat Pembelian</h1>
      <div class="filter-controls">
        <select v-model="timeFilter" class="time-filter">
          <option value="all">Semua</option>
          <option value="month">Bulan Ini</option>
          <option value="year">Tahun Ini</option>
        </select>
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari pembelian..."
            class="search-input"
          >
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat riwayat...</p>
    </div>

    <div v-else-if="filteredPurchases.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <h3>Tidak ada riwayat pembelian</h3>
      <p>Album yang kamu beli akan muncul di sini</p>
      <router-link to="/albums" class="btn-explore">Jelajahi Album</router-link>
    </div>

    <div v-else class="purchase-list">
      <div v-for="purchase in filteredPurchases" :key="purchase.id" class="purchase-card">
        <div class="purchase-header">
          <span class="order-id">#{{ purchase.orderId }}</span>
          <span class="purchase-date">{{ formatDate(purchase.date) }}</span>
          <span class="purchase-status" :class="purchase.status">{{ getStatusText(purchase.status) }}</span>
        </div>
        
        <div class="purchase-content">
          <div class="album-info">
            <img :src="purchase.album.cover" :alt="purchase.album.title" class="album-cover">
            <div>
              <h3 class="album-title">{{ purchase.album.title }}</h3>
              <p class="album-artist">{{ purchase.album.artist }}</p>
            </div>
          </div>
          
          <div class="purchase-details">
            <div class="detail-item">
              <span class="detail-label">Harga</span>
              <span class="detail-value">Rp {{ purchase.album.price.toLocaleString('id-ID') }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Jumlah</span>
              <span class="detail-value">{{ purchase.quantity }}</span>
            </div>
            <div class="detail-item total">
              <span class="detail-label">Total</span>
              <span class="detail-value">Rp {{ (purchase.album.price * purchase.quantity).toLocaleString('id-ID') }}</span>
            </div>
          </div>
        </div>
        
        <div class="purchase-actions">
          <button class="btn-action" @click="downloadAlbum(purchase)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Unduh
          </button>
          <button class="btn-action" @click="viewReceipt(purchase)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            Nota
          </button>
        </div>
      </div>
    </div>

    <!-- Receipt Modal -->
    <div v-if="selectedReceipt" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Nota Pembelian</h3>
          <button class="close-btn" @click="selectedReceipt = null">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div class="receipt-content">
          <div class="receipt-header">
            <h4>FolkMuse+</h4>
            <p>#{{ selectedReceipt.orderId }}</p>
            <p>{{ formatDate(selectedReceipt.date, true) }}</p>
          </div>
          
          <div class="receipt-items">
            <div class="receipt-item">
              <span>{{ selectedReceipt.album.title }}</span>
              <span>Rp {{ selectedReceipt.album.price.toLocaleString('id-ID') }} × {{ selectedReceipt.quantity }}</span>
              <span>Rp {{ (selectedReceipt.album.price * selectedReceipt.quantity).toLocaleString('id-ID') }}</span>
            </div>
          </div>
          
          <div class="receipt-total">
            <span>Total</span>
            <span>Rp {{ (selectedReceipt.album.price * selectedReceipt.quantity).toLocaleString('id-ID') }}</span>
          </div>
          
          <div class="receipt-status" :class="selectedReceipt.status">
            Status: {{ getStatusText(selectedReceipt.status) }}
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-print" @click="printReceipt">Cetak Nota</button>
          <button class="btn-close" @click="selectedReceipt = null">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const loading = ref(true)
const timeFilter = ref('all')
const searchQuery = ref('')
const selectedReceipt = ref(null)
const purchases = ref([])

// Sample data
const samplePurchases = [
  {
    id: 1,
    orderId: 'FM20230515001',
    date: '2023-05-15T14:30:00',
    status: 'completed',
    quantity: 1,
    album: {
      id: 1,
      title: 'Selamat Ulang Tahun',
      artist: 'Nadin Amizah',
      price: 50000,
      cover: 'https://upload.wikimedia.org/wikipedia/id/d/d4/Nadin_Amizah_-_Selamat_Ulang_Tahun.png'
    }
  },
  {
    id: 2,
    orderId: 'FM20230510002',
    date: '2023-05-10T10:15:00',
    status: 'completed',
    quantity: 2,
    album: {
      id: 2,
      title: 'Ruang Tunggu',
      artist: 'Fiersa Besari',
      price: 45000,
      cover: 'https://cdn-images.dzcdn.net/images/cover/bf4dff5fea8bff09115fffce7c332074/0x1900-000000-80-0-0.jpg'
    }
  }
]

const filteredPurchases = computed(() => {
  let result = purchases.value
  
  // Apply time filter
  const now = new Date()
  if (timeFilter.value === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    result = result.filter(p => new Date(p.date) >= startOfMonth)
  } else if (timeFilter.value === 'year') {
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    result = result.filter(p => new Date(p.date) >= startOfYear)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.album.title.toLowerCase().includes(query) || 
      p.album.artist.toLowerCase().includes(query) ||
      p.orderId.toLowerCase().includes(query)
    )
  }
  
  // Sort by date (newest first)
  return result.sort((a, b) => new Date(b.date) - new Date(a.date))
})

onMounted(() => {
  // Simulate API call
  setTimeout(() => {
    purchases.value = samplePurchases
    loading.value = false
  }, 1000)
})

function formatDate(dateString, withTime = false) {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    ...(withTime && { hour: '2-digit', minute: '2-digit' })
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

function getStatusText(status) {
  const statusMap = {
    'completed': 'Selesai',
    'processing': 'Proses',
    'cancelled': 'Dibatalkan'
  }
  return statusMap[status] || status
}

function downloadAlbum(purchase) {
  alert(`Memulai unduhan: ${purchase.album.title}`)
  // Actual download logic would go here
}

function viewReceipt(purchase) {
  selectedReceipt.value = purchase
}

function printReceipt() {
  window.print()
}
</script>

<style scoped>
.history-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.time-filter {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
  min-width: 150px;
  background: white;
}

.search-container {
  position: relative;
  flex-grow: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: inherit;
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

.purchase-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.purchase-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.purchase-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.purchase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9f5f0;
  border-bottom: 1px solid #eee;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.order-id {
  font-weight: 500;
  color: #333;
}

.purchase-date {
  color: #666;
  font-size: 0.9rem;
}

.purchase-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.purchase-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.purchase-status.processing {
  background: #fff8e1;
  color: #ff8f00;
}

.purchase-status.cancelled {
  background: #ffebee;
  color: #c62828;
}

.purchase-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.album-info {
  display: flex;
  gap: 1rem;
}

.album-cover {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.album-title {
  font-size: 1.1rem;
  margin: 0 0 0.25rem;
  color: #333;
}

.album-artist {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.purchase-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.detail-label {
  color: #666;
}

.detail-value {
  font-weight: 500;
}

.detail-item.total {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.detail-item.total .detail-value {
  color: #b99b68;
  font-weight: 600;
}

.purchase-actions {
  display: flex;
  border-top: 1px solid #eee;
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-action:hover {
  background: #f9f5f0;
}

.btn-action svg {
  width: 18px;
  height: 18px;
}

/* Modal Styles */
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
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
}

.receipt-content {
  padding: 1.5rem;
}

.receipt-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.receipt-header h4 {
  margin: 0 0 0.5rem;
  color: #333;
}

.receipt-header p {
  margin: 0.25rem 0;
  color: #666;
}

.receipt-items {
  margin-bottom: 1.5rem;
}

.receipt-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.receipt-item span {
  text-align: right;
}

.receipt-item span:first-child {
  text-align: left;
}

.receipt-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 1.5rem 0;
}

.receipt-status {
  padding: 0.75rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.receipt-status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.modal-actions {
  display: flex;
  border-top: 1px solid #eee;
}

.btn-print, .btn-close {
  flex: 1;
  padding: 1rem;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.btn-print {
  background: #b99b68;
  color: white;
  border-radius: 0 0 0 12px;
}

.btn-print:hover {
  background: #a58a5d;
}

.btn-close {
  background: #f5f0e6;
  color: #333;
  border-radius: 0 0 12px 0;
}

.btn-close:hover {
  background: #e8d8b5;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .purchase-content {
    grid-template-columns: 1fr;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .modal-content {
    width: 95%;
  }
}

@media (max-width: 480px) {
  .filter-controls {
    flex-direction: column;
  }
  
  .search-container {
    min-width: 100%;
  }
  
  .purchase-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-print, .btn-close {
    border-radius: 0;
  }
  
  .btn-print {
    border-radius: 0 0 0 0;
  }
  
  .btn-close {
    border-radius: 0 0 12px 12px;
  }
}

@media print {
  .modal-overlay {
    position: static;
    background: none;
  }
  
  .modal-content {
    box-shadow: none;
    max-height: none;
  }
  
  .modal-header, .modal-actions {
    display: none;
  }
}
</style>