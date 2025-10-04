<template>
  <div class="container">
    <div class="page-header">
      <div class="date-container">
        <h2 class="date-text" style="font-weight: 800; font-size: 32px">Matoa</h2>
        <h2 class="date-text" style="font-weight: 800; font-size: 48px">{{ time }}</h2>
        <h2 class="date-text" style="font-weight: 400; font-size: 20px">{{ today }}</h2>
      </div>
      <div class="weather-info">
        <p class="temperature">{{ weather.tempc }}°C</p>
        <img
          :src="`http://openweathermap.org/img/wn/${weather.icon}@2x.png`"
          alt="Weather Icon"
          class="weather-icon"
        />
      </div>
    </div>
    <v-row class="page-content">
      <v-col cols="3">
        <v-card elevation="2" style="min-height: 545px">
          <v-card-title class="font-weight-bold">Parameter</v-card-title>
          <v-card-subtitle>Last updated at : {{ timestamp }}</v-card-subtitle>
          <v-card-text>
            <div class="d-flex flex-column pl-5 ga-1">
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">FLOW</p>
                </v-col>
                <v-col cols="6">
                  <!-- <div class="parameter-value">
                    <p class="pa-3" style="color: white">{{ flow }}</p>
                  </div> -->
                  <AlarmBox
                    :value="flow"
                    name="flow"
                    :status="alarmStatus.flow"
                    unit="m3/menit"
                    v-model:status="alarmStatus.flow"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">PH</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">{{ ph }}</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">COD</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">{{ cod }}</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">NH3-N</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">{{ nh3n }}</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">TEMP</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">{{ temp }}</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">TOTALIZER</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">{{ volume }}</p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card elevation="2" style="min-height: 545px">
          <v-card-title class="font-weight-bold">FLOW</v-card-title>
          <v-card-subtitle>Last updated at:{{ today }} {{ time }}</v-card-subtitle>
          <v-card-text class="d-flex h-100">
            <LineChart
              v-if="flowChartData.labels.length"
              :chart-data="flowChartData"
              height="360px"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <div class="d-flex flex-column">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">PH</v-card-title>
            <v-card-text>
              <LineChart v-if="phChartData.labels.length" :chart-data="phChartData" height="60px" :yMin="0" />
            </v-card-text>
          </v-card>
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">COD</v-card-title>
            <v-card-text>
              <LineChart
                v-if="codChartData.labels.length"
                :chart-data="codChartData"
                height="60px"
                :yMin ="0"
              />
            </v-card-text>
          </v-card>
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">NH3-N</v-card-title>
            <v-card-text>
              <LineChart
                v-if="nh3nChartData.labels.length"
                :chart-data="nh3nChartData"
                height="60px"
              />
            </v-card-text>
          </v-card>
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">TEMP</v-card-title>
            <v-card-text>
              <LineChart
                v-if="tempChartData.labels.length"
                :chart-data="tempChartData"
                height="60px"
              />
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from 'vue'
import axios from 'axios'
import LineChart from '@/components/charts/LineChart.vue'
import AlarmBox from '@/components/AlarmBox.vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// ⏰ Time setup
//const dayjs = inject('dayjs')
const time = ref(dayjs().tz('Asia/Jayapura').format('HH:mm'))
const today = ref(dayjs().tz('Asia/Jayapura').format('dddd, D MMMM YYYY'))
let clockInterval = null

function startClock() {
  const updateTime = () => {
    const nowInWIT = dayjs().tz('Asia/Jayapura')
    time.value = nowInWIT.format('HH:mm')
    today.value = nowInWIT.format('dddd, D MMMM YYYY')
  }

  updateTime()

  const now = dayjs()
  const msUntilNextMinute = 60000 - (now.second() * 1000 + now.millisecond())

  setTimeout(() => {
    updateTime()
    clockInterval = setInterval(updateTime, 60000)
  }, msUntilNextMinute)
}

const weather = ref({
  tempc: '',
  icon: '',
})

async function fetchWeather() {
  const token = 'test'
  const url = 'http://rumot-vps.com:1880/weather'

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    // Assuming response structure: { tempc: "24", icon: "01d" }
    weather.value.tempc = data.tempc
    weather.value.icon = data.icon
  } catch (error) {
    console.error('Failed to fetch weather:', error)
  }
}

// 📡 WebSocket sensor values
let socket = null
const flow = ref('0.000 m3/menit')
const ph = ref('0.00')
const cod = ref('0.00 mg/L')
const nh3n = ref('0.00 mg/L')
const temp = ref('0.00 °C')
const volume = ref('0.000 m3')
const timestamp = ref('YYYY-MM-DD HH:mm')

