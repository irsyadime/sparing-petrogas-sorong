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

          <v-col cols="4">
            <v-btn
              size="x-large"
              color="#61c134"
              class="btn-search"
              @click="fetchDataHistory"
            >
              Cari
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

// --- Inject Day.js and set up date refs ---
//const dayjs = inject('dayjs')
const selectedDate = ref(null)
const formattedDate = computed({
  get: () =>
    selectedDate.value
      ? dayjs(selectedDate.value).format('DD-MMMM-YYYY')
      : '',
  set: (v) => {
    if (!v) selectedDate.value = null
  },
})
const onClear = () => {
  selectedDate.value = null
}

// --- Table & pagination state ---
const tableData   = ref([])
const cachedData  = ref({})     // { '2025-09-21': [ …rows… ] }
const itemPerPage = ref(10)
const page        = ref(1)
const menu        = ref(false)
const loading = ref(false)

const headers = [
  { title: 'No',        value: 'no',     width: '50px', align: 'center' },
  { title: 'Date Time', value: 'dtime' },
  { title: 'Debit',     value: 'debit' },
  { title: 'PH',        value: 'ph' },
  { title: 'COD',       value: 'cod' },
  { title: 'NH3N',      value: 'nh3n' },
  { title: 'Suhu',      value: 'suhu' },
  { title: 'Totalizer', value: 'volume' },
]

const pageCount = computed(() =>
  Math.ceil(tableData.value.length / itemPerPage.value)
)

// --- LocalStorage keys ---
const LS_DATE_KEY  = 'dataHistory:selectedDate'
const LS_CACHE_KEY = 'dataHistory:cachedData'

// Persist selectedDate → localStorage
watch(selectedDate, (d) => {
  if (d) {
    localStorage.setItem(LS_DATE_KEY, dayjs(d).format('YYYY-MM-DD'))
  } else {
    localStorage.removeItem(LS_DATE_KEY)
  }
})

// Persist entire cache → localStorage (deep watch)
watch(
  cachedData,
  (c) => {
    localStorage.setItem(LS_CACHE_KEY, JSON.stringify(c))
  },
  { deep: true }
)

function isToday(dateKey) {
  const todayInJST = dayjs().tz('Asia/Tokyo').format('YYYY-MM-DD')
  return dateKey === todayInJST
}

// --- Fetch logic ---
async function fetchDataHistory() {
  if (!selectedDate.value) return

  const dateKey = dayjs(selectedDate.value).format('YYYY-MM-DD')
  page.value = 1
  loading.value = true

  try {
    // Skip cache if it's today
    if (!isToday(dateKey) && Array.isArray(cachedData.value[dateKey])) {
      console.log('✅ Using cached data for:', dateKey)
      tableData.value = cachedData.value[dateKey]
      return
    }

    console.log('🌐 Fetching from API for:', dateKey)
    const res = await fetch('http://rumot-vps.com:1880/data-history', {
      method: 'POST',
      headers: {
        Authorization: 'test',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: dateKey }),
    })
    if (!res.ok) throw new Error(res.statusText)
    const data = await res.json()

    // ✅ Only cache if it's NOT today
    if (!isToday(dateKey)) {
      cachedData.value[dateKey] = Array.isArray(data) ? data : []
    }

    tableData.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('fetchDataHistory error:', err)
  } finally {
    loading.value = false
  }
}

// --- Restore & auto-fetch on mount ---
onMounted(async () => {
  //console.log('🕒 JST Today on mount:', dayjs().tz('Asia/Tokyo').format())
  // 1) Restore cache
  const raw = localStorage.getItem(LS_CACHE_KEY)
  if (raw) {
    try {
      cachedData.value = JSON.parse(raw)
      //console.log('✅ Restored cachedData from localStorage')
    } catch {
      console.warn('⚠️ Could not parse cachedData')
    }
  }

  // 2) Restore date
  const saved = localStorage.getItem(LS_DATE_KEY)
  if (saved) {
    selectedDate.value = dayjs(saved).toDate()
    //console.log('✅ Restored selectedDate:', saved)
  }

  // 3) Wait for Vue to flush reactivity, then decide
  await nextTick()

if (selectedDate.value) {
  const dateKey = dayjs(selectedDate.value).format('YYYY-MM-DD')
  if (!isToday(dateKey) && Array.isArray(cachedData.value[dateKey])) {
    //console.log('✅ onMounted: using restored cache for', dateKey)
    tableData.value = cachedData.value[dateKey]
    page.value = 1
  } else {
    //console.log('🌐 onMounted: today or no cache, fetching')
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