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
              <v-btn size="large" color="#61c134" class="btn-search" @click="openDialog">
                <v-icon icon="mdi-cog" class="mr-2" />
                Settings
              </v-btn>
            </div>
          </v-col>
        </v-row>
        <div class="pa-5 w-100">
          <v-data-table
            :headers="headers"
            :items="processedData"
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
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="font-weight-bold">Alarm Settings</v-card-title>
        <v-card-text>
          <v-row>
            <v-col v-for="param in Object.keys(tempSettings)" :key="param" cols="12" md="6">
              <v-card variant="outlined" class="pa-2">
                <strong class="text-capitalize">{{ param }}</strong>
                <v-text-field
                  v-model.number="tempSettings[param].low"
                  label="Low"
                  type="number"
                  density="compact"
                />
                <v-text-field
                  v-model.number="tempSettings[param].high"
                  label="High"
                  type="number"
                  density="compact"
                />
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="cancelDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveSettings">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, inject, reactive, onMounted } from 'vue'

const dayjs = inject('dayjs')
const itemPerPage = ref(5)
const page = ref(1)
const menu = ref(false)
const dialog = ref(false)
const tempSettings = ref({})
const selectedDate = ref(null)
const formattedDate = computed({
  get: () => (selectedDate.value ? dayjs(selectedDate.value).format('DD-MMMM-YYYY') : ''),
  set: (val) => {
    if (!val) {
      selectedDate.value = null
    }
  },
})

const defaultSettings = {
  flow: { low: 10, high: 100 },
  ph: { low: 6.5, high: 8.5 },
  cod: { low: 20, high: 80 },
  nh3n: { low: 1, high: 5 },
  temp: { low: 20, high: 35 },
}

const alarmSettings = ref({ ...defaultSettings })

onMounted(() => {
  const saved = localStorage.getItem('alarmSettings')
  if (saved) {
    alarmSettings.value = JSON.parse(saved)
  } else {
    localStorage.setItem('alarmSettings', JSON.stringify(alarmSettings.value))
  }
})

const headers = [
  { title: 'No', key: 'no', width: '50px', align: 'center', sortable: false },
  { title: 'Waktu Alarm', key: 'timestamp' },
  { title: 'Parameter', key: 'parameter', sortable: false },
  { title: 'Nilai Terukur', key: 'value', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  // { title: 'Severity', key: 'severity' },
  { title: 'PIR', key: 'pir', sortable: false },
  { title: 'Lokasi', key: 'location', sortable: false },
]

const tableData = ref([
  {
    timestamp: '2025-09-12 10:30:00',
    parameter: 'pH',
    value: 8,
    severity: 'Critical',
    location: 'Outlet 1',
    pir: 1,
  },
  {
    timestamp: '2025-09-12 09:45:00',
    parameter: 'cod',
    value: 40,
    severity: 'Warning',
    location: 'Outlet 2',
    pir: 0,
  },
  {
    timestamp: '2025-09-12 08:20:00',
    parameter: 'nh3n',
    value: 2.1,
    severity: 'Info',
    location: 'Outlet 1',
    pir: 1,
  },
])

const pageCount = computed(() => Math.ceil(tableData.length / itemPerPage.value))

const processedData = computed(() => {
  return tableData.value.map((row) => {
    const setting = alarmSettings.value[row.parameter.toLowerCase()]
    let status = 'NORMAL'
    if (setting) {
      if (row.value < setting.low) status = 'LOW'
      else if (row.value > setting.high) status = 'HIGH'
    }
    return {
      ...row,
      status, // status baru berdasarkan setting
    }
  })
})

const onClear = () => {
  selectedDate.value = null
}

const getStatusColor = (status) => {
  if (status === 'HIGH') return 'red'
  if (status === 'LOW') return 'orange'
  return 'green'
}
const getPirColor = (pir) => {
  return pir == 1 ? 'red' : 'green'
}

const openDialog = () => {
  tempSettings.value = JSON.parse(JSON.stringify(alarmSettings.value))
  dialog.value = true
}

const cancelDialog = () => {
  dialog.value = false
}

const saveSettings = () => {
  alarmSettings.value = JSON.parse(JSON.stringify(tempSettings.value))
  localStorage.setItem('alarmSettings', JSON.stringify(alarmSettings.value))
  dialog.value = false
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
