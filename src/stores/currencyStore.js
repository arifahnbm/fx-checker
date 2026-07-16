import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCurrencyStore = defineStore('currency', () => {
  const baseCurrency = ref('USD')
  const targetCurrency = ref('EUR')
  const sendAmount = ref(1000) // Pastikan ini ada
  const activeTab = ref('HISTORY') // State untuk tab aktif

  const favorites = ref([])
  const getPairKey = (base, target) => `${base}-${target}`

  function toggleFavorite(base, target) {
    const code = getPairKey(base, target) 
    if (favorites.value.includes(code)) {
      favorites.value = favorites.value.filter(item => item !== code)
    } else {
      favorites.value.push(code)
    }
  }

  function isFavorite(base, target) {
    const code = getPairKey(base, target)
    return favorites.value.includes(code)
  }

  // Logika swap disentralisasi di sini agar konsisten
  function swapCurrencies() {
    const temp = baseCurrency.value
    baseCurrency.value = targetCurrency.value
    targetCurrency.value = temp
  }

  return { baseCurrency, targetCurrency, sendAmount, activeTab, swapCurrencies, favorites, toggleFavorite, isFavorite }
})