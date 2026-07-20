<template>
  <div class="favorites-tab text-white">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3 px-2">
      <h6 class="fw-bold m-0 text-white">PINNED PAIRS</h6>
      <span class="text-secondary small">{{ store.favorites.length }} FAVORITES</span>
    </div>

    <!-- Empty State -->
    <div v-if="store.favorites.length === 0" class="text-center py-5 d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
        <h5 class="text-secondary fw-bold mb-2">No pinned pairs yet</h5>
        <p class="text-secondary opacity-75">
            Pin a pair to track its rate here. Tap the star <br/> icon on any conversion or comparison row.
        </p>
    </div>

    <!-- List -->
    <div v-else class="favorites-list">
      <div v-for="pairKey in store.favorites" :key="pairKey" 
           class="currency-row p-3 mb-2 rounded-3 d-flex justify-content-between align-items-center">
        
        <!-- Pair Text (Misal: USD -> EUR) -->
        <div class="d-flex align-items-center">
          <span class="fw-bold fs-5">{{ formatPair(pairKey) }}</span>
        </div>

        <!-- Right: Rate & Star -->
        <div class="d-flex align-items-center gap-4">
          <div class="text-end">
            <!-- Menampilkan Data Rate Real -->
            <div class="fw-bold fs-5">{{ getRate(pairKey) > 0 ? getRate(pairKey).toFixed(4) : '...' }}</div>
            
            <!-- Menampilkan Data Change Real -->
            <small :class="calculateChange(pairKey) >= 0 ? 'text-green' : 'text-red'">
                {{ (calculateChange(pairKey) > 0 ? '▲ +' : '▼ ') + calculateChange(pairKey) + '%' }}
            </small>
          </div>
          
          <button @click="store.toggleFavorite(parseBase(pairKey), parseTarget(pairKey))" 
                  class="btn-star active">
            <!-- Icon Bintang (Favorite/Filled) -->
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
               <path d="M7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081Z" fill="#CEF739"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCurrencyStore } from '../stores/currencyStore'

const store = useCurrencyStore()

// State untuk menyimpan rate terbaru dan persentase perubahannya
const ratesData = ref({})
const changesData = ref({}) 

// Helper untuk memformat key
const formatPair = (key) => key.replace('-', ' → ')
const parseBase = (key) => key.split('-')[0]
const parseTarget = (key) => key.split('-')[1]

// Mengambil rate terbaru
const getRate = (key) => {
  const base = parseBase(key)
  const target = parseTarget(key)
  return ratesData.value[base]?.[target] || 0
}

// Mengambil persentase perubahan yang sudah dikalkulasi
const calculateChange = (key) => {
  const base = parseBase(key)
  const target = parseTarget(key)
  return changesData.value[base]?.[target] || 0
}

const fetchFavoritesRates = async () => {
  // Ambil list base currency unik
  const uniqueBases = [...new Set(store.favorites.map(f => parseBase(f)))]
  
  // Hitung tanggal dari 3 hari yang lalu (Time Series)
  const d = new Date()
  d.setDate(d.getDate() - 3)
  const fromDate = d.toISOString().split('T')[0]

  for (const base of uniqueBases) {
    try {
      // Fetch time series data menggunakan API publik Frankfurter v2
      const res = await fetch(`https://api.frankfurter.dev/v2/rates?from=${fromDate}&base=${base}`)
      const data = await res.json()
      
      if (!ratesData.value[base]) ratesData.value[base] = {}
      if (!changesData.value[base]) changesData.value[base] = {}

      // Data dari API v2 berbentuk flat array, kita perlu kelompokkan berdasarkan quote (mata uang target)
      const groupedByQuote = {}
      data.forEach(item => {
        if (!groupedByQuote[item.quote]) groupedByQuote[item.quote] = []
        groupedByQuote[item.quote].push(item)
      })

      // Kalkulasi rate terbaru dan selisihnya
      for (const quote in groupedByQuote) {
        // Urutkan array berdasarkan tanggal dari terlama -> terbaru
        const history = groupedByQuote[quote].sort((a, b) => new Date(a.date) - new Date(b.date))
        
        // Rate terkini adalah item paling akhir di array
        const latestRate = history[history.length - 1].rate
        ratesData.value[base][quote] = latestRate

        // Hitung change % jika ada lebih dari 1 hari data
        if (history.length > 1) {
          const previousRate = history[history.length - 2].rate
          const changePercent = ((latestRate - previousRate) / previousRate) * 100
          
          // Simpan dengan pembulatan 2 desimal
          changesData.value[base][quote] = Number(changePercent.toFixed(2))
        } else {
          changesData.value[base][quote] = 0
        }
      }
    } catch (e) {
      console.error(`Gagal fetch time series untuk ${base}:`, e)
    }
  }
}

onMounted(() => {
  fetchFavoritesRates()
})
</script>

<style scoped>
.currency-row {
  background-color: #202022;
  transition: background-color 0.2s;
  border: 1px solid #2E2E2E;
}
.currency-row:hover { border: 1px solid #454547; }

.text-green { color: #CEF739; } /* Hijau Lime */
.text-red { color: #FF4D4D; }   /* Merah untuk rate turun */

.btn-star {
  width: 40px; height: 40px;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  background: transparent;
  display: flex; align-items: center; justify-content: center;
}
.btn-star.active { border-color: #CEF739;  }
.btn-star.active:hover { border-color: #CEF739;
  background-color: #2E2E2E;  }
</style>