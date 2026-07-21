// Base URL Frankfurter API
const BASE_URL = 'https://api.frankfurter.app'; 

/**
 * Mengambil daftar semua mata uang yang tersedia
 * Digunakan untuk dropdown pencarian mata uang
 */
export const getCurrencies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/currencies`);
    if (!response.ok) throw new Error('Gagal mengambil daftar mata uang');
    return await response.json();
  } catch (error) {
    console.error("API Error (getCurrencies):", error);
    throw error;
  }
};

/**
 * Mengambil nilai tukar terbaru (Live Rates)
 * @param {string} base - Mata uang asal (contoh: 'USD')
 * @param {string} target - Mata uang tujuan (opsional, contoh: 'EUR')
 */
export const getLatestRates = async (base = 'USD', target = '') => {
  try {
    // Jika ada target, ambil rate spesifik. Jika tidak, ambil semua rate terhadap base
    const url = target 
      ? `${BASE_URL}/latest?from=${base}&to=${target}` 
      : `${BASE_URL}/latest?from=${base}`;
      
    const response = await fetch(url);
    if (!response.ok) throw new Error('Gagal mengambil nilai tukar terbaru');
    return await response.json();
  } catch (error) {
    console.error("API Error (getLatestRates):", error);
    throw error;
  }
};

/**
 * Mengambil data historis untuk grafik
 * @param {string} base - Mata uang asal (contoh: 'USD')
 * @param {string} target - Mata uang tujuan (contoh: 'EUR')
 * @param {string} startDate - Tanggal mulai (Format: YYYY-MM-DD)
 * @param {string} endDate - Tanggal akhir (Format: YYYY-MM-DD)
 */
export const getHistoryRates = async (base, target, startDate, endDate) => {
  try {
    const response = await fetch(`${BASE_URL}/${startDate}..${endDate}?from=${base}&to=${target}`);
    
    if (!response.ok) throw new Error('Gagal mengambil data historis');
    
    const data = await response.json();
    
    // Validasi data kosong 
    if (!data.rates || Object.keys(data.rates).length === 0) {
      throw new Error('Data historis tidak tersedia untuk rentang waktu ini');
    }
    
    return data;
  } catch (error) {
    console.error("API Error (getHistoryRates):", error);
    throw error; 
  }
};