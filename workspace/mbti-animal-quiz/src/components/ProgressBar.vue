<script setup lang="ts">
import { computed } from 'vue'
import { useQuizStore } from '../stores/quiz'

const quiz = useQuizStore()
const widthPercent = computed(() => `${Math.round(quiz.progressRatio * 100)}%`)
</script>

<template>
  <div class="progress-root" role="progressbar" :aria-valuenow="Math.round(quiz.progressRatio*100)" aria-valuemin="0" aria-valuemax="100">
    <div class="progress-fill" :style="{ width: widthPercent }" />
  </div>
</template>

<style scoped>
.progress-root {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 6px;
  background: rgba(255,255,255,0.25);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b883, #646cff);
  transition: width 250ms ease;
}
</style>