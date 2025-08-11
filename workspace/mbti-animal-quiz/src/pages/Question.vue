<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const quiz = useQuizStore()

const index = computed(() => Number(route.params.index ?? quiz.currentQuestionIndex))
const question = computed(() => quiz.questions[index.value])

function selectChoice(choiceId: string) {
  quiz.answerCurrentQuestion(choiceId)
  // Go to transition screen if there is one, else next question or result
  if (question.value?.transitionTextKey) {
    router.push({ name: 'Transition', params: { index: index.value } })
  } else if (index.value < quiz.totalQuestions - 1) {
    router.push({ name: 'Question', params: { index: index.value + 1 } })
  } else {
    router.push({ name: 'Result' })
  }
}
</script>

<template>
  <main
    class="question"
    :style="{ backgroundImage: `url(/backgrounds/question-${index}.jpg)` }"
  >
    <section v-if="question" class="panel">
      <h2>{{ t(question.textKey) }}</h2>
      <ul class="choices">
        <li v-for="c in question.choices" :key="c.id">
          <button class="choice" @click="selectChoice(c.id)">{{ t(c.labelKey) }}</button>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.question {
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
.choices { list-style: none; padding: 0; margin: 16px 0 0; display: grid; gap: 12px; }
.choice { width: 100%; text-align: left; padding: 12px 14px; background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; cursor: pointer; }
.choice:hover { background: rgba(255,255,255,0.2); }
</style>