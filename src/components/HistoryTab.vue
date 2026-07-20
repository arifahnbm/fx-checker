<template>
  <div class="history-tab text-white">
    <!-- Baris Utama -->
    <div class="row g-3 mb-4">
      
      <!-- AREA KARTU STATISTIK -->
      <div class="col-12 col-xl-8">
        <div class="row g-3">
          <!-- Masing-masing Kartu -->
          <div class="col-6 col-md-3">
            <div class="stat-card p-3 rounded-3 h-100">
              <div class="stat-label mb-1">OPEN</div>
              <div class="fw-bold fs-4">{{ isLoading ? '...' : stats.open }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card p-3 rounded-3 h-100">
              <div class="stat-label mb-1">LAST</div>
              <div class="fw-bold fs-4">{{ isLoading ? '...' : stats.last }}</div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card p-3 rounded-3 h-100">
              <div class="stat-label mb-1">CHANGE</div>
              <div class="fw-bold fs-4" :class="stats.change >= 0 ? 'text-green' : 'text-red'">
                {{ isLoading ? '...' : (stats.change > 0 ? '+' : '') + stats.change }}
              </div>
            </div>
          </div>
          <div class="col-6 col-md-3">
            <div class="stat-card p-3 rounded-3 h-100">
              <div class="stat-label mb-1">% CHANGE</div>
              <div class="fw-bold fs-4" :class="stats.changePct >= 0 ? 'text-green' : 'text-red'">
                {{ isLoading ? '...' : (stats.changePct >= 0 ? '▲ +' : '▼ ') + stats.changePct + '%' }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- AREA TOMBOL RENTANG WAKTU -->
      <div class="col-12 col-xl-4 d-flex justify-content-start justify-content-xl-end align-items-center  mt-3 mt-xl-0">
        <div class="d-flex flex-wrap gap-" style="background-color: #171719; padding: 8px 12px; border-radius: 8px;">
          <button 
            v-for="r in ranges" 
            :key="r"
            @click="fetchHistory(r)"
            class="btn-range"
            :class="{ 'active': activeRange === r }"
          >
            {{ r }}
          </button>
        </div>
      </div>
      
    </div>

    <!-- Area Grafik (Chart) -->
    <div class="chart-container p-4 rounded-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        
        <!-- Menampilkan Mata Uang dari Pinia Store -->
        <div class="d-flex align-items-center gap-2">
          <span class="fs-5 fw-bold text-white">{{ baseCurrency }}</span>
          <span class="fs-5 text-secondary fw-bold">/</span>
          <span class="fs-5 fw-bold text-white">{{ targetCurrency }}</span>
        </div>
        
        <!-- Label Rentang Waktu -->
        <span class="stat-label fs-6">{{ chartInfoText }}</span>
        
      </div>
      
      <!-- Loading & Chart Apex -->
      <div v-if="isLoading" class="text-center py-5 stat-label">...</div>

      <!-- Empty/Error State -->
      <div v-else-if="series.length === 0" class="text-center py-5 d-flex flex-column align-items-center justify-content-center" style="min-height: 350px;">
        <h5 class="text-secondary fw-bold mb-2">No chart data available</h5>
        <p class="text-secondary opacity-75">
          We couldn't load rate history for {{ baseCurrency }}/{{ targetCurrency }} right now.<br>
          This usually clears up in a minute.
        </p>
      </div>

      <apexchart v-else type="area" height="350" :options="chartOptions" :series="series" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { getHistoryRates } from '../services/api';
import { storeToRefs } from 'pinia';
import { useCurrencyStore } from '../stores/currencyStore';

// Inisialisasi Store
const currencyStore = useCurrencyStore();

// Ekstrak state agar tetap reaktif menggunakan storeToRefs
const { baseCurrency, targetCurrency } = storeToRefs(currencyStore);

const isLoading = ref(true)
const stats = ref({ open: 0, last: 0, change: 0, changePct: 0 })
const series = ref([])
const activeRange = ref('1M')
const ranges = ['1D', '1W', '1M', '3M', '1Y', '5Y']
const chartInfoText = ref('')

const chartOptions = ref({
  chart: { toolbar: { show: false }, background: 'transparent' },
  colors: ['#CEF739'],
  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.1 } },
  dataLabels: { enabled: false },
  stroke: { curve: 'straight', width: 2 },
  xaxis: { type: 'datetime', labels: { style: { colors: '#9D9D9D' } }, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { style: { colors: '#9D9D9D' } } },
  grid: { borderColor: '#2E2E2E', strokeDashArray: 4 },
  theme: { mode: 'dark' }
})

