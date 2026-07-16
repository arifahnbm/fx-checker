<template>
  <div class="converter-section mb-5">
    <h5 class="fw-bold mb-3 tracking-wide text-white">CHECK THE RATE</h5>
    
    <div class="converter-card p-4 rounded-4">
      
      <div class="row align-items-center g-3">
        
        <!-- ================= KOTAK SEND ================= -->
        <div class="col-12 col-md-5">
          <div class="input-box p-3 rounded-3 d-flex flex-column gap-2">
            <span class="text-secondary small">SEND</span>
            <div class="d-flex justify-content-between align-items-center">
              <input type="number" v-model="sendAmount" class="amount-input" />
              
              <div class="currency-dropdown-wrapper d-flex align-items-center gap-2 px-2 py-1 rounded-3">
                <!-- Gunakan baseCurrency dari Pinia -->
                <img :src="getFlagUrl(baseCurrency)" alt="flag" class="currency-flag rounded-circle object-fit-cover" />
                <select v-model="baseCurrency" class="currency-selector">
                  <option v-for="(name, code) in currencies" :key="code" :value="code">{{ code }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- ================= TOMBOL SWAP ================= -->
        <div class="col-12 col-md-2 d-flex justify-content-center">
          <!-- Panggil fungsi swapCurrencies langsung dari store -->
          <button @click="store.swapCurrencies()" class="btn-swap d-flex align-items-center justify-content-center rounded-3">
            ⇄
          </button>
        </div>
        
        <!-- ================= KOTAK RECEIVE ================= -->
        <div class="col-12 col-md-5">
          <div class="input-box p-3 rounded-3 d-flex flex-column gap-2">
            <span class="text-secondary small">RECEIVE</span>
            <div class="d-flex justify-content-between align-items-center">
              <span class="amount-output fw-bold">
                {{ isLoading ? '...' : receiveAmount }}
              </span>
              
              <div class="currency-dropdown-wrapper d-flex align-items-center gap-2 px-2 py-1 rounded-3">
                <!-- Gunakan targetCurrency dari Pinia -->
                <img :src="getFlagUrl(targetCurrency)" alt="flag" class="currency-flag rounded-circle object-fit-cover" />
                <select v-model="targetCurrency" class="currency-selector">
                  <option v-for="(name, code) in currencies" :key="code" :value="code">{{ code }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <hr class="border-secondary my-4" style="--bs-border-opacity: .3; border-style: dashed;" />

      <!-- ================= BARIS BAWAH ================= -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div class="rate-info small">
          <strong>1</strong> {{ baseCurrency }} = <strong>{{ currentRate.toFixed(4) }}</strong> {{ targetCurrency }}
        </div>
        
        <div class="d-flex gap-2 align-items-center md-justify-content-end">
          <button @click="store.toggleFavorite(store.baseCurrency, store.targetCurrency)"
        :class="['btn fw-bold px-4 py-2 d-flex align-items-center gap-2', 
                 store.isFavorite(store.baseCurrency, store.targetCurrency) ? 'btn-lime' : 'btn-outline-secondary']">
    
            <!-- Icon Bintang (Non-Favorite) -->
            <svg v-if="!store.isFavorite(store.baseCurrency, store.targetCurrency)" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019ZM10.3559 9.32488L12.7231 7.028L9.46529 6.55925L8.01217 3.60613L6.53561 6.55925L3.27779 7.028L5.64498 9.32488L5.08248 12.5593L8.01217 11.0358L10.9184 12.5593L10.3559 9.32488Z" fill="currentColor"/>
            </svg>

            <!-- Icon Bintang (Favorite/Filled) -->
            <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M7.33248 2.41081C7.61373 1.84831 8.41061 1.87175 8.66842 2.41081L10.2153 5.528L13.6372 6.02019C14.2465 6.11394 14.4809 6.86394 14.0356 7.30925L11.5747 9.72331L12.1606 13.1218C12.2544 13.7311 11.5981 14.1999 11.059 13.9186L8.01217 12.3014L4.94186 13.9186C4.40279 14.1999 3.74654 13.7311 3.84029 13.1218L4.42623 9.72331L1.96529 7.30925C1.51998 6.86394 1.75436 6.11394 2.36373 6.02019L5.80904 5.528L7.33248 2.41081Z" fill="#000000"/>
            </svg>

            {{ store.isFavorite(store.baseCurrency, store.targetCurrency) ? 'FAVORITED' : 'FAVORITE' }}
          </button>
          <button @click="handleLog" class="btn btn-outline fw-bold px-4 py-2" style="outline: 1px solid #CEF739; ">
            LOG CONVERSION
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getCurrencies, getLatestRates } from '../services/api'

