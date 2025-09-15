<template>
  <div class="container">
    <div class="header" style="padding-top: 2rem">
      <h2 class="title" style="font-weight: 800; font-size: 32px">Data History</h2>
    </div>
    <v-container>
      <v-card elevation="2" class="d-flex flex-column ga-3">
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
        </v-row>
        <div class="pa-5 w-100">
          <v-data-table
            :headers="headers"
            :items="tableData"
            class="elevation-3"
            v-model:page="page"
            :items-per-page="itemPerPage"
          >
            <template #item.no="{ index }">
              {{ (page - 1) * itemPerPage + index + 1 }}
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
  { title: 'No', value: 'no', width: '50px', align: 'center' },
  { title: 'Date Time', value: 'datetime' },
  { title: 'Debit', value: 'debit' },
  { title: 'Suhu', value: 'suhu' },
  { title: 'PH', value: 'ph' },
  { title: 'COD', value: 'cod' },
  { title: 'NH3N', value: 'nh3n' },
]

const pageCount = computed(() => Math.ceil(tableData.length / itemPerPage.value))

const onClear = () => {
  selectedDate.value = null
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
