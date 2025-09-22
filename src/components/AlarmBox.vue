<template>
  <div
    class="parameter-value"
    :class="{ alarm: props.status === 'on' && !acknowledged }"
    @click="acknowledge"
  >
    <p class="pa-3" style="color: white">{{ value }} {{ unit }}</p>
    <audio ref="alarmSound" loop>
      <source src="/alarm2.mp3" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  value: { type: String, required: true },
  status: { type: String, default: 'off' }, // on / off
  name: { type: String },
  unit: { type: String },
})
const emits = defineEmits(['update:status'])

const alarmSound = ref(null)
// local state acknowledge
const acknowledged = ref(false)

const acknowledge = () => {
  if (props.status === 'on') {
    acknowledged.value = true
    emits('update:status', 'off')
    if (alarmSound.value) {
      alarmSound.value.pause()
      alarmSound.value.currentTime = 0
    }
  }
}

watch(
  () => props.status,
  async (newVal) => {
    if (newVal === 'on') {
      acknowledged.value = false
      console.log('alarm sound ref ', alarmSound.value)
      if (alarmSound.value) {
        try {
          await alarmSound.value.play()
        } catch (e) {
          console.warn('Audio cannot play automatically:', e)
        }
      }
    } else {
      if (alarmSound.value) {
        alarmSound.value.pause()
        alarmSound.value.currentTime = 0
      }
    }
  },
)
</script>

<style scoped>
.parameter-value {
  border-radius: 0.375rem;
  background-color: #61c134; /* hijau default */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.parameter-value.alarm {
  background-color: red;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.2;
  }
  100% {
    opacity: 1;
  }
}
</style>
