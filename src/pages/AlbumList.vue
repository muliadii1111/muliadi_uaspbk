<template>
  <div class="album-list-page">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">
        Koleksi Album Folk 
      </h1>
      <p class="page-subtitle">Jelajahi kekayaan musik folk</p>
    </div>

    <!-- Search & Filter Section -->
    <div class="search-filter-section">
      <div class="search-container">
        <div class="search-wrapper">
          <i class="search-icon">🔍</i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari album atau artis..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">✕</button>
        </div>
      </div>
      
      <div class="filter-buttons">
        <button 
          @click="sortBy = 'title'" 
          :class="{ active: sortBy === 'title' }"
          class="filter-btn"
        >
          Judul
        </button>
        <button 
          @click="sortBy = 'artist'" 
          :class="{ active: sortBy === 'artist' }"
          class="filter-btn"
        >
          Artis
        </button>
        <button 
          @click="sortBy = 'year'" 
          :class="{ active: sortBy === 'year' }"
          class="filter-btn"
        >
          Tahun
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Memuat koleksi album...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <p>Terjadi kesalahan: {{ error }}</p>
      <button @click="fetchAlbums" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- No Results -->
    <div v-if="!loading && !error && filteredAlbums.length === 0" class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3>Tidak ditemukan album</h3>
      <p>Coba kata kunci yang berbeda</p>
    </div>

    <!-- Albums Grid -->
    <div v-if="!loading && !error && filteredAlbums.length > 0" class="albums-container">
      <div class="results-info">
        <span class="results-count">{{ filteredAlbums.length }} album ditemukan</span>
      </div>
      
      <div class="album-grid">
        <div
          v-for="album in sortedAlbums"
          :key="album.id"
          class="album-card"
          @click="toggleAlbumDetails(album.id)"
        >
          <div class="album-cover-container">
            <img :src="album.cover" :alt="album.title" class="album-cover">
            <div class="album-overlay">
              <button class="play-btn">▶️</button>
            </div>
          </div>
          
          <div class="album-info">
            <h3 class="album-title">{{ album.title }}</h3>
            <p class="album-artist">{{ album.artist }}</p>
            <p class="album-year">{{ album.year }}</p>
            <div class="album-stats">
              <span class="track-count">{{ album.tracks?.length || 0 }} lagu</span>
              <span class="duration">{{ formatDuration(album.duration) }}</span>
            </div>
          </div>

          <!-- Track List (Expandable) -->
          <div v-if="expandedAlbums.includes(album.id)" class="track-list">
            <h4>Daftar Lagu:</h4>
            <ul>
              <li
                v-for="(track, index) in album.tracks"
                :key="index"
                class="track-item"
                @click.stop="playTrack(track)"
              >
                <span class="track-number">{{ index + 1 }}</span>
                <span class="track-title">{{ track.title }}</span>
                <span class="track-duration">{{ track.duration }}</span>
              </li>
            </ul>
          </div>

          <div class="album-actions">
            <button @click.stop="addToCart(album)" class="add-to-cart-btn">
              🛒 Tambah ke Keranjang
            </button>
            <button @click.stop="toggleFavorite(album)" class="favorite-btn">
              {{ album.isFavorite ? '❤️' : '🤍' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const albums = ref([])
const loading = ref(true)
const error = ref(null)
const cart = useCartStore()

const searchQuery = ref('')
const sortBy = ref('title')
const expandedAlbums = ref([])

// Data album folk Indonesia
const indonesianAlbums = [
  {
    id: 1,
    title: "Dunia Batas",
    artist: "Payung Teduh",
    year: 2011,
    cover: "https://images.genius.com/8790e15b6da6db28be0583e60cce9b3d.640x640x1.jpg",
    duration: 2520,
    isFavorite: false,
    tracks: [
      { title: "Untuk Perempuan Yang Sedang Dalam Pelukan", duration: "4:15" },
      { title: "Akad", duration: "3:42" },
      { title: "Kucari Kamu", duration: "4:08" },
      { title: "Sesuatu Yang Tertunda", duration: "3:56" },
      { title: "Cerita tentang Sunyi", duration: "4:32" }
    ]
  },
  {
    id: 2,
    title: "Yang Patah Tumbuh",
    artist: "Banda Neira",
    year: 2013,
    cover: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhMSEhIVFhIWFhkWFhgWGBYaFxgYFhcXGBgVFhgYHCggGBslGxcWITEhJSkrLi8uFx8zODMsNygtLisBCgoKDg0OGxAQGy0lICYvLS0vLS0tLS0rLS8tLS0tLS0tLS4tLS8vLi8vKy01LS8vLS8tLS0tLS0tLS0tLy0tLv/AABEIAOEA4QMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAwQBAgUGB//EADcQAAEDAgUCBAUDAwQDAQAAAAEAAhEDIQQSMUFRYZEFInGBobHB0fAGEzJCUuFygrLxI2KiFP/EABoBAQADAQEBAAAAAAAAAAAAAAACAwQBBQb/xAAzEQACAQIEAwYGAgMAAwAAAAAAAQIDEQQSITFBUWETcZGhsfAFIoHB0eEUMjNC8RUjYv/aAAwDAQACEQMRAD8A+35BwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyAZBwOyA2QBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEBpUqBokmAoVKkacc03ZHVFt2RVdi3mS1oDWiSXGPaADCwSxdZ3cIJRSu3J28knb66rikXKnHS71fItUX5mtMRIBjiRot1GbqU4zatdJ25XKpKzaN1YRCAICHF4gMaTvsOTsFmxWIVCm5vV8FzfL3w1J04OcrEjJgTrur43ss25F9DZSOFLH1XN3gaCIzOcdAJsB1XnY6rUpq6llXC1s0pPgr3SXN+ltbqUVJ+7JG2GxDnOiPKBc8n6A3/ImWHxM6s8ttEtXzf4etumuiavycFFX4lirUDRJ5A9zYLZUqRpq8nyXjoitRb2N1M4EAQBAEAQBAEAQBAEAQBAEAQBAYc4ASdAuSkopt7IJX0Rz2uLyXmQ0TH/qN45d1201leTCbxDdV6RV7dOducub/ANf6rXMaGsiy8X5/r132sUKVZhc1xcAM0FpJ/jJidrWPrPK8ijicPUnGq5JfNbK3/rra/DTR8bu7b1sapU5pOKXDfr70LmO8TAtTc3q7X2aNz8AvRx3xZR+WhJdZb/SK4vnwXEopYZvWafd+Tal4s3yg6mZI/iOk/wBR0FlZT+NUW4xnu73f+q6X4vZaX1OPCy1a/f6Jv/3eZoDSAZu61hvBvx3Wn+enOMVF2d9XpouNnry8SvstG77fU0xPibWmGwY/kZgD33PQKnE/FYU3aFnb+zvZL68XySuShh3JXf05mlOuIFWrYkeRupA5A3J+Srp4mFlicTo2vlju0ui3bfO2i05knB37On9WWMHjRUuAQJgTF/RbMHj4YmOaKaV7K/HuKqlF03Z/8LLnACToFslJRTk9kVpX0RyqhNQipEjSk06E7vd0+gXhTcsVNV2rranF7N8Zy6W8u81q1NOF+9/ZdTWjj2tflzDKJkxdzrS63WwH+FXR+JU6Vdwc1lV78XKWl5addElw6WOyoSlC9tfJLkXWY1pZncMrZtm1PUDqvUp4+lKj28/ljwvu+5deBndGSlkWr6G2CxBe0uLctyBPA5/NlPBYmWIpuco5dWl3L78+qOVYKDsncrVvETLcgBaTA5dzlGwHKw1viks8eyV4t2XFy52XBLm9+C4l0cOrPM9fTv8AwdJe0ZQgCAIAgCAIAgCAIAgCAIAgIsTRztyk2OsbjhUYigq9N05PR724rl9ePQlCeV3RI1oAgCAFbGKilGKskRbvuV6WBptJIYJP5YbLLS+H4alNzhBJv39PoWyrVJKzZKMOwEkNEnUwJVyw9JSc1FXfG2pBzk1a5n9psgwJGhjT0U+yhdSsrrbTY5mdrXD6TXatBjkSuTpQnbPFO3NXCk1syI4GnmLsgkrO8BhnUdRwV2T7apbLfQiPhdKR5Bb1+PKofwfBtp9mtO/z5k/5NXmTUcIxplrQD+dlqo4OhRlmpxSZXKpKSs2SVqQcC06HVW1aUasHCezORk4u6NK+FY+MwmNNR7W2VVfCUa6SqRvbb2uHQ7CpKH9WKeEpt0Y0egCU8Hh6bvCCXckJVZy3bNKWBY0zEkaFxJI9J0UKWAoU5KSV2tm2213XvY7KtOStwMU8EAMuZxbwT9oXKeBjCGRyk1yb/FvM7Kq272VyM+FU4sC08gmeNVnfwbC2+VOL5pu/Lcn/ACanHX0LOHoBggTyZMknklb6FCFGOWPm7tvqymc3J3ZKriIQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEBiUAJQERxLQYm6HLoka4ESEOmKr4BPAlG7Ar4XF5gc0Aj49UuuBy5ZDkOmyAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgNXFARVMQ0anoFy4MYpzg0luvS66Rd7aHn3Vxm85OYmAL2NvvusWIxMqcrJEGzr+HOcCQZjbp9rLVGWaKZKO5LjqsjK0ZnHsByVTVraZaerOy5HKqVP22loDiT5QbbiZ0VdOTpLI099L9Su9lYu+G1LxG22y2EoHSXSwyCgMoAgCAIAgCAIAgCAIAgCAIAgCAIAgCA0NQTEieN0BiqJC42Dl4iiQ4OLoBMSRPXbmCsNdNTU3Oy9+pYpxUbNF19QUx6+mq2tpK7K0itTw7Kj3EtiII5zOkk+sR3Kz5I1KjbW1l9yO7JHsy/+Ntpu53A+65VbnLso7ce7kHyJaBaBPMAc9B81ZSpqF/egVuBFUogAvc0OdsIkNk6D6lSUE9Zb+hyy3ZWqYolxueLExMKt4hKp2dizI3HMXHYsgtGU3mY2gD7pVr5JJJXJQhmTdyZuIbyurE03bU5kZMFoImUAQBAEAQBAEAQBAEAQBAEAQBAEBgoDg1HuZVdM5jJB5E6D1gduFTOVnfNboRW70IqjnHWq7N/UGyb8DYLyJTlJttnpJJbIt4UTDDPuZM7yrKPzvIymqrq5YqsDh5zDma9eCPn7LfSlmi4T3Wj68n9f0ZU7BleHWuHEfQW7Su0Ws0kuZF3TIq7iS4bF0a6xoPhPuo0L5pvqRbIadR0gZSbyDBy77m3Copuv29pXtr3W9/U0zUOzuv2dXLmbB3HzXolRRqUACeG87SqJzSu1uvudjG7sRGu51pDXHQ/0mNl58qkp7uz8jXkUSNkzaA+ZcLgFUJu+u5J2trsdfDVg4T+cL16FbtF3GScMrJ1oIBAEAQBAEAQBAEAQBAEAQBAEAQEOIeQ0kaqmtKUYPLuSgk3qcGpUjzz5yLehkX9x8F4km/7M1zWitsjaq402tcADa8Qb7ldfy6krqV7lrwrMD5tDoYtO9/YdltwicXrszHUqqb0LOLAJFri2uo/Lrleuo1lbdad6fvT9kXC6uGVGtmBpYfRRWKjGU3Farzv71JZdis+rDcgBJcXOJFzBO3B29Aq54h9m4RWrfAqcbIy/H4cPyPqU2kjNBeJB3gz6L16cKresdLLxO5TFXxikQG0ntcSQBBHOwWfGzq0kkovVrWwbsWKTQ9jif6iSPQafKfdVUYdpSlKX+zb/AB6EoScXc5VIgEZpIjQQfy8dlgi1xPQbzK8SzUN5nzcjQhG7u73IJcOBZwlTk36aFXUJ2lfiVVI6HRa6V68ZZlczM2UgEAQBAEAQBAEAQBAEAQBAEBgqL20ByqTjczeT89Oq+Sw9SpdybtK79duqNUki3RpU3icgsdwLHovocLOlXhmUe/vKZOS0uVXMDHQGgxcT8O2nZVqMaN1a7W3d+vwVupJKxYw5bBpmxMnKepkxzeVbTqxayS35MiktiOq+CAb/AJqV5uLqQzJ3vw/bL6adrGr3gFhyzmOX4EyeyvowgrVrXb0/J1K91yPN+M48vq1MOHGmG5YIMFxMHWbgEkQvcwmFhSjm4ttkbnIIeWtD6WYgiXH/AJR6ErbdLZjfQixWCdSLP23Akl19NLgztEfFSU1JNSWhFo9H+lsbUqPfRqOzNyZm3JgggS1xvF9DwseKw9J00krLYjaxao/wiJIcYPLRt6WJn5r5/B4ZTpNPg9H0O0qzpolLIjLJnS3NvTdFQzXyO9jSsTF6M6VHAZYvf8mLwFrhg8vEhKtfgXBAHQLZ8sI9EU7sMeDoQfRRp1qdT+kk+53DTW5tKsOBAZQBAEAQBAEAQBAEAQGCgKlcu1BNj0XiYuWJSzRk1Zva30/RbHKVDc663+/xXjK85tt/21v149zvvyLtkK5kXm17b/mvsvTw+KlTk01wKKkfluT1fK0PAuDfqND9D7L1KukVUW69Hv76FT5lJ/iDpyuAcDEQLzIWXt+0eWor929yEZXJIzEEGRO+vdUVsC5VLwlfmnv3miMmlqh+45jHuAkgWHLosI19l34fSlCTU3ZJrx/4SlKLPHVGGIqODpInNP8AIHMD6yvrIvT5SNlxOzhcSxgLXZjAbqCR5iQACdTP0WLE0qk7OD2JIiqsDnVJpiMoyGRrLpJgTpHRW0oyhFZnd8TjIMPhXB4cCQQQQGCBI6/m6sqTiou5xnp6VEECm0CGC7iJIdGg5N7rw6D17GGy3fXkvuU24G1TDFpBtFo6HXT1Cji5PDxTp6Xdn9idOCb1LmHryIOo+PVTwmMVSOWT1XmuZKUbFfF1p9F52PxfaLKtuXP3+yyEbGKVbKI3/Ln82UcPiv41NK2vDu5vv4LoxKOZmjqrnGxPWDColi61aVlJ9bO300JKKS2LGHYTfb4lejgqUqjztuy66t+9yubtoWwvZKjKAIAgCAIAgCAIDBXG7Ao1sW4mGi3xXzuI+LV3NxopWXF6v9F8aatqQPxL+R2+yw1fiWLd02u634ZYqcCu+tJ4PwP2XnzxDqy4Rfk/w/dyxQsKFaHCVZhMU4Vlm9ta/o5OF0X8JWa4ZZBaR5fq382X1eGqK3Zy2e1/OL6r0ML5EFDDNEuef4kgfKex0VmGw9pt8m0iEI2M4UgS7ygTfmVonTjSblbvLZSdrM1qwXzzp7EWP5yvOlllKTb10+qXB/ZkLrgVPEqJqAaEscHcGADIk7X+C9qm4U45tlYnc57mEEAtIEAg8z/0tEZqSzIkmRUMQCDm/lLgP9rjrfiF2S5HTu4EnKxgsXHMegFx3t3Xk4ueapGlHjq+5alcnrY3quEwBEE/9r5vFVVKrly2s2v2vA0QjZaEgrSwtP5Cs/lurh3Tlutn1Tur+AyWlciFaCT0P0WX+Tkk2uT87EstzVjrF2wsAq4TTg6r2WiR1rWweDzc3K5UVTi9Xq16foKxLSYTYfnVbMNSlK1OG793ZCT4s6bRAAX1VOChFRWyMzdzKmDKAIAgCAIAgCAIDBXGCliGUxqTPAXhYylg6LvJvNyW/hb1LoObKhIOgPf/AAvEvGf+OL8V+GXa8SrXcNL/AAKx1+zvbVeD9H9iyNzwnjHjleniKopOLmtBkOBblLbT5gDvtY2IuZX0eBwFCrhoymtXxTvfw/6tmeRisVVhWai9FwH6f/VmR1IVcwosaWnJEuIZlZMnYj6r0P4kI1J1G381vpbkZqeKajGMtl5nssN4nXxA8lAhrgHS6AXQAAYLgbiNlOFaonaFr8TQqlRq6iY/cc3+Td9Zt7rQ69aKvVhp0LFUl/si1QfmiDyeCCNR2WCrRjbNTd4+a6HGuRpVqOId/cAA7qIse61xk6mDfc/Fbk1qrF3DNa9rczZtruOkqynWtQjNckTW10QYnDU2k+SbgD/VA66Ss1XHVacmvd7fki5tFnDnIC+xk5Z9NSPUz7ALFUq/xo9rvd2v5t9b28EiVKGYjrVQ4zod/uvCxWLjXnnWj4/ZmuMHFWI88eqojVUfmu0/JkrHI/Uf6hp4YAvDnFxs1mXNcG5DiPLIDZE3IsttHBTx0m07R59XwIuSgR/p79U0MWCKZio2S6m6A8AEDNAJltxfqq8Vg6uESzK8b3utr8vI7GSkeliLm7iteXIs09Zv3/wr30Wxao5WC5vv06L18M6WGg3Ufzcd3bpoVSvJ6Eza7SYm61xxtGU1BS1fAi4PckWsiZQBAEAQBAEAQBAEBz8XhTdwv0+y+c+I/DZOTrQ142S1+hfTqcGQXAvYdY+RusNp0Y3mssetvR2ZPRvTUr4mCbTHUAfJedjakZStG7XVJfvxLYKyPGfqLCZHh/7jmgsc1z3vOUhwcf2h5bTlny3uNF7vwusv49sqve6UVr379d2eZjKbz3vbTd+h57wDAuNamIlsl7Rmb530xamATcy9nsIle1UmrOPHTzPMpxu0+/yPp3gdfOwubFxLcsgSCZBB31HSV42CqRp16lLK1Lm3v+nfTvPbazQUr3JqxNyWlwO4Bm4tIH4V6scZUSto113+pQ5NFJzSw5rGPY9ARqD+crPKcacs8VpxXvy8CN0noSUS4vcZvA03Y4iNPT8har5MO8vH1/aJcNCzgKkEtk2cCIm4PPS6wYS8ZuC2+zOR5EuLGZ0nTQfNx9dB6qWK1qP33nXqzU4oFopxmqC9hAaJ50FrKNTJXo9k91x5fXuJQqOL03K7HPBhwbGxBn2P+F4OI7CDUYSu14eOxqp9o/7IkD5NgAO6z9v8zyRXr9y7Lpqed8d/Rn71Q1m1i1zv5B0kHiIIIjja0RC+hw+NqUaajVSfdp5f8KHFN6Hhqvh2JweMpNlzS97ADTuXtNQAi8B3ofdej2tLE4dytda79CNmpH12m+DPb8K+SpV3Tlnd+l/2aHG5MHF2rgBvz2WlTliG+0mknvxfhq/GyIWUdkWaNZjNJPWAvVw2KwuFjaKb62X5KpRlIs0q7XaH2XqUMbRrO0Za8noytwaJlrIhAEAQBAEAQBAEBpUdAJOyqq1FTg5y2R1K7sctxJOY6n4L4+o5Tm61TWT8ui6L3qalorIhqNWKtF/2fv31JxZzvEvCxXyB38GvDzyS3+IHSTf0jdTwcqtHNOHHS/Bc2QrQjUspcNTm4v8ATrDVouYMoY1zXR/aGw33Bj8AWqh8TrU6VSMtXdNfXcz1cFCU4taK1vwdP9PYM4ZuUnM1z3OJGwLjHvliVbHH3rRqzXyNK/RrR/S+65a7llKhkhlvrd+Z1sQfMRyTET7j6+6+kkuzqKcf+rj+V3lBSxReR/Sb5RLfMJ3zbQtUsJRnF2XASimiBuIcA1jbQ4gztfQe/wAlgwyhGDnU/wBeHW5XGV1qXGDK4uuRkB95IWWdeTqOotLr0O31uYxz3WYweaNeBYvcfcx7dQqq8rJrkv3J/b6CzbUUMPhw0Rzcnc9T+WXkTzVbKTtHl+epspwVNabklRlrXVVWnHLaCuyyL11NsHbaCp/D7RlqrP37/wCCpqa42syi11R5IY0S50EwBqbC61dglNKN9ePDxtqQueN8MZWx2IZiqzDToUpNBuhJfF3f3WAkzFgBN1bj508Nh3QptOUn83vh08dxBNu7PY0qZ1XlUaM7ZiyTRNSi8688LbRjGTamtefL6be+hXJvgbuoRufayt/iyhHWWi5aHM9+Bq15mFCnOopOL4cePidaVi7RxGxv6fVe7h8dd5Z+K+6KZQ5FgFekncrMroCAIAgCAIAgKmKMmNh814/xCeeXZ8F6lsFbUrGmvIdFrYsuRVWwsuIpShZNe/wTi7mzT5ByVam3h1zZx/2MYajMk+i5gsLdOcu7375Cc+AwoBzjWL/MfRRwEI1IVIcrP1X2R2ppZlsUpa1w1A7gbdl9RQWbCw6JeWhln/ZlerR14kdraKMcTOCy8Ps9iDZQxNIfuf6hm9wTPyd3VLldP/6Xmt/uUt2duZcbHlEWhrSPQuJ9rKvPGySXJPxbJoxhnBpdmBLqhyjkN/7JJ9VynUi1KnJO89Pfm2di8ruXDgusLv8A4hPeVvM0dqRYimGiBMnfgLHjaNPDRUItuT48lz7ycG5alUbBePDRpc397aFrGUieke6lKnOGaSb0t9RdMBlr+i5Gi8rcxfXQt03EDLEjovWo1JwXZuN10W5U0nqRmk7+l3sVS8PXV+xm30fv1X1O5o8USMwbzGZw9gtlP4ViZpOrNLolf8anHVitkTNwTdyT6n7LdD4TQX9ry73+LFbqvgTsogaAD0W+nRp01aEUu5EG29zdohWJWOGV0BAEAQBAEAQETqV5WWrhYzeZaMkpGP2wPVQ7CnRjmtdi7ZSxt7L574lJyeXmX0zRrzEmBsPzhVU60smaSSWy03/R1rUxns430+q52slGcuFvv9zttix4fSsSRrHZer8FwmWEqkl/a1u5cfPyK60ruxaDmi0j0kL2YRjTWVMobInsOgOm3QrPUhK+WL+nT39jhyMQ0tdS9Xg+maPkSsEk4pJvn6tFMtGiw2ZPt8TCgrq77vUmiyxuTzOvUI9gOAtSy4d5nrN+XT3uStxZcpgwJ13Xo01JRWbfiSObVdmJdtt9PuvksRUdeq6qV1w5cl+TVFZVYGjeN8sn4/4Uf4kp1lTT1y3fR6/o7m0uQMqbHcWKzUq11llxRJx4otMbMA7i3Wd/VelTp51GM+KunzTW/euP4K27bGzH5SAdt+hVlGs6NVRm9nvzT9+7HGrq6OgvpjOF0GUAQBAEAQBAEAQBAEAQGlRp2VFenKUflOpld2GmSV5svhue8qnh9u7u8SztLbETYNiJOyxwUZLLON2tvfIk+jJWYWWkG0/dbqXw1SoOE9G2vJ3IuprdFg0wRG3SR8l6jppxy8PAqepWqYFvCxzwa4akcqKri5pyOmDZrvX+mfy4Czyzx+SX0+698jmq0ZpXgubP95/+gq205a8/UjLh3mKGrjtI+Eme/wA1nV7vvRKO5JhwXvnax9ht7n5KzCwlWr5ntv7735IkzqL3TpUqU4sBZeHWw7hoo6X0LlK5vhaJEl2pWn4fhJU3KpU/tL0IzlfRFGvTAJbxp8x8PkvAxdGNKcqXK9vVeT8i+LvqXsN5mN5iPcWX0GDticJBve1r9Vp9iifyzZE6kf6l59TDTsu1RNS5FuibL3MNJyppspluSLQcCAIAgCAIAgCAIAgCAIAgCA1DANlXGlCLukdubKw4EAQGlRgIgqE4Kaswceu0tdGwcPk77heJOLhNxfMrluZwdIxlm5/wfklGnnah74M7FEzMcJyU2zvPMb22W+NWMfkpI5n4ItYaq82c33iPaDdXUalSWk42JpssrQdC6CtiMLmMgwfSV52L+HqvJSTs+6/4LIzy6E9KmGiBotlGjGlDJHYg3d3Zs5sqcoKSszhq1kHoq6dHs5Oz05HW7m6uOBAEAQBAEAQBAEAQBAEAQBAEAQBAEBDiaZIlphw0+xVVWMnH5Xqca5HLr1C4Akaa+0iD7leRWbm03vx8yu9zXEF2R5GogexytMe0pBO8pcv0hK+V2Lfg+Hysndxn20HyW/CU7RzPiSgrI6ELaTMoAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIDkeICM45LT7GJ+IK8vEJKT8fQrlub4QeR4Otp9So4b/HP3udWx0wvWJmUAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQHN8R/l6gD3OaPjC8/E/5F3fkhIzgWzInV0+oAB+oUMIr3XW/h7R1I6K9MkEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQHM8VJzN9R8J+4XnY291YhLc38LvmPt+dkwK3Z2J0F6JIIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgOd4pEs6GfZYMY1eJCe6NvChY+q5gdpHY7F9egSCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIDj+JVPN7gdsv3Xl4t/N76fkre5t4VV87gePlZRwcv/c109CUdjrL1iQQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQAoDieKH6/wDL/C8jGaPx9Stm3h9qnrPxAPzKhh3aun3+hKPE7K9okEAQBAEAQBAEAQBAEAQBAEBQQBAEAQBAEAQBAEAQBAEAQHH8T0H+7/kvJxn2fqV8TbCfzb6fZV0v8sSS3OsvaJBAEAQBAEAQBAEAQBAEAQBAf//Z",
    duration: 2760,
    isFavorite: true,
    tracks: [
      { title: "Yang Patah Tumbuh", duration: "4:20" },
      { title: "Di Atas Kapal", duration: "3:45" },
      { title: "Selamat Pagi", duration: "4:12" },
      { title: "Djalan yg Panjang", duration: "5:03" },
      { title: "Sebuah Kisah Klasik", duration: "4:50" }
    ]
  },
  {
    id: 3,
    title: "Hitam Putih",
    artist: "Feby Putri",
    year: 2024,
    cover: "https://img.merahputih.com/media/f7/46/d4/f746d469206e41a4684adc9325e11575.jpg",
    duration: 3120,
    isFavorite: false,
    tracks: [
      { title: "Senyum Semu", duration: "4:35" },
      { title: "Runtuh", duration: "3:58" },
      { title: "Kita", duration: "4:22" },
      { title: "Ruang Tunggu", duration: "5:10" },
      { title: "Bicara", duration: "4:45" }
    ]
  },
  {
    id: 4,
    title: "Respectable",
    artist: "Mocca",
    year: 2002,
    cover: "https://img.antaranews.com/cache/730x487/2020/11/20/day-by-day.jpg",
    duration: 2880,
    isFavorite: false,
    tracks: [
      { title: "My Diary", duration: "3:45" },
      { title: "I Remember", duration: "4:12" },
      { title: "Friends", duration: "3:58" },
      { title: "On The Night Like This", duration: "4:25" },
      { title: "Twist of Fate", duration: "4:10" }
    ]
  },
  {
    id: 5,
    title: "Monokrom",
    artist: "Tulus",
    year: 2016,
    cover: "https://i0.wp.com/suarausu.or.id/wp-content/uploads/2022/02/Album-Monokrom.jpg?fit=750%2C750&ssl=1&w=640",
    duration: 2640,
    isFavorite: true,
    tracks: [
      { title: "Monokrom", duration: "3:34" },
      { title: "Sepatu", duration: "3:39" },
      { title: "Langit Abu-Abu", duration: "3:22" },
      { title: "Interaksi", duration: "3:14" },
      { title: "Pamit", duration: "3:51" }
    ]
  }
]

// Filter albums berdasarkan pencarian
const filteredAlbums = computed(() => {
  if (!searchQuery.value) return albums.value
  
  return albums.value.filter(album =>
    album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// Sort albums
const sortedAlbums = computed(() => {
  return [...filteredAlbums.value].sort((a, b) => {
    if (sortBy.value === 'year') {
      return b.year - a.year
    }
    return a[sortBy.value].localeCompare(b[sortBy.value])
  })
})

async function fetchAlbums() {
  loading.value = true
  error.value = null
  
  try {
    // Simulasi API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    albums.value = indonesianAlbums
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function clearSearch() {
  searchQuery.value = ''
}

function toggleAlbumDetails(albumId) {
  const index = expandedAlbums.value.indexOf(albumId)
  if (index > -1) {
    expandedAlbums.value.splice(index, 1)
  } else {
    expandedAlbums.value.push(albumId)
  }
}

function playTrack(track) {
  alert(`Memutar: ${track.title}`)
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60)
  return `${minutes} menit`
}

function addToCart(album) {
  cart.addToCart(album)
  alert(`"${album.title}" ditambahkan ke keranjang!`)
}

function toggleFavorite(album) {
  album.isFavorite = !album.isFavorite
}

onMounted(fetchAlbums)
</script>

<style scoped>
.album-list-page {
  padding: 2rem;
  font-family: 'Georgia', 'Times New Roman', serif;
  background-color: #f5f5f0;
  min-height: 100vh;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  color: #5d4037;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Georgia', serif;
  color: #4e342e;
}

.page-title .icon {
  margin-right: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  color: #8d6e63;
  font-style: italic;
}

.search-filter-section {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.search-container {
  flex: 1;
  min-width: 300px;
  max-width: 500px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  z-index: 1;
  color: #8d6e63;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #d7ccc8;
  border-radius: 25px;
  font-size: 1rem;
  background: #fff;
  box-shadow: 0 4px 15px rgba(139, 69, 19, 0.1);
  transition: all 0.3s ease;
  font-family: 'Georgia', serif;
  color: #5d4037;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 6px 20px rgba(139, 69, 19, 0.15);
  transform: translateY(-2px);
  border-color: #a1887f;
}

.clear-btn {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #8d6e63;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.7rem 1.5rem;
  border: 2px solid #d7ccc8;
  background: transparent;
  color: #5d4037;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  font-family: 'Georgia', serif;
}

.filter-btn:hover,
.filter-btn.active {
  background: #d7ccc8;
  color: #3e2723;
  border-color: #a1887f;
}

.loading-container {
  text-align: center;
  padding: 4rem;
  color: #8d6e63;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(141, 110, 99, 0.3);
  border-top: 4px solid #8d6e63;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container,
.no-results {
  text-align: center;
  padding: 4rem;
  color: #8d6e63;
}

.error-icon,
.no-results-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.7rem 1.5rem;
  background: #d7ccc8;
  color: #5d4037;
  border: 2px solid #a1887f;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 1rem;
  font-family: 'Georgia', serif;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #a1887f;
  color: #fff;
}

.albums-container {
  background: #fff;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(141, 110, 99, 0.1);
  border: 1px solid #d7ccc8;
}

.results-info {
  margin-bottom: 2rem;
  color: #8d6e63;
  font-weight: 500;
  font-family: 'Georgia', serif;
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.album-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(141, 110, 99, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.album-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(141, 110, 99, 0.2);
  border-color: #a1887f;
}

.album-cover-container {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.album-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(93, 64, 55, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.album-card:hover .album-overlay {
  opacity: 1;
}

.album-card:hover .album-cover {
  transform: scale(1.05);
}

.play-btn {
  background: #f5f5f0;
  border: 2px solid #a1887f;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #5d4037;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play-btn:hover {
  transform: scale(1.1);
  background: #8d6e63;
  color: #fff;
}

.album-info {
  padding: 1.5rem;
}

.album-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #4e342e;
  font-family: 'Georgia', serif;
}

.album-artist {
  font-size: 1rem;
  color: #8d6e63;
  margin: 0 0 0.3rem 0;
  font-family: 'Georgia', serif;
}

.album-year {
  font-size: 0.9rem;
  color: #a1887f;
  margin: 0 0 1rem 0;
  font-family: 'Georgia', serif;
}

.album-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #8d6e63;
  font-family: 'Georgia', serif;
}

.track-list {
  padding: 0 1.5rem 1rem;
  border-top: 1px solid #eee;
}

.track-list h4 {
  margin: 1rem 0;
  color: #5d4037;
  font-family: 'Georgia', serif;
}

.track-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.track-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.track-item:hover {
  background: #f5f5f0;
}

.track-number {
  font-size: 0.9rem;
  color: #a1887f;
  min-width: 20px;
}

.track-title {
  flex: 1;
  font-size: 0.95rem;
  color: #5d4037;
}

.track-duration {
  font-size: 0.9rem;
  color: #8d6e63;
}

.album-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
}

.add-to-cart-btn {
  flex: 1;
  padding: 0.8rem 1rem;
  background: #8d6e63;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
  font-family: 'Georgia', serif;
}

.add-to-cart-btn:hover {
  background: #6d4c41;
}

.favorite-btn {
  padding: 0 1rem;
  background: transparent;
  border: 2px solid #d7ccc8;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorite-btn:hover {
  border-color: #8d6e63;
  background: #f5f5f0;
}

@media (max-width: 768px) {
  .album-list-page {
    padding: 1rem;
  }
  
  .search-filter-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .album-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .album-cover-container {
    height: 180px;
  }
}
</style>