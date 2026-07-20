<template>
  <div class="tabs-container mb-4">
    
    <!-- 1. Tampilan Desktop: Horizontal Tabs -->
    <ul class="nav d-none d-md-flex gap-4 border-bottom border-secondary" style="--bs-border-opacity: .3;">
      <li class="nav-item">
        <a href="#" @click.prevent="store.activeTab = 'HISTORY'" 
           :class="['nav-link', { 'active': store.activeTab === 'HISTORY' }]">HISTORY</a>
      </li>
      <li class="nav-item">
        <a href="#" @click.prevent="store.activeTab = 'COMPARE'" 
           :class="['nav-link', { 'active': store.activeTab === 'COMPARE' }]">COMPARE</a>
      </li>
      <li class="nav-item">
        <a href="#" @click.prevent="store.activeTab = 'FAVORITES'"
           :class="['nav-link d-flex align-items-center gap-2', { 'active': store.activeTab === 'FAVORITES' }]">
           FAVORITES <span class="badge-lime">{{ store.favorites.length }}</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" @click.prevent="store.activeTab = 'LOG'"
           :class="['nav-link d-flex align-items-center gap-2', { 'active': store.activeTab === 'LOG' }]">
           LOG <span class="badge-lime">{{ store.conversionLogs.length }}</span>
        </a>
      </li>
    </ul>

    <!-- 2. Tampilan Mobile: Custom Dropdown -->
    <div class="mobile-dropdown d-md-none position-relative">
      <!-- Trigger (Kotak yang kelihatan) -->
      <div class="dropdown-trigger rounded-3 d-flex justify-content-between align-items-center px-3 py-3" 
     @click="isOpen = !isOpen">
  
        <!-- Bagian Teks dan Badge -->
        <span class="d-flex align-items-center gap-2">
          <span class="fw-bold">{{ store.activeTab }}</span>
          
          <!-- Tampilkan badge HANYA jika tab yang aktif memiliki badge -->
          <span v-if="store.activeTab === 'FAVORITES'" class="badge-lime">
            {{ store.favorites.length }}
          </span>
          <span v-if="store.activeTab === 'LOG'" class="badge-lime">
            {{ store.conversionLogs.length }}
          </span>
        </span>

        <!-- Chevron Icon -->
        <span class="chevron" :class="{ 'rotate': isOpen }">
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.78125 5.875L0.15625 1.28125C0 1.15625 0 0.90625 0.15625 0.75L0.78125 0.15625C0.9375 0 1.15625 0 1.3125 0.15625L5.0625 3.84375L8.78125 0.15625C8.9375 0 9.1875 0 9.3125 0.15625L9.9375 0.75C10.0938 0.90625 10.0938 1.15625 9.9375 1.28125L5.3125 5.875C5.15625 6.03125 4.9375 6.03125 4.78125 5.875Z" fill="white"/>
          </svg>
        </span>
      </div>

      <!-- Menu (List yang muncul) -->
      <div v-if="isOpen" class="dropdown-menu-custom mt-2 rounded-3 p-2">
        <div class="menu-item" @click="selectTab('HISTORY')">HISTORY</div>
        <div class="menu-item" @click="selectTab('COMPARE')">COMPARE</div>
        <div class="menu-item d-flex justify-content-between align-items-center" @click="selectTab('FAVORITES')">
          FAVORITES <span class="badge-lime">{{ store.favorites.length }}</span>
        </div>
        <div class="menu-item d-flex justify-content-between align-items-center" @click="selectTab('LOG')">
          LOG <span class="badge-lime">{{ store.conversionLogs.length }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCurrencyStore } from '../stores/currencyStore'
const store = useCurrencyStore()

const isOpen = ref(false)

const selectTab = (tab) => {
  store.activeTab = tab
  isOpen.value = false // Tutup menu setelah diklik
}
</script>

<style scoped>
/* Desktop Styles (Tetap sama) */
.nav-link { color: #ffffff; font-weight: 500; transition: all 0.3s ease; border-bottom: 2px solid transparent; }
.nav-link:hover { color: #9D9D9D; font-weight: 500; transition: all 0.3s ease; border-bottom: 2px solid transparent; }
.nav-link.active { color: #FFFFFF; border-bottom: 2px solid #CEF739; }

/* Mobile Styles */
.dropdown-trigger { background-color: #171719; border: 1px solid #2E2E2E; color: #FFFFFF; cursor: pointer; }
.chevron { transition: transform 0.3s; font-size: 10px; }
.chevron.rotate { transform: rotate(180deg); }

.dropdown-menu-custom {
  background-color: #171719;
  border: 1px solid #2E2E2E;
  position: absolute;
  width: 100%;
  z-index: 1000;
}

.menu-item {
  padding: 12px;
  color: #FFFFFF;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
}
.menu-item:hover {
  background-color: #ffffff; 
  transition: background-color 0.2s ease;
}

/* Badge style */
.badge-lime {
  background-color: #283300;
  color: #CEF739;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 700;
}

.nav-link { 
  color: #ffffff; 
  font-weight: 500; 
  transition: all 0.3s ease; 
  border-bottom: 2px solid transparent; 
}

/* Focus/Active State */
.nav-link.active, .nav-link:focus { 
  color: #FFFFFF; 
  border-bottom: 2px solid #CEF739; /* Warna lime saat fokus/aktif */
  outline: none;
}
</style>