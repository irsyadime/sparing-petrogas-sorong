<template>
  <div class="layout">
    <Sidebar />

    <div class="content-wrapper">
      <Navbar />

      <main class="main-content">
        <router-view />
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* Sidebar area */
.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Main scrollable content */
.main-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f2f2f2;
}
</style>