function connectWebSocket() {
  socket = new WebSocket('ws://rumot-vps.com:1880/ws_petrogas/matoa_sensor')
  socket.onmessage = (event) => {
    const payload = JSON.parse(event.data)
    flow.value = `${payload.debit}`
    ph.value = `${payload.ph}`
    cod.value = `${payload.cod} mg/L`
    nh3n.value = `${payload.nh3n} mg/L`
    temp.value = `${payload.suhu} °C`
    volume.value = `${payload.Totalizer} m3`
    timestamp.value = payload.timestamp
    localStorage.setItem('lastSensorData:matoa', JSON.stringify(payload))
  }
}

// 💾 Load cached sensor data
const cached = localStorage.getItem('lastSensorData:matoa')
if (cached) {
  const payload = JSON.parse(cached)
  flow.value = `${payload.debit}`
  ph.value = payload.ph
  cod.value = `${payload.cod} mg/L`
  nh3n.value = `${payload.nh3n} mg/L`
  temp.value = `${payload.suhu} °C`
  volume.value = `${payload.Totalizer} m3`
  timestamp.value = payload.timestamp
}

// 📊 Chart data for each parameter
const flowChartData = ref({ labels: [], datasets: [] })
const phChartData = ref({ labels: [], datasets: [] })
const codChartData = ref({ labels: [], datasets: [] })
const nh3nChartData = ref({ labels: [], datasets: [] })
const tempChartData = ref({ labels: [], datasets: [] })

async function fetchChartData() {
  const token = 'test' // Replace with actual token

  try {
    const response = await axios.get('http://rumot-vps.com:1880/graphtoday_matoa', {
      headers: {
        Authorization: `${token}`,
      },
    })

    const apiData = response.data
    const labels = apiData.map((item) => item.dtime)
    // console.log('chart data:', apiData)

    flowChartData.value = {
      labels,
      datasets: [
        {
          label: 'Flow',
          pointRadius: 1,
          pointHoverRadius: 3,
          backgroundColor: 'rgb(255, 255, 255)',
          borderColor: '#3F7EBD',
          data: apiData.map((item) => item.debit),
        },
      ],
    }

    phChartData.value = {
      labels,
      datasets: [
        {
          label: 'PH',
          pointRadius: 1,
          pointHoverRadius: 3,
          backgroundColor: 'rgb(255, 255, 255)',
          borderColor: '#8E44AD',
          data: apiData.map((item) => item.ph),
        },
      ],
    }

    codChartData.value = {
      labels,
      datasets: [
        {
          label: 'COD',
          pointRadius: 1,
          pointHoverRadius: 3,
          backgroundColor: 'rgb(255, 255, 255)',
          borderColor: '#E67E22',
          data: apiData.map((item) => item.cod),
        },
      ],
    }

    nh3nChartData.value = {
      labels,
      datasets: [
        {
          label: 'NH3-N',
          pointRadius: 1,
          pointHoverRadius: 3,
          backgroundColor: 'rgb(255, 255, 255)',
          borderColor: '#27AE60',
          data: apiData.map((item) => item.nh3n),
        },
      ],
    }

    tempChartData.value = {
      labels,
      datasets: [
        {
          label: 'TEMP',
          pointRadius: 1,
          pointHoverRadius: 3,
          backgroundColor: 'rgb(255, 255, 255)',
          borderColor: '#3498DB',
          data: apiData.map((item) => item.suhu),
        },
      ],
    }
  } catch (error) {
    console.error('Chart API error:', error)
  }
}

//alarm
const alarmStatus = ref({
  flow: 'off',
  ph: 'off',
  cod: 'off',
  nh3n: 'off',
  temp: 'off',
  totalizer: 'off',
  pir: 'off',
})

// const triggerAlarm = () => {
//   setTimeout(() => {
//     alarmStatus.value.flow = 'on'
//   }, 3000)
// }

// 🚀 Lifecycle
onMounted(() => {
  startClock()
  fetchWeather()
  connectWebSocket()
  fetchChartData()
  setInterval(fetchChartData, 60000)
  setInterval(fetchWeather, 600000)
  // triggerAlarm()
})

onBeforeUnmount(() => {
  if (socket) socket.close()
  if (clockInterval) clearInterval(clockInterval)
})
</script>

<style scoped>
.date-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-text {
  margin-bottom: 0;
  margin-top: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.weather-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.temperature {
  font-size: 50px;
  font-weight: 800;
  margin: 0;
}

.weather-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #61c134;
  border: 2px solid #ccc; /* subtle gray border for visibility */
  padding: 6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1); /* optional soft shadow */
  object-fit: contain;
}

.page-content {
  padding: 0 1rem;
}
.parameter-value {
  border-radius: 0.375rem;
  background-color: #61c134;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
