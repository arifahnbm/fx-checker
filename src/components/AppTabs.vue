<template>
  <div class="tabs-container mb-4">
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
        <a href="#" class="nav-link px-0 py-3 d-flex align-items-center gap-2">
          FAVORITES
          <span class="badge-lime">10</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#" class="nav-link px-0 py-3 d-flex align-items-center gap-2">
          LOG
          <span class="badge-lime">8</span>
        </a>
      </li>
    </ul>

    <!-- Tampilan Mobile: Custom Dropdown -->
    <div class="mobile-tabs-dropdown d-md-none">
      <select v-model="store.activeTab" class="form-select custom-dropdown">
        <option value="HISTORY">HISTORY</option>
        <option value="COMPARE">COMPARE</option>
        <option value="FAVORITES">FAVORITES 10</option>
        <option value="LOG">LOG 8</option>
      </select>
    </div>

  </div>
</template>

<style scoped>
.nav-link {
  color: #9D9D9D; /* Neutral 200 */
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}
.nav-link:hover {
  color: #FFFFFF;
}
/* Tab yang sedang aktif */
.nav-link.active {
  color: #FFFFFF;
  border-bottom: 2px solid #CEF739; /* Lime 500 */
}

.custom-dropdown {
  background-color: #171719; /* Warna gelap */
  color: #FFFFFF;
  border: 1px solid #2E2E2E;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  appearance: none; /* Menghilangkan arrow default */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23FFFFFF'%3E%3Cpath d='M8 10l4-4H4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
}

/* Angka di dalam tab */
.badge-lime {
  background-color: #283300; /* Lime 800 */
  color: #CEF739;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: 700;
}
</style>

<script setup>
import { useCurrencyStore } from '../stores/currencyStore'
const store = useCurrencyStore()
</script>