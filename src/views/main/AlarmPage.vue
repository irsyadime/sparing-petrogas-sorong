<template>
  <div class="container">
    <div class="header" style="padding-top: 2rem">
      <h2 class="title" style="font-weight: 800; font-size: 32px">Alarm</h2>
    </div>
    <v-container>
      <v-card elevation="2" class="d-flex flex-column ga-3">
        <v-row class="pt-5 pl-5 pb-0">
          <v-col cols="4">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              :offset="[0, 8]"
              location="bottom center"
              min-width="290px"
              max-width="290px"
            >
              <template v-slot:activator="{ props }">
                <v-text-field
                  label="Date"
                  variant="outlined"
                  v-model="formattedDate"
                  v-bind="props"
                  readonly
                  @click:clear="onClear"
                  clearable
                >
                  <template v-slot:append-inner>
                    <v-icon icon="mdi-calendar-today"></v-icon>
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="selectedDate"
                @update:model-value="menu = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="4">
            <v-btn size="x-large" color="#61c134" class="btn-search">Cari</v-btn>
          </v-col>
          <v-col cols="4">
            <div class="d-flex justify-end pr-3">
              <v-btn size="x-large" color="#61c134" class="btn-search">Settings</v-btn>
            </div>
          </v-col>
        </v-row>
        <div class="pa-5 w-100">
          <v-data-table
            :headers="headers"
            :items="alarms"
            class="elevation-3"
            v-model:page="page"
            :items-per-page="itemPerPage"
          >
            <template #item.no="{ index }">
              {{ (page - 1) * itemPerPage + index + 1 }}
            </template>

            <template #item.status="{ item }">
              <v-chip :color="getStatusColor(item.status)" text-color="white" size="default">
                {{ item.status }}
              </v-chip>
            </template>
            <template #item.pir="{ item }">
              <v-chip :color="getPirColor(item.pir)" text-color="white" size="default">
                {{ item.pir === 1 ? 'ON' : 'OFF' }}
              </v-chip>
            </template>

            <!-- <template v-slot:bottom>
              <div class="text-center pt-2">
                <v-pagination v-model="page" :length="pageCount" />
              </div>
            </template> -->
          </v-data-table>
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import { tableData } from '@/utils/dummyData'
import { ref, computed, inject } from 'vue'

const dayjs = inject('dayjs')
const itemPerPage = ref(5)
const page = ref(1)
const menu = ref(false)
const selectedDate = ref(null)
const formattedDate = computed({
  get: () => (selectedDate.value ? dayjs(selectedDate.value).format('DD-MMMM-YYYY') : ''),
  set: (val) => {
    if (!val) {
      selectedDate.value = null
    }
  },
})

const headers = [
  { title: 'No', key: 'no', width: '50px', align: 'center', sortable: false },
  { title: 'Waktu Alarm', key: 'timestamp' },
  { title: 'Parameter', key: 'parameter' },
  { title: 'Nilai Terukur', key: 'value' },
  { title: 'Status', key: 'status' },
  // { title: 'Severity', key: 'severity' },
  { title: 'PIR', key: 'pir' },
  { title: 'Lokasi', key: 'location' },
]

const alarms = ref([
  {
    timestamp: '2025-09-12 10:30:00',
    parameter: 'pH',
    value: 9.2,
    threshold: '6.0 - 9.0',
    status: 'high',
    severity: 'Critical',
    location: 'Outlet 1',
    pir: 1,
  },
  {
    timestamp: '2025-09-12 09:45:00',
    parameter: 'COD',
    value: 95,
    threshold: '< 90',
    status: 'alarm',
    severity: 'Warning',
    location: 'Outlet 2',
    pir: 0,
  },
  {
    timestamp: '2025-09-12 08:20:00',
    parameter: 'NH3N',
    value: 2.1,
    threshold: '< 2.0',
    status: 'normal',
    severity: 'Info',
    location: 'Outlet 1',
    pir: 1,
  },
])

const pageCount = computed(() => Math.ceil(tableData.length / itemPerPage.value))

const onClear = () => {
  selectedDate.value = null
}

function getSeverityColor(severity) {
  switch (severity) {
    case 'Critical':
      return 'red'
    case 'Warning':
      return 'orange'
    case 'Info':
      return 'blue'
    default:
      return 'grey'
  }
}
function getStatusColor(status) {
  switch (status) {
    case 'high':
      return 'red'
    case 'alarm':
      return 'red'
    case 'normal':
      return 'green'
    default:
      return 'grey'
  }
}
const getPirColor = (pir) => {
  return pir == 1 ? 'red' : 'green'
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
  padding: 0 1rem;
}

.btn-search {
  color: white !important;
  font-weight: 500 !important;
}
</style>
