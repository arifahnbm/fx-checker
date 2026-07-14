import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref('USD')
  const targetCurrency = ref('EUR')

  // Logika swap disentralisasi di sini agar konsisten
  function swapCurrencies() {
    const temp = baseCurrency.value
    baseCurrency.value = targetCurrency.value
    targetCurrency.value = temp
  }

  return { baseCurrency, targetCurrency, swapCurrencies }
})