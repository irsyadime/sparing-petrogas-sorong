<template>
  <aside :class="['sidebar', { collapsed }]">
    <div class="sidebar-header">
      <!-- <h3>Petrogas</h3> -->
      <img src="../assets/logopetrogas 1.png" alt="logo" class="logo" />
    </div>
    <v-divider :thickness="2" style="color: black"></v-divider>
    <nav class="nav-links">
      <template v-for="(section, index) in menuSections" :key="index">
        <div class="nav-item parent-item" @click="toggleSubmenu(index)">
          <!-- <span class="icon">{{ section.icon }}</span> -->
          <span v-if="!collapsed">{{ section.label }}</span>
          <span v-if="!collapsed" class="submenu-arrow">
            {{ openSubmenus[index] ? '▾' : '▸' }}
          </span>
        </div>
        <div v-if="openSubmenus[index] && !collapsed" class="submenu">
          <RouterLink
            v-for="item in section.children"
            :key="item.label"
            :to="item.to"
            class="nav-sub-item"
            exact-active-class="active"
          >
            <span class="icon">{{ item.icon }}</span>
            {{ item.label }}
          </RouterLink>
        </div>
        <v-divider v-if="openSubmenus[index]" :thickness="2" style="color: black"></v-divider>
      </template>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const collapsed = ref(false)
const openSubmenus = ref({})

const toggleSidebar = () => {
  collapsed.value = !collapsed.value
  if (collapsed.value) {
    openSubmenus.value = {}
  }
}

const toggleSubmenu = (index) => {
  if (collapsed.value) collapsed.value = false
  openSubmenus.value[index] = !openSubmenus.value[index]
}

const menuSections = [
  {
    label: 'Main Navigation',
    children: [
      { icon: '🖥️', label: 'Parameter', to: '/' },
      { icon: '📊', label: 'Data History', to: '/datahistory' },
      { icon: '🔔', label: 'Alarm', to: '/alarm' },
    ],
  },
  {
    label: 'Account Management',
    children: [
      { icon: '👥', label: 'Manage Users', to: '/setting/manageuser' },
      { icon: '🚪', label: 'Logout', to: '/auth/logout' },
    ],
  },
]

onMounted(() => {
  menuSections.forEach((section, index) => {
    if (section.children.some((child) => route.path.startsWith(child.to))) {
      openSubmenus.value[index] = true
      collapsed.value = false
    }
  })
})
</script>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #f9fafb;
  color: #1d1b20;
  height: 100vh;
  padding: 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow-y: auto;
  /* border-right: 1px solid #ddd; */
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.2);
}
.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-top: -40px;
}

.logo {
  width: 202px;
  height: 202px;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item,
.parent-item {
  color: #1d1b20;
  text-decoration: none;
  font-weight: 700;
  padding: 0.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nav-item:hover,
.parent-item:hover {
  background-color: #61c134;
  color: #1d1b20;
}

.nav-item.active,
.nav-sub-item.active {
  background-color: #61c134;
  color: #1d1b20;
  font-weight: 600;
}

.submenu {
  padding-left: 2.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-sub-item {
  color: #1d1b20;
  font-size: 0.9rem;
  text-decoration: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.nav-sub-item:hover {
  background-color: #61c134;
  color: #1d1b20;
}

.icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.submenu-arrow {
  margin-left: auto;
  font-size: 1.2rem;
  line-height: 1;
}
</style>
