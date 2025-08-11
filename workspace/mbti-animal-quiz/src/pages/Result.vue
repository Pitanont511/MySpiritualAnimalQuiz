<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const { t } = useI18n()
const router = useRouter()
const quiz = useQuizStore()

function replay() {
  quiz.resetQuiz()
  router.push({ name: 'Intro' })
}

function goDownload() {
  router.push({ name: 'Download' })
}
</script>

<template>
  <main class="result" :style="{ backgroundImage: 'url(/backgrounds/result.jpg)' }">
    <section class="panel">
      <h2>{{ t('result.title') }}</h2>
      <div class="card">
        <img class="animal" :src="quiz.resultAnimal.imageUrl" :alt="t(quiz.resultAnimal.nameKey)" />
        <div class="meta">
          <div><strong>{{ t('result.name') }}:</strong> {{ quiz.playerName || '—' }}</div>
          <div><strong>{{ t('result.animal') }}:</strong> {{ t(quiz.resultAnimal.nameKey) }}</div>
          <p>{{ t(quiz.resultAnimal.descriptionKey) }}</p>
          <p><em>{{ t(quiz.resultAnimal.funFactKey) }}</em></p>
        </div>
      </div>
      <div class="actions">
        <button class="primary" @click="goDownload">{{ t('common.download') }}</button>
        <button class="secondary" @click="replay">{{ t('common.restart') }}</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.result {
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
  max-width: 900px;
  width: 100%;
}
.card { display: grid; grid-template-columns: 240px 1fr; gap: 16px; align-items: center; }
.animal { width: 100%; border-radius: 12px; background: rgba(255,255,255,0.1); }
.actions { margin-top: 16px; display: flex; gap: 12px; }
.primary { background: #42b883; color: #0b1c17; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 10px 16px; border-radius: 10px; cursor: pointer; }
</style>