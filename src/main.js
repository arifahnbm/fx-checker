import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(createPinia())

app.use(VueApexCharts)

// Pasang aplikasi Vue ke dalam <div id="app"> di index.html
app.mount('#app')