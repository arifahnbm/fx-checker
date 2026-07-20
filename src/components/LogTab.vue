<template>
  <div class="log-tab text-white">
    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-3 px-2">
      <h6 class="fw-bold m-0 text-white">CONVERSION LOG</h6>
      <div class="d-flex align-items-center gap-3">
        <span class="text-secondary small">{{ store.conversionLogs.length }} Logged</span>
        <button @click="store.clearLogs" class="btn-clear">CLEAR ALL</button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="store.conversionLogs.length === 0" class="text-center py-5 d-flex flex-column align-items-center justify-content-center" style="min-height: 300px;">
        <h5 class="text-secondary fw-bold mb-2">No conversions logged yet</h5>
        <p class="text-secondary opacity-75">
            Every conversion is recorded here automatically when you tap LOG CONVERSION. <br/> Your log is private to this session and this browser.
        </p>
    </div>

    <!-- Log List -->
    <div v-else class="log-list">
      <div v-for="log in store.conversionLogs" :key="log.id" 
           class="log-row p-3 mb-2 rounded-3 d-flex justify-content-between align-items-center">
        
        <!-- Left: Date/Time -->
        <div class="log-time text-secondary small" style="width: 60px;">
          {{ formatTime(log.date) }}
        </div>

        <!-- Center: Pair -->
        <div class="log-pair fw-bold flex-grow-1 px-3">
          {{ log.base }} → {{ log.target }}
        </div>

        <!-- Right: Amounts & Delete -->
        <div class="d-flex align-items-center gap-3">
          <div class="text-end d-none d-md-block">
            <span class="text-white">{{ log.amount.toLocaleString() }}</span>
          </div>
          <div class="text-end fw-bold text-lime" style="min-width: 80px;">
            {{ log.result.toLocaleString() }}
          </div>
          <button @click="store.removeLog(log.id)" class="btn-trash">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCurrencyStore } from '../stores/currencyStore'
const store = useCurrencyStore()

// Helper format waktu (bisa disesuaikan)
const formatTime = (date) => {
  const d = new Date(date)
  const hours = d.getHours()
  const minutes = d.getMinutes()
  return `${hours}h ${minutes}m`
}
</script>

<style scoped>
.log-row {
  background-color: #202022;
  border: 1px solid #2E2E2E;
}
.log-row:hover { border: 1px solid #454547; }

.text-lime { color: #CEF739; }

.btn-clear {
  background: transparent;
  border: 1px solid #2E2E2E;
  color: #9D9D9D;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
}
.btn-clear:hover { border-color: #FFFFFF; color: #FFFFFF; }

.btn-trash {
  background: transparent;
  width: 40px;
  height: 40px;
  border: 1px solid #2E2E2E;
  color: #666;
  border-radius: 8px;
  padding: 5px;
}
.btn-trash:hover { color: #FF4141; }
</style>