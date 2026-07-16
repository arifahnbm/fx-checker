<template>
  <div class="favorites-tab text-white">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3 px-2">
      <h6 class="fw-bold m-0 text-white">PINNED PAIRS</h6>
      <span class="text-secondary small">{{ store.favorites.length }} FAVORITES</span>
    </div>

    <!-- Empty State -->
    <div v-if="store.favorites.length === 0" class="text-center py-5 d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
        <h5 class="text-secondary fw-bold mb-2">No favorites yet</h5>
        <p class="text-secondary opacity-75">
            You haven't pinned any currency pairs.<br>
            Start pinning pairs to see them here.
        </p>
    </div>

    <!-- List -->
    <div v-else class="favorites-list">
      <div v-for="pairKey in store.favorites" :key="pairKey" 
           class="currency-row p-3 mb-2 rounded-3 d-flex justify-content-between align-items-center">
        
        <!-- Pair Text (USD -> EUR) -->
        <div class="d-flex align-items-center">
          <span class="fw-bold fs-5">{{ formatPair(pairKey) }}</span>
        </div>

        <!-- Right: Rate & Star -->
        <div class="d-flex align-items-center gap-4">
          <div class="text-end">
            <div class="fw-bold fs-5">{{ getRate(pairKey) > 0 ? getRate(pairKey).toFixed(4) : '...' }}</div> <!-- Placeholder Rate -->
            <small :class="calculateChange(pairKey) >= 0 ? 'text-green' : 'text-red'">
                {{ (calculateChange(pairKey) > 0 ? '+' : '') + calculateChange(pairKey) + '%' }}
            </small> <!-- Placeholder Change -->
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
import { getLatestRates } from '../services/api'
const store = useCurrencyStore()
const ratesData = ref({})

// Helper untuk memformat tampilan "USD -> EUR"
const formatPair = (key) => key.replace('-', ' → ')
const parseBase = (key) => key.split('-')[0]
const parseTarget = (key) => key.split('-')[1]

// Mengambil rate berdasarkan key "USD-EUR"
const getRate = (key) => {
  const base = parseBase(key)
  const target = parseTarget(key)
  return ratesData.value[base]?.[target] || 0
}

// Fetch data saat komponen dimuat
const fetchFavoritesRates = async () => {
  // Ambil list base currency yang unik dari favorites
  const uniqueBases = [...new Set(store.favorites.map(f => parseBase(f)))]
  
  for (const base of uniqueBases) {
    try {
      const data = await getLatestRates(base)
      ratesData.value[base] = data.rates
    } catch (e) {
      console.error(`Gagal fetch ${base}:`, e)
    }
  }
}

onMounted(() => {
  fetchFavoritesRates()
})

// kita kembalikan 0 dulu agar tidak crash.
const calculateChange = (key) => {
  // Jika nanti kamu sudah punya data historis, logicnya taruh di sini
  return 0.16; // Placeholder sementara agar tampilan tidak error
}

</script>

<style scoped>
.currency-row {
  background-color: #171719;
  border: 1px solid #202022;
  transition: background-color 0.2s;
}
.currency-row:hover { background-color: #1e1e21; }

.btn-star {
  width: 40px; height: 40px;
  border: 1px solid #2E2E2E;
  border-radius: 8px;
  background: transparent;
  display: flex; align-items: center; justify-content: center;
}
.btn-star.active { border-color: #CEF739; }
</style>