import { storeToRefs } from 'pinia'
import { useCurrencyStore } from '../stores/currencyStore' // Sesuaikan letak path file

// 2. Inisialisasi Store
const store = useCurrencyStore()

// 3. Ekstrak State (WAJIB pakai storeToRefs untuk state)
const { baseCurrency, targetCurrency } = storeToRefs(store) // Gunakan storeToRefs untuk reactive state
// Catatan: Fungsi `swapCurrencies` JANGAN di dalam storeToRefs, panggil via `currencyStore.swapCurrencies()`

const currencies = ref({})
const sendAmount = ref(1000)
const receiveAmount = ref(0)
const currentRate = ref(0)
const isLoading = ref(false)

const loadCurrencies = async () => {
  try {
    const data = await getCurrencies()
    currencies.value = data
  } catch (error) {
    console.error("Gagal memuat mata uang:", error)
  }
}

const calculateConversion = async () => {
  if (!sendAmount.value || sendAmount.value <= 0) {
    receiveAmount.value = 0
    return
  }
  
  isLoading.value = true
  try {
    const data = await getLatestRates(baseCurrency.value, targetCurrency.value)
    currentRate.value = data.rates[targetCurrency.value]
    
    const result = sendAmount.value * currentRate.value
    receiveAmount.value = result.toFixed(2)
  } catch (error) {
    console.error("Gagal menghitung kurs:", error)
  } finally {
    isLoading.value = false
  }
}

const getFlagUrl = (currencyCode) => {
  if (!currencyCode) return ''
  const prefix = currencyCode.substring(0, 2).toLowerCase()
  return `/images/flags/${prefix}.webp`
}

onMounted(async () => {
  await loadCurrencies()
  calculateConversion()
})

// 4. Watch akan langsung bekerja bereaksi terhadap state Pinia
watch([sendAmount, baseCurrency, targetCurrency], () => {
  calculateConversion()
})

const handleLog = () => {
  store.addLog(
    baseCurrency.value, 
    targetCurrency.value, 
    sendAmount.value, 
    receiveAmount.value
  );
  alert("Conversion saved to Log!");
}
</script>


<style scoped>
.tracking-wide { letter-spacing: 1px; }

.converter-card { background-color: #171719; }

.input-box {
  background-color: #202022;
  border: 1px solid transparent;
  transition: border 0.2s;
}
.input-box:focus-within { border: 1px solid #CEF739; }

.amount-input {
  background: transparent;
  border: none;
  color: #FFFFFF;
  font-size: 24px;
  font-weight: 700;
  width: 100%;
  outline: none;
  font-family: 'JetBrains Mono', monospace;
}
.amount-output {
  color: #CEF739;
  font-size: 24px;
}

/* === CSS BARU UNTUK BENDERA DAN DROPDOWN === */
.currency-dropdown-wrapper {
  background-color: #2E2E2E;
  transition: background-color 0.2s;
  cursor: pointer;
}
.currency-dropdown-wrapper:hover { background-color: #3D3D3D; }

.currency-flag {
  width: 24px;
  height: 24px;
}

.currency-selector {
  background: transparent;
  color: #FFFFFF;
  border: none;
  font-weight: 600;
  cursor: pointer;
  outline: none;
}
.currency-selector option {
  background-color: #2E2E2E;
  color: #FFFFFF;
}

.btn-swap {
  background-color: #202022;
  color: #FFFFFF;
  border: 1px solid #2E2E2E;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
}
.btn-swap:hover { border-color: #CEF739; color: #CEF739; }

.btn-lime {
  background-color: #CEF739;
  color: #0A0A0A;
  border: none;
  border-radius: 8px;
}

.btn-outline-secondary {
  border: 1px solid #2E2E2E;
  color: #fff;
  background-color: transparent;
}
.btn-outline-secondary:hover {
  border: 1px solid #ffffff;
  color: #ffffff;
  background-color: #2E2E2E;
}

.btn-lime:hover { background-color: #B5DC32; }

.btn-outline {
  background-color: transparent;
  color: #FFFFFF;
  border: 1px solid #FFFFFF;
  border-radius: 8px;
}

.btn-outline:hover { background-color: #2E2E2E; }

.rate-info {
  color: #9D9D9D;
  letter-spacing: 0.5px;
}
.rate-info strong {
  color: #FFFFFF;
}
</style>