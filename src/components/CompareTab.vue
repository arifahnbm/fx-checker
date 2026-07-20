<template>
  <div class="compare-tab text-white">
    <!-- Header Tabel -->
    <div class="d-flex justify-content-between align-items-center mb-3 px-2">
      <h6 class="fw-bold m-0 text-secondary">
        MULTI-CURRENCY {{ amount }} FROM {{ baseCurrency }}
      </h6>
      <span class="text-secondary small">{{ pairs.length }} PAIRS</span>
    </div>

    <!-- Daftar Mata Uang -->
    <div class="compare-list">
      <!-- Kondisi Loading -->
      <div v-if="isLoading" class="text-center py-5 text-secondary">
        Loading comparison rates...
      </div>

      <!-- Kondisi Empty / Data Kosong -->
      <div v-else-if="pairs.length === 0" class="text-center py-5 d-flex flex-column align-items-center">
        <h5 class="text-secondary fw-bold mb-2">No comparison available</h5>
        <p class="text-secondary opacity-75">
          Enter an amount in SEND above to see what your money is worth in other currencies.
        </p>
      </div>
      <div v-else v-for="pair in pairs" :key="pair.code" class="currency-row p-3 mb-2 rounded-3 d-flex justify-content-between align-items-center">
        <!-- Kiri: Flag & Nama -->
        <div class="d-flex align-items-center gap-3">
          <img :src="getFlagUrl(pair.code)" class="currency-flag rounded-circle" alt="flag" />
          <div class="d-flex flex-column">
            <span class="fw-bold">{{ pair.code }}</span>
            <small class="text-secondary">
                {{ currencyNames[pair.code] || 'Unknown Currency' }}
            </small>
          </div>
        </div>

        <!-- Kanan: Nilai & Favorite -->
        <div class="d-flex align-items-center gap-4">
          <div class="text-end">
            <div class="fw-bold fs-5">
              {{ formatNumber(Number(amount) * Number(pair.rate)) }}
            </div>
            <small class="text-secondary">@ {{ pair.rate.toFixed(4) }}</small>
          </div>
          <button @click="store.toggleFavorite(store.baseCurrency, pair.code)" 
        :class="['btn-star', store.isFavorite(store.baseCurrency, pair.code) ? 'active' : '']">
            <!-- Icon Bintang (Non-Favorite) -->
            <svg v-if="!store.isFavorite(store.baseCurrency, pair.code)" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019ZM10.3559 9.32488L12.7231 7.028L9.46529 6.55925L8.01217 3.60613L6.53561 6.55925L3.27779 7.028L5.64498 9.32488L5.08248 12.5593L8.01217 11.0358L10.9184 12.5593L10.3559 9.32488Z" fill="white"/>
            </svg>

            <!-- Icon Bintang (Favorite) -->
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081Z" fill="#CEF739"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useCurrencyStore } from '../stores/currencyStore'
import { getLatestRates } from '../services/api'
import currencyNames from '../assets/currencies.json'

const store = useCurrencyStore()
const amount = computed(() => store.sendAmount)
const baseCurrency = computed(() => store.baseCurrency)
const pairs = ref([])
const isLoading = ref(false)

// fungsi getFlagUrl
const getFlagUrl = (currencyCode) => {
  if (!currencyCode) return ''
  const prefix = currencyCode.substring(0, 2).toLowerCase()
  return `/images/flags/${prefix}.webp`
}

// fungsi formatNumber
const formatNumber = (val) => {
  return val.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })
}

watch(() => [amount.value, pairs.value], () => {
  console.log("DEBUG AMOUNT:", amount.value);
  console.log("DEBUG PAIRS:", pairs.value);
}, { immediate: true });

// Fungsi Fetch Data
const fetchCompareRates = async () => {
  isLoading.value = true
  try {
    const data = await getLatestRates(store.baseCurrency)
    
    if (data && data.rates) {
      pairs.value = Object.entries(data.rates).map(([code, rate]) => ({
        code,
        rate,
        isFavorite: false
      }))
    }
  } catch (error) {
    console.error("Gagal ambil data:", error)
  } finally {
    isLoading.value = false
  }
}

// Watcher untuk perubahan mata uang
watch(() => store.baseCurrency, () => {
  fetchCompareRates()
})

onMounted(() => {
  fetchCompareRates()
})
</script>

<style scoped>
.compare-list {
  display: flex;
  flex-direction: column;
}

.currency-row {
  background-color: #202022;
  border: 1px solid #2E2E2E;
  transition: all 0.3s ease;
}

/* Saat baris difokuskan atau dipilih */
.currency-row:focus, .currency-row:active, .currency-row.active {
  border: 1px solid #CEF739; 
  background-color: #202022;
}

.currency-row:hover {
  border: 1px solid #454547;
}

.currency-flag {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.btn-star {
  width: 40px; height: 40px;
  border: 1px solid #2E2E2E;
  border-radius: 8px; 
  background: transparent;
  display: flex; align-items: center; justify-content: center;
}

.btn-star:hover {
  transform: scale(1.2);
}

.btn-star.active {
  border-color: #CEF739;
}
.btn-star.active:hover {
  border-color: #CEF739;
  background-color: #2E2E2E;  
}
</style>