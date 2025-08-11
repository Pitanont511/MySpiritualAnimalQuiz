import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type LanguageCode = 'en' | 'zh'

export interface Choice {
  id: string
  labelKey: string
  // Weighting/MBTI mapping to be provided later
  vector?: Record<string, number>
}

export interface Question {
  id: string
  textKey: string
  choices: Choice[]
  transitionTextKey?: string
}

export interface ResultAnimal {
  code: string
  nameKey: string
  descriptionKey: string
  funFactKey: string
  imageUrl?: string
}

export const useQuizStore = defineStore('quiz', () => {
  // Placeholder questions; will be replaced with real content later
  const questions = ref<Question[]>([
    {
      id: 'q1',
      textKey: 'quiz.q1.text',
      transitionTextKey: 'quiz.q1.transition',
      choices: [
        { id: 'q1a', labelKey: 'quiz.q1.a' },
        { id: 'q1b', labelKey: 'quiz.q1.b' },
        { id: 'q1c', labelKey: 'quiz.q1.c' },
      ],
    },
    {
      id: 'q2',
      textKey: 'quiz.q2.text',
      transitionTextKey: 'quiz.q2.transition',
      choices: [
        { id: 'q2a', labelKey: 'quiz.q2.a' },
        { id: 'q2b', labelKey: 'quiz.q2.b' },
        { id: 'q2c', labelKey: 'quiz.q2.c' },
      ],
    },
    {
      id: 'q3',
      textKey: 'quiz.q3.text',
      transitionTextKey: 'quiz.q3.transition',
      choices: [
        { id: 'q3a', labelKey: 'quiz.q3.a' },
        { id: 'q3b', labelKey: 'quiz.q3.b' },
        { id: 'q3c', labelKey: 'quiz.q3.c' },
      ],
    },
  ])

  const playerName = ref('')
  const currentQuestionIndex = ref(0)
  const answers = ref<Record<string, string>>({}) // questionId -> choiceId

  const language = ref<LanguageCode>('en')

  const isMusicOn = ref(true)

  const totalQuestions = computed(() => questions.value.length)

  const progressRatio = computed(() => {
    const answered = Math.min(Object.keys(answers.value).length, totalQuestions.value)
    return totalQuestions.value === 0 ? 0 : answered / totalQuestions.value
  })

  function setPlayerName(name: string) {
    playerName.value = name
  }

  function setLanguage(lang: LanguageCode) {
    language.value = lang
  }

  function toggleMusic(on?: boolean) {
    if (typeof on === 'boolean') {
      isMusicOn.value = on
    } else {
      isMusicOn.value = !isMusicOn.value
    }
  }

  function answerCurrentQuestion(choiceId: string) {
    const q = questions.value[currentQuestionIndex.value]
    if (!q) return
    answers.value[q.id] = choiceId
  }

  function goToNextQuestion() {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
      currentQuestionIndex.value += 1
    }
  }

  function resetQuiz() {
    playerName.value = ''
    currentQuestionIndex.value = 0
    answers.value = {}
  }

  // Placeholder result mapping; real logic will come later
  const resultAnimal = computed<ResultAnimal>(() => {
    return {
      code: 'FOX',
      nameKey: 'result.fox.name',
      descriptionKey: 'result.fox.description',
      funFactKey: 'result.fox.funFact',
      imageUrl: '/animals/fox.png',
    }
  })

  return {
    // state
    questions,
    playerName,
    currentQuestionIndex,
    answers,
    language,
    isMusicOn,
    // getters
    totalQuestions,
    progressRatio,
    resultAnimal,
    // actions
    setPlayerName,
    setLanguage,
    toggleMusic,
    answerCurrentQuestion,
    goToNextQuestion,
    resetQuiz,
  }
})