const getStartDate = (range) => {
  const now = new Date()
  if (range === '1D') now.setDate(now.getDate() - 1)
  else if (range === '1W') now.setDate(now.getDate() - 7)
  else if (range === '1M') now.setMonth(now.getMonth() - 1)
  else if (range === '3M') now.setMonth(now.getMonth() - 3)
  else if (range === '1Y') now.setFullYear(now.getFullYear() - 1)
  else if (range === '5Y') now.setFullYear(now.getFullYear() - 5)
  return now.toISOString().split('T')[0]
}

const fetchHistory = async (range = '1M') => {
  isLoading.value = true
  activeRange.value = range
  try {
    const endDate = new Date().toISOString().split('T')[0]
    const startDate = getStartDate(range)
    const dateConfig = { day: 'numeric', month: 'short', year: 'numeric' }
    const startStr = new Date(startDate).toLocaleDateString('en-GB', dateConfig)
    const endStr = new Date(endDate).toLocaleDateString('en-GB', dateConfig)

    const data = await getHistoryRates(baseCurrency.value, targetCurrency.value, startDate, endDate)
    const dates = Object.keys(data.rates)
    const rates = dates.map(date => data.rates[date][targetCurrency.value])
    
    series.value = [{
      name: `${baseCurrency.value}/${targetCurrency.value}`,
      data: dates.map((date, index) => ({ x: date, y: rates[index] }))
    }]
    
    const open = rates[0]
    const last = rates[rates.length - 1]
    const change = last - open
    const changePct = (change / open) * 100
    
    stats.value = {
      open: open.toFixed(4),
      last: last.toFixed(4),
      change: change.toFixed(4),
      changePct: changePct.toFixed(2)
    }

    const lastDateStr = dates[dates.length - 1]
    const dateObj = new Date(lastDateStr)
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    const day = dateObj.getDate()
    const lastRateStr = last.toFixed(4)
    const timeZoneStr = '16:00 CET' 
    
    // Gabungkan semuanya menggunakan simbol titik tengah (·)
    chartInfoText.value = `${lastRateStr} · ${month} ${day} ${timeZoneStr}`


  } catch (error) {
    console.error("Gagal memproses data history:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchHistory())

// Watcher memantau state dari Pinia Store
watch([baseCurrency, targetCurrency], () => {
  fetchHistory(activeRange.value)
})
</script>

<style scoped>
.history-tab {
  background-color: #0A0A0A; 
}
.stat-card {
  background-color: #171719; 
}
.chart-container {
  background-color: #171719; 
}
.stat-label {
  color: #9D9D9D; 
  font-size: 12px;
  letter-spacing: 0.5px;
}
.text-green { color: #42EB05 !important; } 
.text-red { color: #FF4141 !important; } 

.btn-range {
  background: transparent;
  color: #9D9D9D;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;      
  outline: none;       
  appearance: none;    
}

.btn-range:hover {
  color: #FFFFFF;
}

.btn-range.active, .btn-range:focus {
  background-color: #2E2E2E; 
  color: #CEF739;
  border: 1px solid #CEF739; 
  font-weight: bold;
}

.currency-select-chart {
  background: transparent;
  color: #FFFFFF;
  border: none;
  font-weight: bold;
  font-size: 1.25rem; 
  cursor: pointer;
  outline: none;
}

/* Mengubah warna latar belakang dropdown saat diklik */
.currency-select-chart option {
  background-color: #171719; 
  color: #FFFFFF;
}
</style>