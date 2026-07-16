<template>
  <div class="container-fluid px-0">
    <!-- Komponen Navigasi Utama -->
    <div class="container">
      <Navbar />
    </div>

    <!-- Ticker Pasar Berjalan -->
    <LiveTicker />

    <!-- Wadah Konten Utama (Converter + Tabs + History) -->
    <div class="container py-4">
      
      <!-- Panggil ConverterCard di sini -->
      <ConverterCard />
      
      <!-- Panggil TabNavigation di sini -->
      <TabNavigation />
      
      <!-- HANYA TAMPILKAN KOMPONEN BERDASARKAN activeTab -->
      <HistoryTab v-if="store.activeTab === 'HISTORY'" />
      <CompareTab v-else-if="store.activeTab === 'COMPARE'" />
      <FavoritesTab v-else-if="store.activeTab === 'FAVORITES'" />
      
    </div>
  </div>
</template>

<script setup>
import { useCurrencyStore } from './stores/currencyStore'
const store = useCurrencyStore()
import Navbar from './components/Navbar.vue'
import LiveTicker from './components/LiveTicker.vue'
import ConverterCard from './components/ConverterCard.vue'
import TabNavigation from './components/TabNavigation.vue'
import HistoryTab from './components/HistoryTab.vue'
import CompareTab from './components/CompareTab.vue'
import FavoritesTab from './components/FavoritesTab.vue'
</script>