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
      <div v-for="pair in pairs" :key="pair.code" class="currency-row p-3 mb-2 rounded-3 d-flex justify-content-between align-items-center">
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
          <button @click="toggleFavorite(pair)" class="btn-star border-0 bg-transparent">
            <span :class="pair.isFavorite ? 'text-warning' : 'text-secondary'">★</span>
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

// 1. Definisikan fungsi getFlagUrl
const getFlagUrl = (currencyCode) => {
  if (!currencyCode) return ''
  const prefix = currencyCode.substring(0, 2).toLowerCase()
  return `/images/flags/${prefix}.webp`
}

// 2. Definisikan fungsi formatNumber
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

// 3. Fungsi Fetch Data
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
  background-color: #171719;
  transition: background-color 0.2s;
  border: 1px solid #202022;
}

.currency-row:hover {
  background-color: #1e1e21;
}

.currency-flag {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

.btn-star {
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-star:hover {
  transform: scale(1.2);
}
</style>