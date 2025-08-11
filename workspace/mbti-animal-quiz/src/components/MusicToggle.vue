<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { Howl } from 'howler'
import { useQuizStore } from '../stores/quiz'

const quiz = useQuizStore()
let sound: Howl | null = null

onMounted(() => {
  try {
    sound = new Howl({
      src: ['/audio/background.mp3'],
      loop: true,
      volume: 0.4,
      html5: true,
    })
    if (quiz.isMusicOn) sound.play()
  } catch (e) {
    // ignore
  }
})

onUnmounted(() => {
  if (sound) {
    sound.stop()
    sound.unload()
    sound = null
  }
})

watch(
  () => quiz.isMusicOn,
  (on) => {
    if (!sound) return
    if (on) {
      try { sound.play() } catch {}
    } else {
      try { sound.pause() } catch {}
    }
  },
)

function toggle() {
  quiz.toggleMusic()
}
</script>

<template>
  <button class="music-toggle" @click="toggle" :aria-pressed="quiz.isMusicOn">
    <span v-if="quiz.isMusicOn">🔊</span>
    <span v-else>🔇</span>
  </button>
</template>

<style scoped>
.music-toggle {
  position: fixed;
  right: 12px;
  bottom: 12px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.music-toggle:hover {
  background: rgba(0,0,0,0.65);
}
</style>