<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

function back() {
  router.push({ name: 'Intro' })
}
</script>

<template>
  <main class="brand" :style="{ backgroundImage: 'url(/backgrounds/brand.jpg)' }">
    <section class="panel">
      <h2>{{ t('brand.title') }}</h2>
      <p class="desc">{{ t('brand.description') }}</p>
      <div class="ad">
        <div class="slot">Ad slot / Activity banner</div>
        <div class="slot">Event carousel / Links</div>
      </div>
      <button class="primary" @click="back">{{ t('common.start') }}</button>
    </section>
  </main>
</template>

<style scoped>
.brand {
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
.ad { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0; }
.slot { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; min-height: 140px; display: grid; place-items: center; }
.primary { background: #42b883; color: #0b1c17; border: none; padding: 10px 16px; border-radius: 10px; cursor: pointer; }
</style>