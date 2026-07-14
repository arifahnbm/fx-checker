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
      
      <!-- Panggil AppTabs di sini -->
      <AppTabs />
      
      <!-- Komponen Grafik History -->
      <HistoryTab />
      
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import LiveTicker from './components/LiveTicker.vue'
import ConverterCard from './components/ConverterCard.vue'
import AppTabs from './components/AppTabs.vue'
import HistoryTab from './components/HistoryTab.vue'
</script>