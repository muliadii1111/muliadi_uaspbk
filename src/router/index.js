import { createRouter, createWebHistory } from 'vue-router'

// Import halaman utama
import HomePage from '../pages/HomePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import RegisterPage from '../pages/RegisterPage.vue'
import LeaderboardPage from '../pages/Leaderboard.vue'
import UserProfilePage from '../pages/UserProfile.vue'
import MyPostsPage from '../pages/MyPosts.vue'

// Album pages
import AlbumDetailPage from '../pages/AlbumDetail.vue'
import AlbumFavoritesPage from '../pages/AlbumFavorites.vue'
import AlbumListPage from '../pages/AlbumList.vue'

// Forum pages
import ForumDetailPage from '../pages/ForumDetail.vue'
import ForumListPage from '../pages/ForumList.vue'

// Community dan History pages
import CommunityPage from '../pages/CommunityPage.vue'
import HistoryPage from '../pages/HistoryPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/login', name: 'Login', component: LoginPage },
  { path: '/register', name: 'Register', component: RegisterPage },
  { path: '/leaderboard', name: 'Leaderboard', component: LeaderboardPage },
  { path: '/profile', name: 'UserProfile', component: UserProfilePage },
  { path: '/myposts', name: 'MyPosts', component: MyPostsPage },

  // Album routes
  { path: '/albums', name: 'AlbumList', component: AlbumListPage },
  { path: '/albums/favorites', name: 'AlbumFavorites', component: AlbumFavoritesPage },
  { path: '/albums/:id', name: 'AlbumDetail', component: AlbumDetailPage },

  // Forum routes
  { path: '/forums', name: 'ForumList', component: ForumListPage },
  { path: '/forums/:id', name: 'ForumDetail', component: ForumDetailPage },

  // Community dan History routes
  { path: '/community', name: 'Community', component: CommunityPage },
  { path: '/history', name: 'History', component: HistoryPage },

  // Catch-all route untuk 404 (opsional)
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router