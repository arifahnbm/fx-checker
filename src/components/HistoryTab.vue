<template>
  <div class="history-tab text-white">
    <!-- Baris Utama -->
    <div class="row g-3 mb-4">
      
      <!-- AREA KARTU STATISTIK -->
      <!-- col-12: Mengambil 100% lebar di Mobile (375px) dan Tablet (768px) -->
      <!-- col-xl-8: Menyusut menjadi 8 kolom saat Desktop (1200px / 1440px) -->
      <div class="col-12 col-xl-8">
        <div class="row g-3">
          <!-- Masing-masing Kartu -->
          <!-- col-6: Menjadi 2 kolom (50%) di Mobile -->
          <!-- col-md-3: Menjadi 4 kolom (25%) di Tablet & Desktop -->
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
      <!-- col-12: Mengambil 100% lebar dan berada di bawah kartu saat Mobile & Tablet -->
      <!-- col-xl-4: Berada di sebelah kanan kartu (4 kolom) saat Desktop -->
      <!-- d-flex, justify-content-xl-end, align-items-xl-end: Mengatur posisi tombol rata kanan-bawah HANYA di Desktop -->
      <div class="col-12 col-xl-4 d-flex justify-content-start justify-content-xl-end align-items-center  mt-3 mt-xl-0">
        <!-- flex-wrap memastikan tombol bisa turun ke baris baru jika layar terlalu sempit -->
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
      
      <!-- BAGIAN YANG DIUPDATE (TANPA DROPDOWN) -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        
        <!-- Menampilkan Mata Uang dari Pinia Store -->
        <div class="d-flex align-items-center gap-2">
          <span class="fs-5 fw-bold text-white">{{ baseCurrency }}</span>
          <span class="fs-5 text-secondary fw-bold">/</span>
          <span class="fs-5 fw-bold text-white">{{ targetCurrency }}</span>
        </div>
        
        <!-- Label Rentang Waktu (Bisa dibuat dinamis agar lebih keren) -->
        <span class="stat-label fs-6">{{ chartInfoText }}</span>
        
      </div>
      
      <!-- Loading & Chart Apex -->
      <div v-if="isLoading" class="text-center py-5 stat-label">...</div>

      <!-- KONDISI 2: Empty/Error State -->
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

// 1. Import Pinia Store dan storeToRefs
import { storeToRefs } from 'pinia';
import { useCurrencyStore } from '../stores/currencyStore'; // Sesuaikan path dengan file store-mu

// 2. Inisialisasi Store
const currencyStore = useCurrencyStore();

// 3. Ekstrak state agar tetap reaktif menggunakan storeToRefs
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
    
    // --- KODE BARU: Format string tanggal (Misal: 14 Jun 2026 - 14 Jul 2026) ---
    const dateConfig = { day: 'numeric', month: 'short', year: 'numeric' }
    // Memakai 'en-GB' agar formatnya DD MMM YYYY. Jika ingin bahasa Indonesia, ganti dengan 'id-ID'
    const startStr = new Date(startDate).toLocaleDateString('en-GB', dateConfig)
    const endStr = new Date(endDate).toLocaleDateString('en-GB', dateConfig)
    
    // -------------------------------------------------------------------------

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

    // --- KODE BARU: Membentuk format "0.8530 · MAY 14 16:00 CET" ---
    
    // Ambil tanggal terakhir dari array dates API (contoh format: "2026-05-14")
    const lastDateStr = dates[dates.length - 1]
    const dateObj = new Date(lastDateStr)
    
    // Ubah bulan jadi teks pendek Bahasa Inggris (Jan, Feb, May) lalu jadikan HURUF BESAR (MAY)
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    // Ambil tanggal
    const day = dateObj.getDate()
    // Ambil rate terakhir, format dengan 4 angka desimal
    const lastRateStr = last.toFixed(4)
    
    // (Opsional) Jika API-mu tidak mengirimkan jam, kita asumsikan penutupan pasar jam 16:00 CET
    // Jika kamu ingin jamnya mengikuti waktu user (current time), ubah '16:00 CET' jadi dinamis
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

// 4. Watcher memantau state dari Pinia Store
watch([baseCurrency, targetCurrency], () => {
  fetchHistory(activeRange.value)
})
</script>

<style scoped>
/* Menggunakan kode warna dari Style Guide Figma */
.history-tab {
  background-color: #0A0A0A; /* Neutral 900 */
}
.stat-card {
  background-color: #171719; /* Neutral 700 */
}
.chart-container {
  background-color: #171719; /* Neutral 700 */
}
.stat-label {
  color: #9D9D9D; /* Neutral 200 */
  font-size: 12px;
  letter-spacing: 0.5px;
}
.text-green { color: #42EB05 !important; } /* Green 500 */
.text-red { color: #FF4141 !important; } /* Red 500 */

.btn-range {
  background: transparent;
  color: #9D9D9D;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  /* TAMBAHKAN 3 BARIS INI */
  border: none;        /* Menghilangkan border bawaan */
  outline: none;       /* Menghilangkan outline/garis fokus biru */
  appearance: none;    /* Memastikan tombol tidak memakai style sistem operasi */
}

.btn-range:hover {
  color: #FFFFFF;
}

.btn-range.active {
  background-color: #2E2E2E; /* Warna background saat aktif */
  color: #ffffff;
  font-weight: bold;
  border: none;        /* Pastikan tidak ada border saat aktif */
  outline: none;
}

/* Opsional: Jika masih muncul garis biru saat diklik (di beberapa browser) */
.btn-range:focus {
  outline: none;
  box-shadow: none; /* Menghilangkan bayangan bawaan */
}

.currency-select-chart {
  background: transparent;
  color: #FFFFFF;
  border: none;
  font-weight: bold;
  font-size: 1.25rem; /* Ukuran h5 agar pas */
  cursor: pointer;
  outline: none;
}

/* Mengubah warna latar belakang dropdown saat diklik */
.currency-select-chart option {
  background-color: #171719; /* Sama dengan warna chart-container */
  color: #FFFFFF;
}
</style>