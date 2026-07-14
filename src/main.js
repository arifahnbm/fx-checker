import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Import CSS dari Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'

// Import plugin ApexCharts
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(createPinia())

// Daftarkan ApexCharts agar bisa digunakan di semua komponen
app.use(VueApexCharts)

// Pasang aplikasi Vue ke dalam <div id="app"> di index.html
app.mount('#app')