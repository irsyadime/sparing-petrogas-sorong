<template>
  <div class="container">
    <div class="page-header">
      <div class="date-container">
        <h2 class="date-text" style="font-weight: 800; font-size: 32px">Sorong</h2>
        <h2 class="date-text" style="font-weight: 800; font-size: 48px">{{ time }}</h2>
        <h2 class="date-text" style="font-weight: 400; font-size: 20px">{{ today }}</h2>
      </div>
      <p class="temperature">24°C</p>
    </div>
    <v-row class="page-content">
      <v-col cols="4">
        <v-card elevation="2" style="min-height: 545px">
          <v-card-title class="font-weight-bold">Parameter</v-card-title>
          <v-card-subtitle>Last updated at:{{ today }} {{ time }}</v-card-subtitle>
          <v-card-text>
            <div class="d-flex flex-column pl-5 pr-5 ga-3">
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">FLOW</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">0.005 m3/jam</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">PH</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">7.67</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">COD</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">97.58 mg/L</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">NH3-N</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">0 mg/L</p>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6" class="d-flex align-center">
                  <p class="font-weight-bold">TEMP</p>
                </v-col>
                <v-col cols="6">
                  <div class="parameter-value">
                    <p class="pa-3" style="color: white">25.31 C</p>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card elevation="2" style="min-height: 545px">
          <v-card-title class="font-weight-bold">FLOW</v-card-title>
          <v-card-subtitle>Last updated at:{{ today }} {{ time }}</v-card-subtitle>
          <v-card-text class="d-flex h-100">
            <LineChart :chart-data="chartData" height="360px" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <div class="d-flex flex-column">
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">PH</v-card-title>
            <v-card-text>
              <LineChart :chart-data="chartData" height="60px" />
            </v-card-text>
          </v-card>
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">COD</v-card-title>
            <v-card-text>
              <LineChart :chart-data="chartData" height="60px" />
            </v-card-text>
          </v-card>
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">NH3-N</v-card-title>
            <v-card-text>
              <LineChart :chart-data="chartData" height="60px" />
            </v-card-text>
          </v-card>
          <v-card elevation="2" class="mb-4">
            <v-card-title class="font-weight-bold">TEMP</v-card-title>
            <v-card-text>
              <LineChart :chart-data="chartData" height="60px" />
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { inject } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'

const dayjs = inject('dayjs')
const today = dayjs().format('dddd, D MMMM YYYY')
const time = dayjs().format('HH:mm')

// Dummy data (sementara sebelum MQTT)
const label_json_flow = ['10:00', '10:05', '10:10', '10:15', '10:20']
const data_json_flow = [5, 7, 4, 9, 6]

const chartData = {
  labels: label_json_flow,
  datasets: [
    {
      label: 'Flow',
      pointRadius: 1,
      pointHoverRadius: 1,
      backgroundColor: 'rgb(255, 255, 255)',
      borderColor: '#3F7EBD',
      data: data_json_flow,
    },
  ],
}
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

.temperature {
  font-size: 50px;
  font-weight: 800;
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
