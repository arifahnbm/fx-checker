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
          <span class="text-currencies fw-bold text-white">{{ item.pair }}</span>
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

const isLoading = ref(true)
const tickerPairs = ref([])

// Daftar mata uang mayor yang ingin kita pantau di ticker
const majorCurrencies = ['EUR', 'JPY', 'GBP', 'AUD', 'CHF', 'CAD', 'SGD']

const loadTicker = async () => {
  try {
    isLoading.value = true
    
    // 1. Dapatkan tanggal 3 hari yang lalu untuk mendapatkan perbandingan (mengatasi weekend)
    const d = new Date()
    d.setDate(d.getDate() - 3)
    const fromDate = d.toISOString().split('T')[0]
    
    // 2. Fetch Time Series ke Frankfurter API v2
    // Menggunakan parameter 'quotes' agar data yang ditarik hanya mata uang mayor saja (biar ringan)
    const quotesStr = majorCurrencies.join(',')
    const res = await fetch(`https://api.frankfurter.dev/v2/rates?from=${fromDate}&base=USD&quotes=${quotesStr}`)
    const data = await res.json()
    
    // 3. Kelompokkan data yang masih berupa flat array berdasarkan 'quote'
    const grouped = {}
    majorCurrencies.forEach(c => grouped[c] = [])
    
    data.forEach(item => {
      if (grouped[item.quote]) {
        grouped[item.quote].push(item)
      }
    })

    // 4. Kalkulasi Rate Terbaru dan Persentase Change
    tickerPairs.value = majorCurrencies.map(currency => {
      // Sortir berdasarkan tanggal untuk memastikan urutan benar (terlama -> terbaru)
      const history = grouped[currency].sort((a, b) => new Date(a.date) - new Date(b.date))
      
      // Safety check jika gagal mengambil data
      if (history.length === 0) {
        return { pair: `USD/${currency}`, rate: '...', change: '0.00', isUp: true }
      }
      
      const latestRate = history[history.length - 1].rate
      let changePercent = 0
      
      // Pastikan ada data hari sebelumnya untuk dihitung
      if (history.length > 1) {
        const previousRate = history[history.length - 2].rate
        changePercent = ((latestRate - previousRate) / previousRate) * 100
      }
      
      const isUp = changePercent >= 0
      
      return {
        pair: `USD/${currency}`,
        rate: latestRate.toFixed(4),
        change: Math.abs(changePercent).toFixed(2), // Gunakan Math.abs karena tanda ▲/▼ di-handle di template
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
.text-currencies { color: #9D9D9D !important; }

</style>