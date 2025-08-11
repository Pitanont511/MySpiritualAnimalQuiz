<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const quiz = useQuizStore()

const index = computed(() => Number(route.params.index ?? 0))
const question = computed(() => quiz.questions[index.value])

function goNext() {
  if (index.value < quiz.totalQuestions - 1) {
    router.push({ name: 'Question', params: { index: index.value + 1 } })
  } else {
    router.push({ name: 'Result' })
  }
}
</script>

<template>
  <main class="transition" :style="{ backgroundImage: `url(/backgrounds/transition-${index}.jpg)` }">
    <section class="panel">
      <p>{{ t(question?.transitionTextKey || 'transition.continue') }}</p>
      <button class="primary" @click="goNext">{{ t('common.continue') }}</button>
    </section>
  </main>
</template>

<style scoped>
.transition {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: grid;
  place-items: center;
  padding: 24px;
}
.panel {
  background: rgba(0,0,0,0.5);
  color: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 720px;
  width: 100%;
}
.primary { background: #646cff; color: white; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
</style>