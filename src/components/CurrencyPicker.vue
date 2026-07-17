<template>
  <div class="currency-picker" v-click-outside="closeDropdown">
    <!-- Trigger (Tampilan yang diklik) -->
    <div class="picker-trigger" @click="isOpen = !isOpen">
      <img :src="getFlagUrl(modelValue)" class="flag-icon" />
      <span class="fw-bold">{{ modelValue }}</span>
      <span class="chevron">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.98838 4.01953H9.01182C9.4337 4.01953 9.64463 4.53516 9.33995 4.83984L6.33995 7.83984C6.15245 8.02734 5.84776 8.02734 5.66026 7.83984L2.66026 4.83984C2.35557 4.53516 2.56651 4.01953 2.98838 4.01953Z" fill="white"/>
        </svg>
      </span>
    </div>

    <!-- Dropdown Modal -->
    <div v-if="isOpen" class="dropdown-overlay">
      <input type="text" v-model="searchQuery" placeholder="Search currencies..." class="search-input" />

      <!-- Popular -->
      <div class="section-title">POPULAR</div>
      <div v-for="code in popular" :key="code" class="currency-item" @click="select(code)">
        <div class="d-flex align-items-center gap-2">
          <img :src="getFlagUrl(code)" class="flag-icon" />
          <div>
            <div class="fw-bold">{{ code }}</div>
            <small class="text-secondary">{{ currencyNames[code] }}</small>
          </div>
        </div>
        <span v-if="modelValue === code">✓</span>
      </div>

      <!-- Other -->
      <div class="section-title mt-3">OTHER CURRENCIES</div>
      <div v-for="code in others" :key="code" class="currency-item" @click="select(code)">
        <div class="d-flex align-items-center gap-2">
          <img :src="getFlagUrl(code)" class="flag-icon" />
          <div>
            <div class="fw-bold">{{ code }}</div>
            <small class="text-secondary">{{ currencyNames[code] }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import currencyNames from '../assets/currencies.json';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const searchQuery = ref('');
const popularList = ['USD', 'EUR', 'GBP'];

const getFlagUrl = (code) => `/images/flags/${code.substring(0, 2).toLowerCase()}.webp`;

const filteredCurrencies = computed(() => {
  return Object.keys(currencyNames).filter(code => 
    code.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
    currencyNames[code].toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const popular = computed(() => filteredCurrencies.value.filter(c => popularList.includes(c)));
const others = computed(() => filteredCurrencies.value.filter(c => !popularList.includes(c)));

const select = (code) => {
  emit('update:modelValue', code);
  isOpen.value = false;
  searchQuery.value = '';
};

const closeDropdown = () => isOpen.value = false;
</script>

<style scoped>
.currency-picker { 
    position: relative; 
    width: 150px; 
}
.picker-trigger { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    background-color: #202022; 
    cursor: pointer; 
    padding: 5px; 
    width: fit-content;
    border-radius: 8px;
}
.dropdown-overlay {
  position: absolute; 
  top: 100%; 
  left: 0; 
  z-index: 1000;
  background: #171719; 
  border: 1px solid #333;
  width: 300px; 
  max-height: 400px; 
  overflow-y: auto;
  padding: 15px; 
  border-radius: 12px;
}
.search-input { 
    width: 100%; 
    background: #202022; 
    border: none; 
    padding: 10px; 
    color: white; 
    border-radius: 8px; 
    margin-bottom: 15px; 
}
.section-title { 
    font-size: 10px; 
    color: #666; 
    margin-bottom: 10px; 
}
.currency-item { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 10px 0; 
    cursor: pointer; 
}
.currency-item:hover { 
    background: #202022; 
}
.flag-icon { 
    width: 24px; 
    height: 24px; 
    border-radius: 50%; 
    object-fit: cover; 
}
.chevron {
  transition: transform 0.2s ease;
}

.picker-trigger:hover .chevron {
  fill: #FFFFFF; /* Berubah putih saat di-hover */
}
</style>