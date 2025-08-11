<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { toPng } from 'html-to-image'
import { saveAs } from 'file-saver'
import { useQuizStore } from '../stores/quiz'

const { t } = useI18n()
const router = useRouter()
const quiz = useQuizStore()

const cardRef = ref<HTMLElement | null>(null)

async function download() {
  if (!cardRef.value) return
  const dataUrl = await toPng(cardRef.value, { cacheBust: true })
  saveAs(dataUrl, `${quiz.playerName || 'player'}-${quiz.resultAnimal.code}.png`)
}

function replay() {
  quiz.resetQuiz()
  router.push({ name: 'Intro' })
}

function backToResult() {
  router.push({ name: 'Result' })
}
</script>

<template>
  <main class="download" :style="{ backgroundImage: 'url(/backgrounds/download.jpg)' }">
    <section class="panel">
      <h2>{{ t('download.title') }}</h2>
      <p class="hint">{{ t('download.hint') }}</p>

      <div ref="cardRef" class="tarot-card">
        <div class="frame">
          <img class="art" :src="quiz.resultAnimal.imageUrl" :alt="t(quiz.resultAnimal.nameKey)" />
          <h3 class="title">{{ t(quiz.resultAnimal.nameKey) }}</h3>
          <p class="name">{{ quiz.playerName || '—' }}</p>
        </div>
      </div>

      <div class="actions">
        <button class="primary" @click="download">{{ t('common.download') }}</button>
        <button class="secondary" @click="backToResult">{{ t('result.title') }}</button>
        <button class="secondary" @click="replay">{{ t('common.restart') }}</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.download {
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
.tarot-card {
  display: grid;
  place-items: center;
  margin: 16px 0;
}
.frame {
  width: 320px;
  aspect-ratio: 2.5 / 4;
  background: radial-gradient(120px 120px at 50% 30%, rgba(255,255,255,0.25), rgba(255,255,255,0.05)), rgba(0,0,0,0.25);
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 16px;
  padding: 12px;
  display: grid;
  grid-template-rows: 1fr auto auto;
  gap: 8px;
}
.art { width: 100%; height: 100%; object-fit: cover; border-radius: 12px; }
.title { text-align: center; margin: 0; }
.name { text-align: center; opacity: 0.9; margin: 0; }
.actions { margin-top: 16px; display: flex; gap: 12px; flex-wrap: wrap; }
.primary { background: #42b883; color: #0b1c17; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.secondary { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.hint { opacity: 0.9; }
</style>