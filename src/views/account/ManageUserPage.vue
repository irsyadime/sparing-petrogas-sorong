<template>
  <div class="container">
    <div class="header" style="padding-top: 2rem">
      <h2 class="title" style="font-weight: 800; font-size: 32px">Manage Users</h2>
    </div>
    <v-container>
      <v-card elevation="2" class="d-flex flex-column ga-3">
        <v-row class="pt-8 pl-8 pb-0">
          <col cols="3">
            <v-btn prepend-icon="mdi-plus" color="#61c134" class="btn-add" @click="openAddDialog">
              Add User
            </v-btn>
          </col>
        </v-row>
        <div class="pa-5">
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

            <template #item.actions="{ item }">
              <v-btn
                icon="mdi-pencil"
                color="blue"
                class="mr-2"
                variant="text"
                @click="openEditDialog(item)"
              ></v-btn>
              <v-btn
                icon="mdi-delete"
                color="red"
                class="mr-2"
                variant="text"
                @click="deleteUser(item)"
              ></v-btn>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-container>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ isEdit ? 'Edit User' : 'Add User' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="saveUser">
            <v-text-field 
              v-model="form.username"
              label="Username"
              required
            />
            <v-text-field 
              v-model="form.password"
              type="password"
              label="Password"
              required
              :disabled="isEdit"
            />
            <v-text-field 
              v-model="form.email"
              label="Email"
              type="email"
              required
            />
            <v-select 
              v-model="form.role"
              :items="['Admin', 'User']"
              label="Role"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser">
            {{ isEdit ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'

const page = ref(1)
const itemPerPage = ref(5)

const dialog = ref(false)
const isEdit = ref(false)
const formRef= ref(null)

const form = ref({
  idL:null,
  username: '',
  password:'',
  email: '',
  role: 'User',
})

const headers = [
  { title: 'No', key: 'no', width: '50px', align: 'center', sortable: false },
  { title: 'Username', key: 'username' },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Role', key: 'role', sortable: false },
  { title: 'Actions', key: 'actions', width: '150px', sortable: false, align: 'center' },
]

const tableData = ref([
  { id:1,username: 'john_doe',password:'1234', email: 'jhdoe@gmail.com', role: 'User' },
  { id:2,username: 'admin',password:'1234', email: 'admin@gmail.com', role: 'Admin' },
  { id:3,username: 'user_1',password:'1234', email: 'user1@gmail.com', role: 'User' },
])


const deleteUser = (item) => {
  console.log('Delete user:', item)
  tableData.value = tableData.value.filter((user) => user.id !== item.id)
}

const saveUser = () => {
  if (isEdit.value) {
    const index = tableData.value.findIndex(u => u.id === form.value.id)
    if (index !== -1) {
      tableData.value[index] = { ...form.value }
    }
  }
  else {
    tableData.value.push({ ...form.value })
  }
  dialog.value = false
}

const openAddDialog = () => {
  isEdit.value = false
  form.value = {
      id: null,
      username: '',
      password:'',
      email: '',
      role: 'User',
  }
    dialog.value = true
}

const openEditDialog = (item) => {
    isEdit.value = true
    form.value = { ...item }
    dialog.value = true
}

const closeDialog = () => {
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
.btn-add {
  color: white !important;
  font-weight: 500 !important;
}
</style>
