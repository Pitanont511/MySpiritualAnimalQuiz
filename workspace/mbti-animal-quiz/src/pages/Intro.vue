<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useQuizStore, type LanguageCode } from '../stores/quiz'

const { t, locale } = useI18n()
const router = useRouter()
const quiz = useQuizStore()

function start() {
  router.push({ name: 'Question', params: { index: 0 } })
}

function setLang(lang: LanguageCode) {
  quiz.setLanguage(lang)
  locale.value = lang
}
</script>

<template>
  <main class="intro" :style="{ backgroundImage: 'url(/backgrounds/intro.jpg)' }">
    <section class="panel">
      <h1>{{ t('intro.title') }}</h1>
      <p class="desc">{{ t('intro.description') }}</p>

      <label class="row">
        <span>{{ t('common.yourName') }}</span>
        <input v-model="quiz.playerName" placeholder="Alex" />
      </label>

      <label class="row">
        <span>{{ t('common.language') }}</span>
        <select :value="quiz.language" @change="setLang(($event.target as HTMLSelectElement).value as LanguageCode)">
          <option value="en">English</option>
          <option value="zh">中文</option>
        </select>
      </label>

      <div class="actions">
        <button class="primary" @click="start">{{ t('common.start') }}</button>
        <router-link class="link" :to="{ name: 'Brand' }">{{ t('common.brand') }}</router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
.intro {
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
.desc { opacity: 0.9; }
.row { display: grid; grid-template-columns: 140px 1fr; gap: 12px; align-items: center; margin: 12px 0; }
input, select { width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); color: white; }
.actions { display: flex; gap: 12px; margin-top: 16px; }
.primary { background: #42b883; color: #0b1c17; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
.link { color: #fff; text-decoration: underline; }
</style>