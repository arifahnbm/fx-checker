import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref('USD')
  const targetCurrency = ref('EUR')
  const sendAmount = ref(1000) // Pastikan ini ada
  const activeTab = ref('HISTORY') // State untuk tab aktif

  // Logika swap disentralisasi di sini agar konsisten
  function swapCurrencies() {
    const temp = baseCurrency.value
    baseCurrency.value = targetCurrency.value
    targetCurrency.value = temp
  }

  return { baseCurrency, targetCurrency, sendAmount, activeTab, swapCurrencies }
})