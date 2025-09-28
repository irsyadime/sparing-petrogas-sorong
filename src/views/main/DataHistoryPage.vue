<template>
  <div class="container">
    <div class="header" style="padding-top: 2rem">
      <h2 class="title" style="font-weight: 800; font-size: 32px">
        Data History
      </h2>
    </div>

    <v-container>
      <v-card elevation="2" class="d-flex flex-column ga-3">
        <!-- Date picker + button -->
        <v-row class="pt-5 pl-5 pb-0">
          <v-col cols="3">
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              :offset="[0, 5]"
              location="bottom center"
              min-width="290px"
              max-width="290px"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  v-model="formattedDate"
                  label="Date"
                  variant="outlined"
                  readonly
                  clearable
                  @click:clear="onClear"
                >
                  <template #append-inner>
                    <v-icon icon="mdi-calendar-today" />
                  </template>
                </v-text-field>
              </template>
              <v-date-picker
                v-model="selectedDate"
                @update:model-value="menu = false"
              />
            </v-menu>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="selectedDevice"
              :items="deviceOptions"
              label="Device"
              variant="outlined"
              clearable
              required
            />
          </v-col>
          <v-col cols="4">
          <v-btn
            size="x-large"
            color="#61c134"
            class="btn-search"
            @click="fetchDataHistory"
            :disabled="isSearchDisabled"
          >
            Cari
          </v-btn>
          <v-btn
            size="x-large"
            color="#2196f3"
            class="ml-4"
            :disabled="tableData.length === 0"
            @click="downloadCSV"
          >
            Download CSV
          </v-btn>
          </v-col>
        </v-row>

        <!-- Data table -->
        <div class="pa-5 w-100">
  <v-skeleton-loader
    v-if="loading"
    type="table"
    class="elevation-3"
  />

  <v-data-table
    v-else
    :headers="headers"
    :items="tableData"
    class="elevation-3"
    v-model:page="page"
    v-model:items-per-page="itemPerPage"
    :server-items-length="tableData.length"
  >
    <template #item.no="{ index }">
      {{ (page - 1) * itemPerPage + index + 1 }}
    </template>

    <!-- <template #bottom>
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
import { ref, computed, inject, onMounted, nextTick, watch } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

// --- State ---
const selectedDate = ref(null)
const selectedDevice = ref('kmt') // default device
const deviceOptions = ['kmt', 'matoa']

const formattedDate = computed({
  get: () => selectedDate.value ? dayjs(selectedDate.value).format('DD-MMMM-YYYY') : '',
  set: (v) => { if (!v) selectedDate.value = null }
})

const isSearchDisabled = computed(() => {
  return !selectedDate.value || !selectedDevice.value
})

const onClear = () => {
  selectedDate.value = null
}

const tableData   = ref([])
const cachedData  = ref({}) // { 'kmt:2025-09-21': [ …rows… ] }
const itemPerPage = ref(10)
const page        = ref(1)
const menu        = ref(false)
const loading     = ref(false)

const headers = [
  { title: 'No',        value: 'no',        width: '50px', align: 'center' },
  { title: 'Device',    value: 'device_id' },
  { title: 'Date Time', value: 'dtime' },
  { title: 'Flow (m3/jam)',     value: 'debit' },
  { title: 'PH',        value: 'ph' },
  { title: 'COD (mg/L)',       value: 'cod' },
  { title: 'NH3N (mg/L)',      value: 'nh3n' },
  { title: 'Suhu (C)',      value: 'suhu' },
  { title: 'Totalizer (m3)', value: 'volume' },
]

const pageCount = computed(() =>
  Math.ceil(tableData.value.length / itemPerPage.value)
)

// --- LocalStorage keys ---
const LS_DATE_KEY   = 'dataHistory:selectedDate'
const LS_DEVICE_KEY = 'dataHistory:selectedDevice'
const LS_CACHE_KEY  = 'dataHistory:cachedData'

// --- Watchers ---
watch(selectedDate, (d) => {
  if (d) {
    localStorage.setItem(LS_DATE_KEY, dayjs(d).format('YYYY-MM-DD'))
  } else {
    localStorage.removeItem(LS_DATE_KEY)
  }
})

watch(selectedDevice, (d) => {
  if (d) {
    localStorage.setItem(LS_DEVICE_KEY, d)
  } else {
    localStorage.removeItem(LS_DEVICE_KEY)
  }
})

watch(cachedData, (c) => {
  localStorage.setItem(LS_CACHE_KEY, JSON.stringify(c))
}, { deep: true })

function isToday(dateKey) {
  const todayInJST = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
  return dateKey === todayInJST
}

// --- Fetch logic ---
async function fetchDataHistory() {
  if (!selectedDate.value || !selectedDevice.value) return

  const dateKey = dayjs(selectedDate.value).format('YYYY-MM-DD')
  const cacheKey = `${selectedDevice.value}:${dateKey}`
  page.value = 1
  loading.value = true

  try {
    if (!isToday(dateKey) && Array.isArray(cachedData.value[cacheKey])) {
      console.log('✅ Using cached data for:', cacheKey)
      tableData.value = cachedData.value[cacheKey]
      return
    }

    console.log('🌐 Fetching from API for:', cacheKey)
    const res = await fetch('http://rumot-vps.com:1880/data-history', {
      method: 'POST',
      headers: {
        Authorization: 'test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: dateKey,
        device_id: selectedDevice.value,
      }),
    })

    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()

    if (!isToday(dateKey)) {
      cachedData.value[cacheKey] = Array.isArray(data) ? data : []
    }

    tableData.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('fetchDataHistory error:', err)
  } finally {
    loading.value = false
  }
}

function downloadCSV() {
  if (!selectedDate.value || !selectedDevice.value || tableData.value.length === 0) return;

  const dateStr = dayjs(selectedDate.value).format('YYYY-MM-DD');
  const filename = `${selectedDevice.value}_${dateStr}.csv`;

  const columns = headers.map(h => h.title);
  const keys = headers.map(h => h.value);

  const rows = tableData.value.map(row =>
    keys.map(key => `"${row[key] ?? ''}"`).join(',')
  );

  const csvContent = [columns.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --- Restore & auto-fetch on mount ---
onMounted(async () => {
  const rawCache = localStorage.getItem(LS_CACHE_KEY)
  if (rawCache) {
    try {
      cachedData.value = JSON.parse(rawCache)
    } catch {
      console.warn('⚠️ Could not parse cachedData')
    }
  }

  const savedDate = localStorage.getItem(LS_DATE_KEY)
  if (savedDate) {
    selectedDate.value = dayjs(savedDate).toDate()
  }

  const savedDevice = localStorage.getItem(LS_DEVICE_KEY)
  if (savedDevice) {
    selectedDevice.value = savedDevice
  }

  await nextTick()

  if (selectedDate.value && selectedDevice.value) {
    const dateKey = dayjs(selectedDate.value).format('YYYY-MM-DD')
    const cacheKey = `${selectedDevice.value}:${dateKey}`
    if (!isToday(dateKey) && Array.isArray(cachedData.value[cacheKey])) {
      tableData.value = cachedData.value[cacheKey]
      page.value = 1
    } else {
      fetchDataHistory()
    }
  }
})
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