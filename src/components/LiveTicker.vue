<template>
  <div class="ticker-wrapper d-flex border-bottom border-secondary" style="--bs-border-opacity: .3; background-color: #171719;">
    <!-- Label Live Markets di Kiri -->
    <div class="ticker-label d-flex align-items-center fw-bold px-4 z-1">
      <span class="live-dot me-2"></span> LIVE MARKETS
    </div>
    
    <!-- Area Marquee Berjalan di Kanan -->
    <div class="ticker-content flex-grow-1 overflow-hidden d-flex align-items-center">
      
      <!-- Tampilkan pesan loading jika data belum siap -->
      <div v-if="isLoading" class="text-secondary small px-4">
        Connecting to market data...
      </div>
      
      <!-- Track yang akan dianimasikan berjalan -->
      <div v-else class="ticker-track d-flex gap-5 px-4">
        <div 
          v-for="(item, index) in tickerPairs" 
          :key="index" 
          class="ticker-item d-flex align-items-center gap-2 small"
        >
          <span class="fw-bold text-white">{{ item.pair }}</span>
          <span class="text-white">{{ item.rate }}</span>
          <span :class="item.isUp ? 'text-green' : 'text-red'">
            {{ item.isUp ? '▲' : '▼' }} {{ item.change }}%
          </span>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getLatestRates } from '../services/api'

const isLoading = ref(true)
const tickerPairs = ref([])

// Daftar mata uang mayor yang ingin kita pantau di ticker
const majorCurrencies = ['EUR', 'JPY', 'GBP', 'AUD', 'CHF', 'CAD', 'SGD']

const loadTicker = async () => {
  try {
    // Ambil kurs terbaru dengan base USD
    const data = await getLatestRates('USD')
    
    // Susun data untuk ditampilkan di template
    tickerPairs.value = majorCurrencies.map(currency => {
      const rate = data.rates[currency]
      
      // CATATAN MENTOR: 
      // Karena endpoint /latest API Frankfurter tidak memberikan data persentase naik/turun 
      // harian secara langsung, kita buat "dummy" angka persentase agar UI terlihat
      // persis seperti desain Figma. Di dunia kerja nyata, data ini didapat dari API Premium.
      const mockChange = (Math.random() * 0.5).toFixed(2)
      const isUp = Math.random() > 0.5
      
      return {
        pair: `USD/${currency}`,
        rate: rate ? rate.toFixed(4) : '...',
        change: isUp ? `+${mockChange}` : `-${mockChange}`,
        isUp: isUp
      }
    })
  } catch (error) {
    console.error("Gagal memuat ticker:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTicker()
})
</script>

<style scoped>
.ticker-wrapper {
  height: 40px;
}

/* Kotak hijau stabilo di sebelah kiri */
.ticker-label {
  background-color: #CEF739; /* Lime 500 */
  color: #0A0A0A;
  white-space: nowrap;
  box-shadow: 5px 0 15px rgba(0,0,0,0.5); /* Memberi bayangan agar teks berjalan seperti masuk ke bawahnya */
}

/* Titik berkedip merah/hitam */
.live-dot {
  width: 8px;
  height: 8px;
  background-color: #0A0A0A;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Animasi Teks Berjalan (Marquee) */
.ticker-track {
  white-space: nowrap;
  display: inline-flex;
  animation: marquee 25s linear infinite; /* Kecepatan animasi 25 detik */
}

/* Fitur Interaktif: Berhenti berjalan saat disorot mouse */
.ticker-content:hover .ticker-track {
  animation-play-state: paused; 
  cursor: default;
}

/* Keyframe untuk menggerakkan elemen dari ujung kanan ke ujung kiri */
@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}

.text-green { color: #42EB05 !important; }
.text-red { color: #FF4141 !important; }
</style>