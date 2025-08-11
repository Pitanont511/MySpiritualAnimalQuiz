<script setup lang="ts">
import { RouterView } from 'vue-router'
import ProgressBar from './components/ProgressBar.vue'
import MusicToggle from './components/MusicToggle.vue'
</script>

<template>
  <div class="app-root">
    <RouterView />
    <ProgressBar />
    <MusicToggle />
  </div>
</template>

<style>
html, body, #app { height: 100%; }
* { box-sizing: border-box; }
body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; background: #0b0f14; color: #e6e6e6; }

.app-root { min-height: 100vh; }
</style>
